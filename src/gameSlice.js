import { createSlice } from '@reduxjs/toolkit';

const BOARD_SIZE = 100;

const generateSpecialCells = () => {
  const numSpecialCells = Math.floor(Math.random() * 3) + 7;
  const specialCells = {};

  Array.from({ length: numSpecialCells }).forEach(() => {
    let cell;
    do {
      cell = Math.floor(Math.random() * (BOARD_SIZE - 8)) + 8;
    } while (specialCells[cell] || cell < 8 || cell > 97);

    const effectType = Math.random() > 0.5 ? 'position' : 'attempts';
    let value;

    if (effectType === 'position') {
      if (cell >= 90) {
        do {
          value = Math.floor(Math.random() * 6) - 6;
        } while (value === 0);
      } else if (cell <= 10) {
        do {
          value = Math.floor(Math.random() * 6) + 1;
        } while (value === 0);
      } else {
        do {
          value = Math.floor(Math.random() * 13) - 6;
        } while (value === 0);
      }
    } else {
      do {
        value = Math.floor(Math.random() * 11) - 5;
      } while (value === 0);
    }
    specialCells[cell] = { type: effectType, value };
  });

  return specialCells;
};

const generateBoard = () => {
  const board = [];

  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      if (i % 2 == 0) row.push(i * 10 + j + 1);
      else row.push(i * 10 + 10 - j);
    }
    board.push(row);
  }
  return board;
};


const generateAttempts = () => [Math.floor(Math.random() * 11) + 10, Math.floor(Math.random() * 11) + 10];

const initialState = {
  board: generateBoard(),
  specialCells: generateSpecialCells(),
  players: [0, 0],
  attempts: generateAttempts(),
  currentPlayer: 0,
  diceRoll: [0, 0],
  popupMessage: null,
  playerAnimations: [null, null],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    rollDice: (state) => {
      const dice = Math.floor(Math.random() * 6) + 1;
      const currentPlayer = state.currentPlayer;
    
      const startPosition = state.players[currentPlayer];
      let newPosition = startPosition + dice;
    
      if (newPosition > BOARD_SIZE) newPosition = BOARD_SIZE;
    
      const specialCell = state.specialCells[newPosition];
      if (specialCell) {
        if (specialCell.type === 'position') {
          newPosition = Math.max(1, Math.min(BOARD_SIZE, newPosition + specialCell.value));
        } else if (specialCell.type === 'attempts') {
          state.attempts[currentPlayer] = Math.max(0, state.attempts[currentPlayer] + specialCell.value);
        }
        delete state.specialCells[newPosition];
      }
    
      state.playerAnimations[currentPlayer] = { startPosition, targetPosition: newPosition };
    
      state.attempts[currentPlayer] -= 1;
    
      // Store the dice roll in the state
      state.diceRoll[currentPlayer] = dice;
    
      // Update turn
      state.currentPlayer = (currentPlayer === 0 ? 1 : 0);
    },      
    completeMove: (state, action) => {
      const { playerIndex, finalPosition } = action.payload;
      state.players = [...state.players]; 
      state.players[playerIndex] = finalPosition;
      state.playerAnimations = [...state.playerAnimations];
      state.playerAnimations[playerIndex] = null; 
    },
    resetGame: (state) => {
      state.players = [0, 0];
      state.diceRoll = [0, 0];
      state.playerAnimations = [null, null];
      state.specialCells = generateSpecialCells();
      state.attempts = generateAttempts();
      state.currentPlayer = 0;
      state.popupMessage = null;
    },
  },
});

export const { rollDice, resetGame, completeMove } = gameSlice.actions;
export default gameSlice.reducer;
