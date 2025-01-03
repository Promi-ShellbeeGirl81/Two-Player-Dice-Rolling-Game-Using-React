import React, { useState } from 'react';
import './App.css';

const BOARD_SIZE = 100;

const generateSpecialCells = () => {
  const specialCells = {};
  const numSpecialCells = Math.floor(Math.random() * 3) + 7;  

  while (Object.keys(specialCells).length < numSpecialCells) {
    const cell = Math.floor(Math.random() * (BOARD_SIZE - 7)) + 8; 

    if (!specialCells[cell]) {
      const effectType = Math.random() > 0.5 ? 'position' : 'attempts';
      
      specialCells[cell] = {
        type: effectType,
        value: effectType === 'position'
          ? Math.floor(Math.random() * 13) - 6
          : Math.floor(Math.random() * 11) - 5,
      };
    }
  }

  return specialCells;
};

const generateBoard = () => {
  const board = [];
  for (let i = 0; i < 10; i++) {
    const start = i * 10 + 1;
    const end = start + 9;
    const row = Array.from({ length: 10 }, (_, idx) => start + idx);
    board.push(i % 2 === 0 ? row : row.reverse());
  }
  return board.reverse(); // Reverse to make 1 at the bottom
};

const App = () => {
  const [board] = useState(generateBoard());
  const [specialCells, setSpecialCells] = useState(generateSpecialCells());

  // Initialize players' positions and random attempts between 10 and 20
  const [players, setPlayers] = useState([0, 0]);
  const [attempts, setAttempts] = useState([Math.floor(Math.random() * 11) + 10, Math.floor(Math.random() * 11) + 10]); // Random attempts between 10 and 20

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);

  const rollDice = () => {
    // If the current player has no attempts left, switch to the other player
    if (attempts[currentPlayer] <= 0) {
      alert(`Player ${currentPlayer + 1} has no attempts left! Switching turns.`);
      setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
      return;
    }
  
    const dice = Math.floor(Math.random() * 6) + 1; // Roll dice (1-6)
    setDiceRoll(dice);
  
    // Calculate new position
    let newPosition = players[currentPlayer] + dice;
    if (newPosition > BOARD_SIZE) newPosition = BOARD_SIZE;
  
    // Check for special cell effects
    let specialMessage = '';
    if (specialCells[newPosition]) {
      const effect = specialCells[newPosition];
      if (effect.type === 'position') {
        newPosition = Math.max(1, Math.min(BOARD_SIZE, newPosition + effect.value));
        specialMessage = `Player ${currentPlayer + 1} moved ${effect.value > 0 ? 'up' : 'down'} to position ${newPosition}`;
      } else if (effect.type === 'attempts') {
        setAttempts((prev) => {
          const updated = [...prev];
          updated[currentPlayer] = Math.max(0, updated[currentPlayer] + effect.value);
          return updated;
        });
        specialMessage = `Player ${currentPlayer + 1} ${effect.value > 0 ? 'gained' : 'lost'} ${Math.abs(effect.value)} attempts`;
      }
  
      // Remove the special cell effect
      setSpecialCells((prev) => {
        const updated = { ...prev };
        delete updated[newPosition];
        return updated;
      });
    }
  
    // Update player position
    setPlayers((prev) => {
      const updated = [...prev];
      updated[currentPlayer] = newPosition;
      return updated;
    });
  
    // Deduct an attempt
    setAttempts((prev) => {
      const updated = [...prev];
      updated[currentPlayer] -= 1;
      return updated;
    });
  
    // Show alert for special cell action
    if (specialMessage) {
      alert(specialMessage); // Alert with the special message
    }
  
    // Clear dice and switch turn if the current player still has attempts
    setTimeout(() => {
      setDiceRoll(null);
      setCurrentPlayer((prev) => {
        const otherPlayer = prev === 0 ? 1 : 0;
        // Switch to the other player only if they have attempts left
        return attempts[otherPlayer] > 0 ? otherPlayer : prev;
      });
    }, 1000);
  };
  

const resetGame = () => {
  setPlayers([0, 0]);
  setAttempts([Math.floor(Math.random() * 11) + 10, Math.floor(Math.random() * 11) + 10]);
  setCurrentPlayer(0);
  setDiceRoll(null);
  setSpecialCells(generateSpecialCells()); // This line updates the specialCells state
};


  return (
    <div className="App">
      <div className="game-container">
        {/* Player 1 Stats */}
        <div className="player-stats left">
          <h2>Player 1</h2>
          <p>Position: {players[0]}</p>
          <p>Attempts Left: {attempts[0]}</p>
        </div>

        {/* Game Board */}
        <div className="game-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell) => {
                const isPlayer1 = players[0] === cell;
                const isPlayer2 = players[1] === cell;
                const isBothPlayers = isPlayer1 && isPlayer2;

                return (
                  <div
                  key={cell}
                  className={`cell 
                    ${isPlayer1 ? 'player1' : ''} 
                    ${isPlayer2 ? 'player2' : ''} 
                    ${isBothPlayers ? 'both-players' : ''} 
                    ${!isPlayer1 && !isPlayer2 && specialCells[cell] ? 'special' : ''}`}
                >
                  {cell}
                  {specialCells[cell] && (
                    <div className="special-cell">
                      {specialCells[cell].type === 'position'
                        ? `⇅ ${specialCells[cell].value}`
                        : `⚡ ${specialCells[cell].value}`}
                    </div>
                  )}
                </div>
                
                );
              })}
            </div>
          ))}
        </div>

        {/* Player 2 Stats */}
        <div className="player-stats right">
          <h2>Player 2</h2>
          <p>Position: {players[1]}</p>
          <p>Attempts Left: {attempts[1]}</p>
        </div>
      </div>

      {/* Info and Controls */}
      <div className="info">
        <p>Current Player: Player {currentPlayer + 1}</p>
        <p>Dice Roll: {diceRoll || '-'}</p>
      </div>
      <div className="controls">
      <button
  onClick={rollDice}
  disabled={attempts[0] === 0 && attempts[1] === 0} // Only disable when both players' attempts are 0
>
  Roll Dice (Player {currentPlayer + 1})
</button>


        <button onClick={resetGame}>New Game</button>
      </div>
    </div>
  );
};

export default App;
