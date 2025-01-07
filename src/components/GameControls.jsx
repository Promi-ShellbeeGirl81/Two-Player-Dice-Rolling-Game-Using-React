import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rollDice, resetGame } from '../gameSlice';
import { setMessage } from '../modalSlice';
import styles from "./GameControls.module.css"; 

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

  const buttonClass = currentPlayer === 0 ? styles.player1Turnn : styles.player2Turnn;

  return (
    <div className={styles.controls}>
      <button
        className={`${styles.rollDiceButton} ${buttonClass}`} 
        onClick={handleRollDice}
        disabled={attempts[0] === 0 && attempts[1] === 0}
      >
        Roll Dice (Player {currentPlayer + 1})
      </button>
      <button onClick={handleResetGame} className={styles.newGame}>New Game</button>
    </div>
  );
};

export default GameControls;
