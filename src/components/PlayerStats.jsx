import React from "react";
import { useSelector } from "react-redux";
import styles from "./PlayerStats.module.css"; 

const PlayerStats = ({ player }) => {
  const players = useSelector((state) => state.game.players);
  const attempts = useSelector((state) => state.game.attempts);
  const diceRoll = useSelector((state) => state.game.diceRoll);
  const currentPlayer = useSelector((state) => state.game.currentPlayer);

  let playerClass = player === 1 ? styles.player1 : styles.player2;
  if (player === 1 && currentPlayer === 0) {
    playerClass = styles.currentTurnPlayer1;
  } else if (player === 2 && currentPlayer === 1) {
    playerClass = styles.currentTurnPlayer2;
  }

  return (
    <div className={`${styles.playerStats} ${playerClass}`}>
      <h3>Player {player}</h3>
      <p>Position: {players[player - 1]}</p>
      <p>Attempts: {attempts[player - 1]}</p>
      <p>Dice Roll: {diceRoll[player - 1]}</p>
    </div>
  );
};

export default PlayerStats;
