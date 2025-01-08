import { createSlice } from '@reduxjs/toolkit';
import { BOARD_SIZE, defaultImage } from '../constants/constants';
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
      if (state.isAnimating) return;
      state.isAnimating = true;

      // Check if the current player has any attempts left
      if (state.attempts[currentPlayer] === 0) {
        state.popupMessage = `Player ${currentPlayer + 1} has no attempts left and cannot play! Switching player.`;
        // Switch to the other player
        state.currentPlayer = 1 - currentPlayer;
        state.isAnimating = false;
        return;
      }

      const dice = Math.floor(Math.random() * 6) + 1;
      let startPosition = state.players[currentPlayer];
      let newPosition = startPosition;

      state.diceRoll[currentPlayer] = dice;
      state.diceImages[currentPlayer] = `/images/${dice}.png`;

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

          // Decrease attempt count and switch player
          if (state.attempts[currentPlayer] > 0) {
            state.attempts[currentPlayer] -= 1;
          }

          // Switch to the other player
          state.currentPlayer = 1 - currentPlayer;
          state.isAnimating = false;
          return;
        }

        // Update the position if valid
        newPosition += dice;
        state.popupMessage = `Player ${currentPlayer + 1} moved to position ${newPosition}! `;
      }

      // Handle multiple special cell effects
      let specialCell = state.specialCells[newPosition];

      // Apply special cell effects until there are no more special cells at the new position
      while (specialCell) {
        if (specialCell.type === 'position') {
          // Apply position change due to the special cell
          newPosition = Math.max(1, Math.min(BOARD_SIZE, newPosition + specialCell.value));
          state.popupMessage = `Player ${currentPlayer + 1} moved to position ${newPosition} due to special cell effect (position change: ${specialCell.value})! `;
        } else if (specialCell.type === 'attempts') {
          // Apply attempts change due to the special cell
          const newAttempts = Math.max(0, state.attempts[currentPlayer] + specialCell.value);
          state.attempts[currentPlayer] = newAttempts;
          state.popupMessage = `Player ${currentPlayer + 1} gained ${specialCell.value} attempts due to special cell effect (Current attempts: ${newAttempts})! `;
        }

        // Mark the special cell as applied (so it doesn't get reapplied)
        state.specialCells[newPosition] = {
          ...specialCell,
          applied: true,
        };

        // Check if the new position after applying the effect has another special cell
        specialCell = state.specialCells[newPosition];
      }

      // Set the player's final position after applying all special cells
      state.players[currentPlayer] = newPosition;
      state.playerAnimations[currentPlayer] = { startPosition, targetPosition: newPosition };

      // Check for win condition
      if (newPosition === BOARD_SIZE) {
        state.isAnimating = false;
        state.popupMessage = `Player ${currentPlayer + 1} wins! Congratulations!`;
        return;
      }

      // Handle no attempts left case
      if (state.attempts[0] === 0 && state.attempts[1] === 0) {
        state.popupMessage = "Both players have no attempts left! The game is over!";
      }

      // Switch player if not at the end
      if (state.attempts[currentPlayer] > 0) {
        state.attempts[currentPlayer] -= 1;
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




