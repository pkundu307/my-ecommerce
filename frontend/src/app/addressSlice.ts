import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

// Get JWT token from localStorage
const token = localStorage.getItem('token');

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressState {
  addresses: Address[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  status: 'idle',
  error: null,
};

// Fetch all addresses for the authenticated user
export const fetchAddresses = createAsyncThunk<Address[], void, { rejectValue: string }>(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update an address
export const updateAddress = createAsyncThunk<Address, { addressId: string; updatedAddress: Address }, { rejectValue: string }>(
  'address/updateAddress',
  async ({ addressId, updatedAddress }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/addresses/${addressId}`, updatedAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete an address
export const deleteAddress = createAsyncThunk<string, string, { rejectValue: string }>(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a new address
export const addAddress = createAsyncThunk<Address, Address, { rejectValue: string }>(
  'address/addAddress',
  async (newAddress, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/addresses/add', newAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.status = 'succeeded';
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'Error fetching addresses';
      })
      // Update address
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        const index = state.addresses.findIndex((address) => address._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Error updating address';
      })
      // Delete address
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
        state.addresses = state.addresses.filter((address) => address._id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Error deleting address';
      })
      // Add address
      .addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Error adding address';
      });
  },
});

export default addressSlice.reducer;
