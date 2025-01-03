import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import gameReducer from './gameSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    game: gameReducer
  },
});

export default store;
