import React from 'react';

const PlayerStats = ({ player, position, attempts, diceRoll, isCurrentPlayer, isPlayer1 }) => {
  const playerClass = isCurrentPlayer ? (isPlayer1 ? 'player1-turn' : 'player2-turn') : '';
  return (
    <div className={`player-stats ${playerClass}`}>
      <h3>Player {player}</h3>
      <p>Position: {position}</p>
      <p>Attempts: {attempts}</p>
      <p>Dice Roll: {diceRoll}</p>
    </div>
  );
};

export default PlayerStats;
