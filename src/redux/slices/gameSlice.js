import { createSlice } from '@reduxjs/toolkit';
import { BOARD_SIZE } from '../constants/constants'; 
import { generateBoard, generateSpecialCells, generateAttempts } from '../utils/utils';

const initialState = {
  board: generateBoard(),
  specialCells: generateSpecialCells(),
  players: [0, 0],
  attempts: generateAttempts(),
  currentPlayer: 0,
  diceRoll: [0, 0],
  diceImages: ['', ''], 
  popupMessage: null,
  playerAnimations: [null, null],
  isAnimating: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    rollDice: (state) => {
      const currentPlayer = state.currentPlayer;
      state.diceImages[currentPlayer] = `/images/ludo.gif`; 
      if (state.isAnimating) return;
      state.isAnimating = true;
      console.log("After rollDice: isAnimating =", state.isAnimating);

      const dice = Math.floor(Math.random() * 6) + 1;
      let startPosition = state.players[currentPlayer];
      let newPosition = startPosition;

      state.diceRoll[currentPlayer] = dice;
      state.diceImages[currentPlayer] = `/images/${dice}.png`; 
      state.isAnimating = true;

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
          state.isAnimating = false;
          return;
        }
      } else {
        const stepsTo100 = BOARD_SIZE - startPosition;

        if (dice > stepsTo100) {
          state.popupMessage = `Player ${currentPlayer + 1} rolled a ${dice}, but needs exactly ${stepsTo100} to reach 100! Try again!`;
          state.isAnimating = false;
          return;
        }
        newPosition += dice;
        state.popupMessage = `Player ${currentPlayer + 1} moved to position ${newPosition}! `;
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
      state.playerAnimations[currentPlayer] = { startPosition, targetPosition: newPosition };

      if (newPosition === BOARD_SIZE) {
        setTimeout(() => {
          state.isAnimating = false; 
          state.popupMessage = `Player ${currentPlayer + 1} wins! Congratulations!`;
        }, 2000); 
        return;
      }

      if (state.attempts[currentPlayer] > 0) {
        state.attempts[currentPlayer] -= 1;
      }

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
      state.isAnimating = false;
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
