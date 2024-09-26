import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Function to handle actual cancellation
  const confirmCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      // Make API call to cancel the order
      await axios.post(
        `http://localhost:5000/api/orders/cancel/${selectedOrderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      // Update order status locally after cancellation
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order", error);
    } finally {
      setShowPopup(false); // Close popup after cancelation
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
                      {order.status !== "Cancelled" && (
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
            )}
            
            </div>

 
    
          </div>
        ))}
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <p className="text-lg mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                onClick={() => setShowPopup(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={confirmCancelOrder}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
