// userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
const token = localStorage.getItem('token');

// Thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}` // Assuming token is stored in the user slice
      }
    });
    return response.data;
  }
);

// Thunk to update user details
export const updateUserDetails = createAsyncThunk(
  'user/updateUserDetails',
  async (updatedUser: any, { getState }) => {
    const state = getState() as RootState;
    const response = await axios.put('http://localhost:5000/api/auth/update', updatedUser, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    return response.data;
  }
);

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface UserState {
  id: string;
  name: string;
  email: string;
  picture: string;
  addresses: Address[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  picture: '',
  addresses: [],
  status: 'idle'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers:
  
  {


      setUser: (state, action: PayloadAction<any>) => {
        state.user = action.payload;
      },
      clearUser: (state) => {
        state.user = null;
      },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter((_, index) => index !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { _id, name, email, picture, addresses } = action.payload;
        state.id = _id;
        state.name = name;
        state.email = email;
        state.picture = picture;
        state.addresses = addresses;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        const { addresses } = action.payload;
        state.addresses = addresses;
      });
  }
});

export const { addAddress, deleteAddress,setUser,clearUser } = userSlice.actions;
export default userSlice.reducer;
