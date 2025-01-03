import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import PlayerStats from './components/PlayerStats';
import GameInfo from './components/GameInfo';
import GameControls from './components/GameControls';
import Modal from './components/Modal';

const BOARD_SIZE = 100;

const generateSpecialCells = () => {
  const numSpecialCells = Math.floor(Math.random() * 3) + 7;
  const specialCells = {};
  Array.from({ length: numSpecialCells }).forEach(() => {
    let cell;
    do {
      cell = Math.floor(Math.random() * (BOARD_SIZE - 8)) + 8;
    } while (specialCells[cell] || cell < 8 || cell > 97);

    const effectType = Math.random() > 0.5 ? 'position' : 'attempts';
    let value;
    if (effectType === 'position') {
      if (cell >= 90) {
        value = Math.floor(Math.random() * 6);
      } else if (cell <= 10) {
        value = Math.floor(Math.random() * 6);
      } else {
        value = Math.floor(Math.random() * 13) - 6;
      }
    } else {
      value = Math.floor(Math.random() * 11) - 5;
    }

    specialCells[cell] = {
      type: effectType,
      value,
    };
  });

  return specialCells;
};


const generateBoard = () => {
  return Array.from({ length: 10 }, (_, i) => {
    return Array.from({ length: 10 }, (_, j) =>
      i % 2 === 0 ? i * 10 + j + 1 : i * 10 + 10 - j
    );
  }).reverse();
};

const App = () => {
  const [board] = useState(generateBoard());
  const [specialCells, setSpecialCells] = useState(generateSpecialCells());
  const [players, setPlayers] = useState([0, 0]);
  const [attempts, setAttempts] = useState([
    Math.floor(Math.random() * 11) + 10,
    Math.floor(Math.random() * 11) + 10,
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);

  const rollDice = () => {
    if (attempts[currentPlayer] <= 0) {
      setPopupMessage(`Player ${currentPlayer + 1} has no attempts left! Switching turns.`);
      setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
      return;
    }

    const dice = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(dice);

    let newPosition = players[currentPlayer] + dice;
    if (newPosition > BOARD_SIZE) newPosition = BOARD_SIZE;

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

      setSpecialCells((prev) => {
        const updated = { ...prev };
        delete updated[newPosition];
        return updated;
      });
    }

    setPlayers((prev) => {
      const updated = [...prev];
      updated[currentPlayer] = newPosition;
      return updated;
    });

    setAttempts((prev) => {
      const updated = [...prev];
      updated[currentPlayer] -= 1;
      return updated;
    });

    if (specialMessage) {
      setPopupMessage(specialMessage);
    }

    setTimeout(() => {
      setDiceRoll(null);
      setCurrentPlayer((prev) => {
        const otherPlayer = prev === 0 ? 1 : 0;
        return attempts[otherPlayer] > 0 ? otherPlayer : prev;
      });
    }, 1000);
  };

  const resetGame = () => {
    setPlayers([0, 0]);
    setAttempts([
      Math.floor(Math.random() * 11) + 10,
      Math.floor(Math.random() * 11) + 10,
    ]);
    setCurrentPlayer(0);
    setDiceRoll(null);
    const newSpecialCells = generateSpecialCells();
    setSpecialCells(newSpecialCells);  
  };


  return (
    <div className="App">
      <div className="game-container">
        <PlayerStats player={1} position={players[0]} attempts={attempts[0]} />
        <GameBoard
          board={board}
          players={players}
          specialCells={specialCells} 
        />
        <PlayerStats player={2} position={players[1]} attempts={attempts[1]} />
      </div>
      <GameInfo currentPlayer={currentPlayer} diceRoll={diceRoll} />
      <GameControls
        rollDice={rollDice}
        resetGame={resetGame}
        attempts={attempts}
        currentPlayer={currentPlayer}
      />
      <Modal />
    </div>
  );
};
export default App;