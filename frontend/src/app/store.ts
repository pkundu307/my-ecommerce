// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice'
import addressReducer from './addressSlice'; // Import your address slice

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    address: addressReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;