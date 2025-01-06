import React from 'react';

const PlayerStats = ({ player, position, attempts }) => {
  return (
    <div className="player-stats">
      <h3>Player {player}</h3>
      <p>Position: {position}</p>
      <p>Attempts: {attempts}</p>
    </div>
  );
};

export default PlayerStats;
