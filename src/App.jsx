import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import PlayerStats from './components/PlayerStats';
import GameControls from './components/GameControls';
import GameInfo from './components/GameInfo';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame } from './gameSlice';

const App = () => {
  const { board, players, attempts, currentPlayer, popupMessage, specialCells, diceRoll } = useSelector((state) => state.game);
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetGame());
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="left-container">
          <div className="top-stats">
            <PlayerStats player={1} position={players[0]} attempts={attempts[0]} />
            {/* Display dice roll for Player 1 */}
            <p>Player 1 Dice Roll: {diceRoll[0]}</p>
          </div>
          <div className="middle-stats">
            <PlayerStats player={2} position={players[1]} attempts={attempts[1]} />
            {/* Display dice roll for Player 2 */}
            <p>Player 2 Dice Roll: {diceRoll[1]}</p>
          </div>

          <div className="game-info">
            <GameInfo currentPlayer={currentPlayer} />
          </div>

          <div className="bottom-controls">
            <GameControls onReset={handleReset} />
          </div>
        </div>
        <div className="board-container">
          <GameBoard board={board} players={players} specialCells={specialCells} />
        </div>
      </div>
    </div>
  );
};

export default App;
