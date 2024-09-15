// controllers/addressController.ts
import Address from '../models/address_entity.js';

// Add new address
export const addAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, country } = req.body;
    const { id } = req.user;
    console.log(req.user);
    
    const newAddress = new Address({
      street,
      user_id:id,
      city,
      state,
      postalCode,
      country
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error });
  }
};

// Delete address by ID
export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const user_id = req.user; // Assuming user is authenticated

    // Find the address and ensure it belongs to the authenticated user
    const deletedAddress = await Address.findOneAndDelete({ _id: addressId, user_id });
    
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found or not authorized' });
    }

    res.status(200).json({ message: 'Address deleted', deletedAddress });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};

// Update address by ID
export const updateAddress = async (req, res) => {
    try {
      const addressId = req.params.id;
      const user_id = req.user._id; // Assuming user is authenticated
      const { street, city, state, postalCode, country } = req.body;
  
      const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId, user_id }, // Ensure the address belongs to the user
        { street, city, state, postalCode, country },
        { new: true } // Return the updated document
      );
  
      if (!updatedAddress) {
        return res.status(404).json({ message: 'Address not found or not authorized' });
      }
  
      res.status(200).json(updatedAddress);
    } catch (error) {
      res.status(500).json({ message: 'Error updating address', error });
    }
  };
//get all addresses
  export const getAllAddresses = async (req, res) => {
    try {
      const user_id = req.user; // Assuming user is authenticated and user_id is available
      const addresses = await Address.find({ user_id }); // Fetch all addresses for the user
  
      if (!addresses.length) {
        return res.status(404).json({ message: 'No addresses found for this user' });
      }
  
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching addresses', error });
    }
  };