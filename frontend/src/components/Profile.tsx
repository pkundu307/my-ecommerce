// Profile.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, updateUserDetails, deleteAddress, addAddress } from '../app/userSlice';
import { RootState, AppDispatch } from '../app/store';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '' });

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  const handleAddAddress = () => {
    dispatch(addAddress(newAddress));
    dispatch(updateUserDetails({ ...user, addresses: [...user.addresses, newAddress] }));
    setNewAddress({ street: '', city: '', state: '', zip: '' }); // Reset form
  };

  const handleDeleteAddress = (index: number) => {
    dispatch(deleteAddress(index));
    dispatch(updateUserDetails({ ...user, addresses: user.addresses.filter((_, i) => i !== index) }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mt-4">
        <img src={user.picture} alt="Profile" className="w-16 h-16 rounded-full" />
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Address List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Addresses</h3>
        {user.addresses.map((address, index) => (
          <div key={index} className="border p-2 mt-2 flex justify-between items-center">
            <p>{`${address.street}, ${address.city}, ${address.state} - ${address.zip}`}</p>
            <button 
              className="text-red-500" 
              onClick={() => handleDeleteAddress(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add New Address */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Add New Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Street"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="State"
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={newAddress.zip}
            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
            className="border p-2"
          />
          <button onClick={handleAddAddress} className="bg-blue-500 text-white p-2 mt-4">
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
