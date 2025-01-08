import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modalSlice';
import gameReducer from './slices/gameSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    game: gameReducer
  },
});

export default store;
