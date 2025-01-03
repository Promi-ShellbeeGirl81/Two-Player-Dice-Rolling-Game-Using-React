import React from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from '../modalSlice';

const GameControls = ({ rollDice, resetGame, attempts, currentPlayer }) => {
  const dispatch = useDispatch();

  const handleRollDice = () => {
    if (attempts[0] === 0 && attempts[1] === 0) {
      dispatch(setMessage('Both players have no attempts left!'));
      return;
    }
    rollDice();
  };  

  return (
    <div className="controls">
      <button
        onClick={handleRollDice}
        disabled={attempts[0] === 0 && attempts[1] === 0}
      >
        Roll Dice (Player {currentPlayer + 1})
      </button>
      <button onClick={resetGame}>New Game</button>
    </div>
  );
};

export default GameControls;
