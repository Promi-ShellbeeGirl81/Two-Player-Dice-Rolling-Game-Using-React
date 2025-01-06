import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rollDice, resetGame } from '../gameSlice';
import { setMessage } from '../modalSlice';

const GameControls = () => {
  const dispatch = useDispatch();
  const { attempts, currentPlayer } = useSelector((state) => state.game);

  const handleRollDice = () => {
    dispatch(rollDice());
  };

  const handleResetGame = () => {
    dispatch(resetGame());
    dispatch(setMessage(null));
  };
  const buttonClass = currentPlayer === 0 ? 'player1-turnn' : 'player2-turnn';
  return (
    <div className="controls">
      <button
        className={`roll-dice-button ${buttonClass}`}
        onClick={handleRollDice}
        disabled={attempts[0] === 0 && attempts[1] === 0}
      >
        Roll Dice (Player {currentPlayer + 1})
      </button>
      <button onClick={handleResetGame} className='new-game'>New Game</button>
    </div>
  );
};

export default GameControls;
