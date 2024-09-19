// src/OrderPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, selectCartItems, selectCartStatus } from "../app/cartSlice";
import axios from "axios";
import AddressList from './Addresses';
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const OrderPage: React.FC = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  

  const cartStatus = useSelector(selectCartStatus);

  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, cartStatus]);
  // Dummy data
  // const cart: CartItem[] = [
  //   { id: '1', name: 'Product 1', price: 29.99, quantity: 2 },
  //   { id: '2', name: 'Product 2', price: 49.99, quantity: 1 },
  // ];

  const addresses: Address[] = [
    {
      id: 'a1',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    },
    {
      id: 'a2',
      street: '456 Elm St',
      city: 'Othertown',
      state: 'TX',
      postalCode: '67890',
      country: 'USA',
    },
  ];

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('creditCard');

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(e.target.value);
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = () => {
    // Logic to place the order
    console.log('Order placed:', { selectedAddress, paymentMethod });
  };

  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-2">
           <div className='h-10 w-10'><img src={item.product.thumbnail || ""}
                    className="w-full h-full object-contain rounded-lg"
                    alt="Product Thumbnail"
                  /></div>
            <span>{item.product.title}</span>
            <span>{item.product.price}</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Total Amount</h2>
        <div className="text-xl font-bold">₹{totalAmount.toFixed(2)}</div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Select Address</h2>
        <select
          value={selectedAddress}
          onChange={handleAddressChange}
          className="border p-2 w-full"
        >
          <option value="">Select an address</option>
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {`${address.street}, ${address.city}, ${address.state} - ${address.postalCode}`}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          className="border p-2 w-full"
        >
          <option value="creditCard">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bankTransfer">Bank Transfer</option>
        </select>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-blue-500 text-white p-4 rounded w-full mt-4"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderPage;
