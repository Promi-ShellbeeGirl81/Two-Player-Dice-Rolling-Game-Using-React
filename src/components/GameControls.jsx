import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rollDice, resetGame } from '../gameSlice';
import { setMessage } from '../modalSlice';

const GameControls = () => {
  const dispatch = useDispatch();
  const { attempts, currentPlayer } = useSelector((state) => state.game);

  const handleRollDice = () => {
    // If both players have no attempts left, show message and disable the button
    if (attempts[0] === 0 && attempts[1] === 0) {
      dispatch(setMessage('Both players have no attempts left!'));
      return;
    }

    // If the current player has no attempts, immediately switch to the next player
    if (attempts[currentPlayer] === 0) {
      dispatch(rollDice()); // Proceed to the next player without rolling for the current player
      return;
    }

    // Otherwise, roll the dice
    dispatch(rollDice());
  };

  const handleResetGame = () => {
    dispatch(resetGame());
    dispatch(setMessage(null)); 
  };

  return (
    <div className="controls">
      <button
        onClick={handleRollDice}
        disabled={attempts[0] === 0 && attempts[1] === 0} // Disable if both players have no attempts left
      >
        Roll Dice (Player {currentPlayer + 1})
      </button>
      <button onClick={handleResetGame}>New Game</button>
    </div>
  );
};

export default GameControls;
