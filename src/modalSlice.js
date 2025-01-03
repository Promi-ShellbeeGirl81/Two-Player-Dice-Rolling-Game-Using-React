import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    message: null,
  },
  reducers: {
    setMessage(state, action) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
});

export const { setMessage, clearMessage } = modalSlice.actions;

export default modalSlice.reducer;
