import React from 'react';
import { useSelector } from 'react-redux';
import styles from './GameInfo.module.css'; 

const GameInfo = ({ currentPlayer }) => {
  const popupMessage = useSelector((state) => state.game.popupMessage);

  const playerColorClass = currentPlayer === 0 ? styles.blue : styles.red;

  return (
    <div className={styles.gameInfo}>
      <div>
        {popupMessage && <div className={styles.popupMessage}>{popupMessage}</div>}
      </div>
      <div className={`${styles.currentPlayer} ${playerColorClass}`}>
        &nbsp;Current Player: {currentPlayer + 1}
      </div>
    </div>
  );
};

export default GameInfo;
