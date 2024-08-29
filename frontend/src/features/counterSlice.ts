import { createSlice } from '@reduxjs/toolkit';

// Define the initial state type
interface CounterState {
  value: number;
}

// Define the initial state
const initialState: CounterState = {
  value: 0,
};

// Create a slice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

// Export the action
export const { increment } = counterSlice.actions;

// Export the reducer to be used in the store
export default counterSlice.reducer;
