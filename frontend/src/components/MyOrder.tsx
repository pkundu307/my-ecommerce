import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

interface Order {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  selectedAddress: string;
  items: {
    productId: {
      title: string;
      price: number;
      thumbnail: string;
    };
    quantity: number;
  }[];
  createdAt: string;
}

const MyOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>(""); // Track selected radio option
  const [inputValue, setInputValue] = useState<string>(""); // Store the input field value

  // Fetch orders for the logged-in user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/orders/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle cancel button click
  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId); // Store the selected order ID
    setShowPopup(true); // Show confirmation popup
  };

  // Function to handle actual cancellation or address change based on the selected option
  const handleCancelOrder = async () => {
    if (selectedOrderId) {
      setShowPopup(false);
      console.log(selectedOrderId,inputValue,cancelReason);
      
      try {
        if (cancelReason === "changeAddress") {
          // API call to update the address
          await axios.put(
            `http://localhost:5000/api/orders/updateAddress/${selectedOrderId}`,
            {
              newAddress: inputValue, // Pass the new address
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          toast.success("address updated successfully");
        } else if (cancelReason === "tellReason") {
          // API call to cancel the order with a reason
          await axios.put(
            `http://localhost:5000/api/orders/cancel/${selectedOrderId}`,
            {
              cancellationReason: inputValue, // Pass the cancellation reason
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          toast.success("order cancelled successfully 🥹");
        }
        setShowPopup(false); // Close the popup after API call
        setInputValue("")
      } catch (error) {
        console.error("Error processing request", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  // Function to calculate the difference in days between the order date and today
  const isCancelable = (orderDate: string): boolean => {
    const orderDateObj = new Date(orderDate);
    const today = new Date();
    const diffInTime = today.getTime() - orderDateObj.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays <= 4; // Return true if the order is within 4 days
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer/>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between"
          >
            {/* Order Details */}
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-semibold">Order ID: {order.id}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Status: {order.status}</p>
              <p>Address: {order.selectedAddress}</p>
              <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Items */}
            <div className="flex flex-col space-y-2 mt-4 md:mt-0">
              {order.items.map((item) => (
                <div key={item.productId.title} className="flex items-center space-x-4">
                  <img
                    src={item.productId.thumbnail}
                    alt={item.productId.title}
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.productId.title}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.productId.price}</p>
                  </div>
                </div>
              ))}
          {order.status !== "cancelled" ? (
  <div className="flex items-center mt-4 md:mt-0">
    <button
      className={`px-4 py-2 bg-red-500 text-white rounded-lg ${
        isCancelable(order.createdAt)
          ? "hover:bg-red-600"
          : "opacity-50 cursor-not-allowed"
      }`}
      onClick={() => handleCancelClick(order.id)}
      disabled={!isCancelable(order.createdAt)} // Disable if order is older than 4 days
    >
      Cancel Order
    </button>
  </div>
) : (
  <p className="text-red-500 font-semibold">Order Cancelled</p>
)}

            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <p className="text-lg mb-4">Why do you want to cancel this order?</p>

            {/* Radio buttons for cancellation reason */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cancelReason"
                  value="changeAddress"
                  checked={cancelReason === "changeAddress"}
                  onChange={() => setCancelReason("changeAddress")}
                  className="mr-2"
                />
                I want to change my address
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cancelReason"
                  value="tellReason"
                  checked={cancelReason === "tellReason"}
                  onChange={() => setCancelReason("tellReason")}
                  className="mr-2"
                />
                Tell us why you want to cancel your order
              </label>
            </div>

            {/* Conditionally render the input field based on selected option */}
            {cancelReason && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={
                    cancelReason === "changeAddress"
                      ? "Enter your new address"
                      : "Enter your reason for cancellation"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                onClick={() => (setShowPopup(false), setInputValue(""))}
                >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleCancelOrder} // Handle order cancellation or address change
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
