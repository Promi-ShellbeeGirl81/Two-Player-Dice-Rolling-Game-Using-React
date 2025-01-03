const GameBoard = ({ board, players, specialCells = {} }) => {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell) => {
            const isPlayer1 = players[0] === cell;
            const isPlayer2 = players[1] === cell;
            const isBothPlayers = isPlayer1 && isPlayer2;

            const specialCell = specialCells[cell]; 

            return (
              <div
                key={cell}
                className={`cell 
                  ${isPlayer1 ? 'player1' : ''} 
                  ${isPlayer2 ? 'player2' : ''} 
                  ${isBothPlayers ? 'both-players' : ''} 
                  ${!isPlayer1 && !isPlayer2 && specialCell ? 'special' : ''}`}
              >
                {cell}
                {specialCell && (
                  <div className="special-cell">
                    {specialCell.type === 'position'
                      ? `⇅ ${specialCell.value}`
                      : `⚡ ${specialCell.value}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;