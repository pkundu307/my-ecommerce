import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchAddresses, updateAddress, deleteAddress, addAddress } from '../app/addressSlice';

const AddressList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, status, error } = useSelector((state: RootState) => state.address);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null); // To track which address is being edited

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleAddAddress = () => {
    dispatch(addAddress(newAddress));
    setNewAddress({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });
  };

  const handleUpdateAddress = (addressId: string) => {
    if (!editId) return;

    const updatedAddress = {
      _id: addressId,
      ...newAddress,
    };

    dispatch(updateAddress({ addressId, updatedAddress }));
    setIsEditing(false);
    setEditId(null); // Reset after updating
    setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      });
  };

  const handleEditClick = (address: any) => {
    setIsEditing(true);
    setEditId(address._id);
    setNewAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    dispatch(deleteAddress(addressId));
  };

  return (
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-semibold mb-4">Addresses</h2>

  {/* Form to Add/Update Address */}
  <div className="border p-4 mb-6">
    <h3 className="text-lg font-semibold mb-2">
      {isEditing ? 'Edit Address' : 'Add New Address'}
    </h3>
    <div className="grid grid-cols-1 gap-4">
      {/* ... Your input fields go here ... */}
      {/* Example: */}
      <input
        type="text"
        placeholder="Street"
        value={newAddress.street}
        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
        className="border p-2 rounded-md"
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
            placeholder="Postal Code"
            value={newAddress.postalCode}
            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Country"
            value={newAddress.country}
            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
            className="border p-2"
          />
      <button
        onClick={isEditing ? () => handleUpdateAddress(editId!) : handleAddAddress}
        className="bg-blue-500 text-white p-2 rounded-md mt-4"
      >
        {isEditing ? 'Update Address' : 'Add Address'}
      </button>
    </div>
  </div>

  {/* List of Addresses */}
  <div>
    {/* ... Your address list goes here ... */}
    {/* Example: */}
    {addresses.map((address) => (
      <div key={address._id} className="border p-2 mb-2 flex justify-between items-center rounded-md">
        <p>{`${address.street}, ${address.city}, ${address.state} - ${address.postalCode}`}</p>
        <div>
          <button
            className="text-blue-500 mr-4"
            onClick={() => handleEditClick(address)}
          >
            Edit
          </button>
          <button
            className="text-red-500"
            onClick={() => handleDeleteAddress(address._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default AddressList;
