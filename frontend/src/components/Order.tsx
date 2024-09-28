import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  fetchCart,
  selectCartItems,
  selectCartStatus,
} from "../app/cartSlice";
import { fetchAddresses } from "../app/addressSlice";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import axios from "axios";

const OrderPage: React.FC = () => {
  const [isOrder, setIsOrder] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleDragEnd = (_event: any, info: any) => {
    if (info.point.x >= (sliderRef.current?.offsetWidth || 300) - 60) {
      handlePlaceOrder();
     
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined
  );

  const cartStatus = useSelector(selectCartStatus);

  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, cartStatus]);
  const { addresses, status, error } = useSelector(
    (state: RootState) => state.address
  );

  // Fetch addresses on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAddresses());
    }
  }, [dispatch, status]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(event.target.value);
    console.log(selectedAddress);
  };
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    undefined
  );
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const totalAmountBeforeDiscount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalAmount = totalAmountBeforeDiscount - discount;

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async () => {
    // Validate the selected address and payment method
    if (!selectedAddress) {
      toast.error("Please select an address before placing the order.", {
        position: "top-center",
      });
      return;
    }
  
    if (!paymentMethod) {
      toast.error("Please select a payment method.", {
        position: "top-center",
      });
      return;
    }
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
  
    // Map cart items to the required format
    const items = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
  
    const orderData = {
      items,
      selectedAddress,
      paymentMethod,
      totalAmount,
    };
  
    try {
      setIsOrder(true);
  
      if (paymentMethod === "online") {
        // Logic for online payment
        toast.info("Redirecting to online payment...");
        
        // Assuming you integrate with an online payment provider (e.g., Stripe or Razorpay)
        const paymentResponse = await initiateOnlinePayment(orderData);
        console.log('98989898',paymentResponse.success);
        
  
        if (paymentResponse.success) {
          // Handle order placement after successful online payment
          const response = await fetch("http://localhost:5000/api/orders/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({...orderData,paymentStatus:"completed"}),
          });
  
          if (response.ok) {
            const data = await response.json();
            toast.success("Online payment completed. Order placed successfully!", {
              position: "top-center",
            });
  
            // Clear the cart after placing the order
            await axios.put('http://localhost:5000/api/cart/clear', {}, {
              headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(clearCart());
            navigate("/order-success", { state: { ...data } });
          } else {
            throw new Error("Order placement failed after payment.");
          }
        } else {
          toast.error("Online payment failed. Please try again.", {
            position: "top-center",
          });
        }
  
      } else if (paymentMethod === "cash_on_delivery") {
        // Existing logic for cash on delivery
        const response = await fetch("http://localhost:5000/api/orders/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });
  
        if (response.ok) {
          const data = await response.json();
          toast.success("Order placed successfully!", {
            position: "top-center",
          });
  
          // Clear the cart after placing the order
          await axios.put('http://localhost:5000/api/cart/clear', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(clearCart());
          navigate("/order-success", { state: { ...data } });
        } else {
          throw new Error("Order placement failed.");
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Request failed. Please check your network and try again.", {
        position: "top-center",
      });
    }
  };
  
  // Dummy function to represent the online payment flow
  const initiateOnlinePayment = async (orderData: unknown) => {
    try {
      // Fetch the key for Razorpay
      const { data: { key } } = await axios.get('http://localhost:5000/api/orders/getkey', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      // Create the order on your backend
      const { data: { order, user } } = await axios.post(
        "http://localhost:5000/api/orders/onlinepay",
        orderData, // Pass orderData as the body of the request
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
  
      // Create Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "lootlo",
        description: "Razorpay tutorial",
        image: "https://builtin.com/sites/www.builtin.com/files/styles/og/public/2022-09/ecommerce.png",
        order_id: order.id,
        callback_url: "http://localhost:5000/api/orders/paymentverification",
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          "address": "Razorpay official"
        },
        theme: {
          color: "#67eb34"
        },
      };
  
      return new Promise((resolve, reject) => {
        // Initialize Razorpay instance
        const razor = new window.Razorpay({
          ...options,
          handler: (response: any) => {
            // Handle success callback when payment is completed
            console.log("Payment successful:", response);
            resolve({ success: true, order, paymentResponse: response });
          },
          modal: {
            ondismiss: () => {
              // Handle when user dismisses the payment modal
              console.log("Payment dismissed by user");
              setIsOrder(false);
              window.location.reload();
              reject({ success: false, message: "Payment dismissed by user" });
            }
          }
        });
  
        // Open the Razorpay payment modal
        razor.open();
      });
  
    } catch (error) {
      console.error("Error initiating online payment:", error);
      return { success: false, error: error.message }; // Return failure in case of an error
    }
  };
  
  

  const handleApplyCoupon = () => {
    // Example logic for applying coupon
    if (couponCode === "SAVE10") {
      setDiscount(totalAmountBeforeDiscount * 0.1);
      toast.success("Coupon applied! 10% discount", {
        position: "top-center",
      });
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">Order Summary</h1>

      {/* Toast Container for showing Toast notifications */}
      <ToastContainer />

      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="px-4 py-2 text-lg font-semibold text-gray-800"></th>
                <th className="px-4 py-2 text-lg font-semibold text-gray-800">
                  Product
                </th>
                <th className="px-4 py-2 text-lg font-semibold text-gray-800">
                  Quantity
                </th>
                <th className="px-4 py-2 text-lg font-semibold text-gray-800">
                  Price
                </th>
                <th className="px-4 py-2 text-lg font-semibold text-gray-800">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="h-16 w-16">
                      <img
                        src={item.product.thumbnail || ""}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                        alt="Product Thumbnail"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-800 break-words max-w-xs">
                    {item.product.title}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-2 text-gray-600">
                    ₹{item.product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          Total Amount
        </h2>
        <div className="text-2xl font-bold text-indigo-600">
          ₹{totalAmount.toFixed(2)}
        </div>
      </div>

      <div className="mb-6 mt-4">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Coupon</h2>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="p-2 w-full border rounded-md shadow-sm"
        />
        <button
          onClick={handleApplyCoupon}
          className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
        >
          Apply Coupon
        </button>
      </div>

      <div className="p-4 bg-gray-100 rounded-md">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Select an Address
        </h2>

        {status === "loading" && <p>Loading addresses...</p>}
        {status === "failed" && <p className="text-red-500">Error: {error}</p>}

        {status === "succeeded" && (
          <div>
            <label
              htmlFor="addressDropdown"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <select
              id="addressDropdown"
              value={selectedAddress || ""}
              onChange={handleSelectChange}
              className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm hover:border-indigo-500 transition duration-200 ease-in-out"
            >
              <option value="" disabled>
                -- Select an Address --
              </option>
              {addresses.map((address) => (
                <option
                  key={address._id}
                  value={address._id}
                  className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {`${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.postalCode}`}
                </option>
              ))}
            </select>

            {selectedAddress && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">Selected Address:</h3>
                <p>
                  {
                    addresses.find((addr) => addr._id === selectedAddress)
                      ?.street
                  }
                </p>
                <p>
                  {addresses.find((addr) => addr._id === selectedAddress)?.city}
                </p>
                <p>
                  {
                    addresses.find((addr) => addr._id === selectedAddress)
                      ?.state
                  }
                </p>
                <p>
                  {
                    addresses.find((addr) => addr._id === selectedAddress)
                      ?.postalCode
                  }
                </p>
                <p>
                  {
                    addresses.find((addr) => addr._id === selectedAddress)
                      ?.country
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 mt-4">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          Payment Method
        </h2>
        <select
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          className="border p-2 w-full rounded-md bg-white shadow-sm hover:border-indigo-500 transition duration-200 ease-in-out"
        >
          <option value="" disabled selected>
            Select a payment method
          </option>
          <option value="online">UPI/CREDIT CARD/DEBIT CARD/BANK TRANSFER</option>
          <option value="cash_on_delivery">Cash on Delivery</option>
        </select>
      </div>

      <div className="flex justify-center items-center w-full">
        <div className="relative w-screen max-w-sm bg-gradient-to-r from-gray-800 to-blue-600 p-4 rounded-2xl h-20 shadow-lg">
          <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
            {!isOrder ? (
              <span className="text-white font-semibold tracking-wider">
                Slide to Pay
              </span>
            ) : (
              <span className="text-white font-semibold tracking-wider">
                Payment Complete
              </span>
            )}
          </div>
          {!isOrder && (
            <motion.div
              ref={sliderRef}
              className="relative z-20 w-12 h-12 bg-white rounded-full cursor-pointer"
              drag="x"
              dragConstraints={{ left: 0, right: 240 }}
              dragElastic={0.3}
              onDragEnd={handleDragEnd}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 flex justify-center items-center">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
