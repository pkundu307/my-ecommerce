import React, { useState, useEffect } from "react";
import { RootState } from "../app/types";
import { useSelector } from "react-redux";

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  addresses: Address[];
}

const Profile: React.FC = () => {
  // Get the user from Redux or localStorage
  const storedUser = useSelector((state: RootState) => state.user.user);
  const userFromLocalStorage = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState<UserProfile>(storedUser || userFromLocalStorage);

  useEffect(() => {
    if (storedUser) {
      setUser(storedUser);
    }
  }, [storedUser]);

  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [addingAddress, setAddingAddress] = useState<boolean>(false);

  const handleAddAddress = () => {
    setUser((prevUser) => ({
      ...prevUser,
      addresses: [...(prevUser.addresses || []), newAddress],
    }));
    setNewAddress({ street: "", city: "", state: "", zip: "" });
    setAddingAddress(false);
  };
  console.log(user.picture)
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <img
            src={user.picture || "https://via.placeholder.com/150"}
       
            alt={user.name || "User"}
            className="w-32 h-32 rounded-full border-2 border-gray-300"
          />
          <div className="ml-4 text-center md:text-left mt-4 md:mt-0">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Addresses</h3>
          <ul className="space-y-4">
            {user.addresses?.map((address, index) => (
              <li key={index} className="border p-4 rounded-md shadow">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
              </li>
            ))}
          </ul>

          {addingAddress ? (
            <div className="mt-6 border p-4 rounded-md shadow">
              <h4 className="text-lg font-semibold mb-4">Add New Address</h4>
              <input
                type="text"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                className="border p-2 rounded-md w-full mb-2"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="border p-2 rounded-md w-full mb-2"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="border p-2 rounded-md w-full mb-2"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={newAddress.zip}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zip: e.target.value })
                }
                className="border p-2 rounded-md w-full mb-2"
              />
              <button
                onClick={handleAddAddress}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
              >
                Add Address
              </button>
              <button
                onClick={() => setAddingAddress(false)}
                className="text-gray-600 ml-4"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingAddress(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-6"
            >
              Add New Address
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
