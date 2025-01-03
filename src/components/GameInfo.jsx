import React from 'react';
import { useSelector } from 'react-redux';

const GameInfo = ({ currentPlayer }) => {
  const popupMessage = useSelector((state) => state.game.popupMessage);

  return (
    <div className="game-info">
      <div>
        {popupMessage && <div className="popup-message">{popupMessage}</div>}
      </div>
      <div>Current Player: {currentPlayer + 1}</div>
    </div>
  );
};

export default GameInfo;
