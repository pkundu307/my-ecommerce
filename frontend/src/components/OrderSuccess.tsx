import React, { useEffect, useState } from "react";
import "../assets/sparkles.css"; // For custom sparkles animation
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface OrderSuccessProps {
  orderId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
  userId: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  selectedAddress: string;
  createdAt: string;
}

const OrderSuccess: React.FC = () => {
    const location = useLocation();
    const { orderId, items, totalAmount, userId, paymentMethod, paymentStatus, status, selectedAddress, createdAt } = location.state;
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Trigger celebration animation after 500ms for visual effect
    setTimeout(() => setShowCelebration(true), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      {showCelebration && (
        <div className="sparkles-container">
          {[...Array(20)].map((_, index) => (
            <div key={index} className={`sparkle sparkle-${index}`}></div>
          ))}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Order Placed Successfully!
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
          <p className="text-gray-600">
            Order ID: <span className="font-bold">{orderId}</span>
          </p>
          <p className="text-gray-600">
            Order Date:{" "}
            <span className="font-bold">{new Date(createdAt).toLocaleDateString()}</span>
          </p>
          <p className="text-gray-600">
            Status:{" "}
            <span
              className={`font-bold ${
                status === "pending" ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {status}
            </span>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Items</h2>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600">
                <span>Product ID: {item.productId}</span>
                <span>Quantity: {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Payment Info</h2>
          <p className="text-gray-600">
            Method: <span className="font-bold">{paymentMethod}</span>
          </p>
          <p className="text-gray-600">
            Status:{" "}
            <span
              className={`font-bold ${
                paymentStatus === "pending" ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {paymentStatus}
            </span>
          </p>
          <p className="text-gray-600">
            Total Amount: <span className="font-bold">₹{totalAmount}</span>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
          <p className="text-gray-600">Address ID: {selectedAddress}</p>
        </div>

        <div className="text-center">
          <button className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200">
            <Link to='/'>Continue Shopping</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
