import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

const generateAttempts = () => [Math.floor(Math.random() * 11) + 30, Math.floor(Math.random() * 11) + 30];

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

export const delayedCompleteMove = createAsyncThunk(
  'game/delayedCompleteMove',
  async ({ playerIndex, finalPosition }, { dispatch }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch(completeMove({ playerIndex, finalPosition }));
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    rollDice: (state) => {
      const dice = Math.floor(Math.random() * 6) + 1;
      const currentPlayer = state.currentPlayer;
      let startPosition = state.players[currentPlayer];
      let newPosition = startPosition;

      state.diceRoll[currentPlayer] = dice;

      if (startPosition === 0) {
        if (dice === 1) {
          newPosition = 1;
          state.players[currentPlayer] = newPosition;
          state.popupMessage = `Player ${currentPlayer + 1} rolled a 1 and started! `;
        } else {
          if (state.attempts[currentPlayer] > 0) {
            state.attempts[currentPlayer] -= 1;
          }
          state.popupMessage = `Player ${currentPlayer + 1} needs a 1 to start! `;

          if (state.attempts[1 - currentPlayer] > 0) {
            state.currentPlayer = 1 - currentPlayer;
          }
          return;
        }
      } else {
        const stepsTo100 = BOARD_SIZE - startPosition;

        if (dice > stepsTo100) {
          state.popupMessage = `Player ${currentPlayer + 1} rolled a ${dice}, but needs exactly ${stepsTo100} to reach 100! Try again!`;
          return;
        }
        newPosition += dice;
        state.popupMessage = `Player ${currentPlayer + 1} moved to position ${newPosition}! `;
      }

      if (newPosition === BOARD_SIZE) {
        state.popupMessage = `Player ${currentPlayer + 1} wins! Congratulations!`;
        return;
      }

      const specialCell = state.specialCells[newPosition];
      if (specialCell) {
        if (specialCell.type === 'position') {
          newPosition = Math.max(1, Math.min(BOARD_SIZE, newPosition + specialCell.value));
          state.popupMessage = `Player ${currentPlayer + 1} moved to position ${newPosition} due to special cell effect (position change: ${specialCell.value})! `;
        } else if (specialCell.type === 'attempts') {
          const newAttempts = Math.max(0, state.attempts[currentPlayer] + specialCell.value);
          state.attempts[currentPlayer] = newAttempts;
          state.popupMessage = `Player ${currentPlayer + 1} gained ${specialCell.value} attempts due to special cell effect (Current attempts: ${newAttempts})! `;
        }
        delete state.specialCells[newPosition];
      }

      state.players[currentPlayer] = newPosition;

      if (state.attempts[currentPlayer] > 0) {
        state.attempts[currentPlayer] -= 1;
      }

      state.playerAnimations[currentPlayer] = { startPosition, targetPosition: newPosition };

      if (state.attempts[0] === 0 && state.attempts[1] === 0) {
        state.popupMessage = "Both players have no attempts left! The game is over!";
      }

      if (state.attempts[0] > 0 || state.attempts[1] > 0) {
        state.currentPlayer = 1 - currentPlayer;
      }

      if (!state.popupMessage) {
        state.popupMessage = null;
      }
    },
    completeMove: (state, action) => {
      const { playerIndex, finalPosition } = action.payload;
      state.players[playerIndex] = finalPosition;
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
