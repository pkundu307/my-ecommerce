import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './types'; // Assuming you have this set up

interface CartItem {
  id: string;
  image: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
  };
}

export interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

// Fetch cart items by user ID (from JWT)
export const fetchCart = createAsyncThunk<CartItem[], void, { state: RootState }>(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/cart/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Update cart item quantity by productId
export const updateCart = createAsyncThunk<CartItem, { productId: string; quantity: number }, { state: RootState }>(
  'cart/updateCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/cart/cart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract the updated cart item
      const updatedItem = response.data.updatedCart;
      return updatedItem;  // Return updated item
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);



const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateCart.pending, (state) => {
        console.log(state,'s1');
        
        state.status = 'loading';
        state.error = null;
      })
 .addCase(updateCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
  state.status = 'succeeded';
  const updatedItem = action.payload;

  // Check if updatedItem and updatedItem.product exist
  if (!updatedItem || !updatedItem.product) {
    console.error('Updated item or product is undefined');
    return;
  }

  // Find the existing cart item and update the quantity
  const existingItem = state.items.find(item => item.product.id === updatedItem.product.id);

  if (existingItem) {
    existingItem.quantity = updatedItem.quantity;  // Assuming `updatedItem.quantity` is correct
  }
})
.addCase(updateCart.rejected, (state, action) => {
        console.log(state,'s2');
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});
export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
