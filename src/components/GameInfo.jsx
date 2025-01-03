const GameInfo = ({ currentPlayer, diceRoll }) => (
    <div className="info">
      <p>Current Player: Player {currentPlayer + 1}</p>
      <p>Dice Roll: {diceRoll || '-'}</p>
    </div>
  );
  
  export default GameInfo;
  