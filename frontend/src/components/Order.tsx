// src/OrderPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, selectCartItems, selectCartStatus } from "../app/cartSlice";
import { fetchAddresses } from '../app/addressSlice';



const OrderPage: React.FC = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(undefined);

  const cartStatus = useSelector(selectCartStatus);

  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, cartStatus]);
  const { addresses, status, error } = useSelector((state: RootState) => state.address);

  // Fetch addresses on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAddresses());
    }
  }, [dispatch, status]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(event.target.value);
  };
  const [paymentMethod, setPaymentMethod] = useState<string>('creditCard');

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);


  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = () => {
    // Logic to place the order
    console.log('Order placed:', {  paymentMethod });
  };

  

  return (
<div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  <h1 className="text-4xl font-bold mb-6 text-indigo-600">Order Summary</h1>

  <div className="mb-6">
    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Products</h2>
    <table className="min-w-full bg-white border border-gray-200">
    <thead>
      <tr className="text-left border-b bg-gray-100">
        <th className="px-4 py-2 text-lg font-semibold text-gray-800"></th>
        <th className="px-4 py-2 text-lg font-semibold text-gray-800">product</th>
        <th className="px-4 py-2 text-lg font-semibold text-gray-800">Quantity</th>
        <th className="px-4 py-2 text-lg font-semibold text-gray-800">Price</th>
        <th className="px-4 py-2 text-lg font-semibold text-gray-800">Total</th>
      </tr>
    </thead>
    <tbody>
      {cart.map((item) => (
        <tr key={item.id} className="border-b hover:bg-gray-50">
          <td className="px-4 py-2">
            <div className='h-16 w-16'>
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
          <td className="px-4 py-2 text-gray-600">₹{item.product.price.toFixed(2)}</td>
          <td className="px-4 py-2 text-gray-600">₹{(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>

  <div className="mb-6">
    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Total Amount</h2>
    <div className="text-2xl font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</div>
  </div>

  <div className="p-4 bg-gray-100 rounded-md">
    <h2 className="text-lg font-bold mb-4 text-gray-800">Select an Address</h2>

    {status === 'loading' && <p>Loading addresses...</p>}
    {status === 'failed' && <p className="text-red-500">Error: {error}</p>}
    
    {status === 'succeeded' && (
      <div>
        <label htmlFor="addressDropdown" className="block mb-2 text-sm font-medium text-gray-700">
          Address
        </label>
        <select
          id="addressDropdown"
          value={selectedAddress}
          onChange={handleSelectChange}
          className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm hover:border-indigo-500 transition duration-200 ease-in-out"
        >
          <option value="" disabled>
            -- Select an Address --
          </option>
          {addresses.map((address) => (
            <option key={address._id} value={address._id}>
              {`${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.postalCode}`}
            </option>
          ))}
        </select>

        {selectedAddress && (
          <div className="mt-4">
            <h3 className="text-md font-semibold">Selected Address:</h3>
            <p>{addresses.find((addr) => addr._id === selectedAddress)?.street}</p>
            <p>{addresses.find((addr) => addr._id === selectedAddress)?.city}</p>
            <p>{addresses.find((addr) => addr._id === selectedAddress)?.state}</p>
            <p>{addresses.find((addr) => addr._id === selectedAddress)?.postalCode}</p>
            <p>{addresses.find((addr) => addr._id === selectedAddress)?.country}</p>
          </div>
        )}
      </div>
    )}
  </div>

  <div className="mb-6 mt-4">
    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Payment Method</h2>
    <select
      value={paymentMethod}
      onChange={handlePaymentMethodChange}
      className="border p-2 w-full rounded-md bg-white shadow-sm hover:border-indigo-500 transition duration-200 ease-in-out"
    >
      <option value="creditCard">Credit Card</option>
      <option value="paypal">PayPal</option>
      <option value="bankTransfer">Bank Transfer</option>
    </select>
  </div>

  <button
    onClick={handlePlaceOrder}
    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded w-full mt-4 transition duration-200 ease-in-out"
  >
    Place Order
  </button>
</div>

  );
};

export default OrderPage;
