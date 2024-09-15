// Profile.tsx
import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, updateUserDetails } from '../app/userSlice';
import { RootState, AppDispatch } from '../app/store';
import AddressList from './Addresses';


const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  const handleUpdateUserDetails = () => {
    // Example: You can call updateUserDetails with the updated user data here
    dispatch(updateUserDetails(user));
  };
  // useEffect(() => {
  //   dispatch(fetchAddresses());
  // }, [dispatch]);

  // const handleUpdate = (addressId: string) => {
  //   const updatedAddress = { street: 'New Street', city: 'New City', state: 'New State', postalCode: '11111', country: 'New Country' };
  //   dispatch(updateAddress({ addressId, updatedAddress }));
  // };

  // const handleDelete = (addressId: string) => {
  //   dispatch(deleteAddress(addressId));
  // };

  // if (status === 'loading') {
  //   return <div>Loading...</div>;
  // }

  // if (status === 'failed') {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mt-4">
        <img src={user.picture} alt="Profile" className="w-16 h-16 rounded-full" />
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="mt-6">
        {/* Update button or other functionalities can be added here */}
        <button onClick={handleUpdateUserDetails} className="bg-blue-500 text-white p-2">
          Update Details
        </button>
      </div>
        <div>    
      <AddressList/>
    </div>
    </div>
  );
};

export default Profile;
