import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import PlayerStats from './components/PlayerStats';
import GameControls from './components/GameControls';
import GameInfo from './components/GameInfo';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame } from './redux/slices/gameSlice';

const App = () => {
  const { board, players, attempts, currentPlayer, specialCells, diceRoll, playerAnimations } = useSelector((state) => state.game);
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetGame());
  };
  const handleCompleteMove = (playerIndex, finalPosition) => {
    dispatch(completeMove({ playerIndex, finalPosition }));
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="left-container">
          <div className="player1-stats">
            <PlayerStats
              player={1}
              position={players[0]}
              attempts={attempts[0]}
              diceRoll={diceRoll[0]}
              isCurrentPlayer={currentPlayer === 0}
              isPlayer1={true}
            />
          </div>
        </div>
        <div className="middlebox">
          <div className="game-info">
            <GameInfo currentPlayer={currentPlayer} />
          </div>
          <div className="board-container">
            <GameBoard board={board} players={players} specialCells={specialCells} playerAnimations={playerAnimations}
              onCompleteMove={handleCompleteMove} />
          </div>
          <div className="bottom-controls">
            <GameControls onReset={handleReset} />
          </div>
        </div>
        <div className="player2-stats">
          <PlayerStats
            player={2}
            position={players[1]}
            attempts={attempts[1]}
            diceRoll={diceRoll[1]}
            isCurrentPlayer={currentPlayer === 1}
            isPlayer1={false}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
