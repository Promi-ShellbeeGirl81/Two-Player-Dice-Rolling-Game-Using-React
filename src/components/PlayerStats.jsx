import React from "react";
import { useSelector } from "react-redux";
import styles from "./PlayerStats.module.css";

const PlayerStats = ({ player }) => {
  const players = useSelector((state) => state.game.players);
  const attempts = useSelector((state) => state.game.attempts);
  const diceRoll = useSelector((state) => state.game.diceRoll);
  const diceImages = useSelector((state) => state.game.diceImages);
  const currentPlayer = useSelector((state) => state.game.currentPlayer);

  const defaultDiceImage = "/images/ludo.gif"; 

  let playerClass = player === 1 ? styles.player1 : styles.player2;
  if (player === 1 && currentPlayer === 0) {
    playerClass = styles.currentTurnPlayer1;
  } else if (player === 2 && currentPlayer === 1) {
    playerClass = styles.currentTurnPlayer2;
  }

  const diceImage =
    diceImages[player - 1] && diceImages[player - 1] !== "" ? diceImages[player - 1] : defaultDiceImage;

  return (
    <div className={`${styles.playerStats} ${playerClass}`}>
      <h3>Player {player}</h3>
      <p>Position: {players[player - 1]}</p>
      <p>Attempts: {attempts[player - 1]}</p>
      <img
        src={diceImage}
        alt={`Dice showing ${diceRoll[player - 1] || "default"}`}
        className={styles.diceImage}
      />
    </div>
  );
};

export default PlayerStats;
