const PlayerStats = ({ player, position, attempts }) => (
    <div className={`player-stats ${player === 1 ? 'left' : 'right'}`}>
      <h2>Player {player}</h2>
      <p>Position: {position}</p>
      <p>Attempts Left: {attempts}</p>
    </div>
  );
  
  export default PlayerStats;
  