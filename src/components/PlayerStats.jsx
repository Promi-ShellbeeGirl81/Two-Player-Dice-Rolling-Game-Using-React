import React from "react";
import { useSelector } from "react-redux";

const PlayerStats = ({ player }) => {
  const players = useSelector((state) => state.game.players);
  const attempts = useSelector((state) => state.game.attempts);
  const diceRoll = useSelector((state) => state.game.diceRoll);
  const currentPlayer = useSelector((state) => state.game.currentPlayer);

  let playerClass = player === 1 ? 'player1' : 'player2';
  if (player === 1 && currentPlayer === 0) {
    playerClass = 'current-turn-player1';
  } else if (player === 2 && currentPlayer === 1) {
    playerClass = 'current-turn-player2';
  }

  return (
    <div className={`player-stats ${playerClass}`}>
      <h3>Player {player}</h3>
      <p>Position: {players[player - 1]}</p>
      <p>Attempts: {attempts[player - 1]}</p>
      <p>Dice Roll: {diceRoll[player - 1]}</p>
    </div>
  );
};

export default PlayerStats;
