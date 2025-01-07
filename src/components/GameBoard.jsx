import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { completeMove } from "../gameSlice";

const GameBoard = ({ board, specialCells = {} }) => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.game.players);
  const playerAnimations = useSelector((state) => state.game.playerAnimations);
  const [highlightedCells, setHighlightedCells] = useState([null, null]);

  useEffect(() => {
    // Trigger animation for players that need it
    playerAnimations.forEach((animation, playerIndex) => {
      if (animation) {
        animatePlayer(playerIndex);
      }
    });
  }, [playerAnimations]);

  const animatePlayer = (playerIndex) => {
    const animation = playerAnimations[playerIndex];
    if (animation) {
      const { startPosition, targetPosition } = animation;

      const steps = Array.from({ length: targetPosition - startPosition }, (_, i) => startPosition + i + 1);

      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          setHighlightedCells((prev) => {
            const newHighlights = [...prev];
            newHighlights[playerIndex] = steps[stepIndex];
            return newHighlights;
          });
          stepIndex++;
        } else {
          clearInterval(interval);

          setTimeout(() => {
            const finalPosition = steps[steps.length - 1];
            dispatch(completeMove({ playerIndex, finalPosition }));
          }, 300);
        }
      }, 300);
    }
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell) => {
            const isPlayer1 = players[0] === cell;
            const isPlayer2 = players[1] === cell;
            const isHighlighted1 = highlightedCells[0] === cell;
            const isHighlighted2 = highlightedCells[1] === cell;

            const isSpecialCell = specialCells[cell];
            const cellClasses = [
              "cell",
              isPlayer1 ? "player1" : "",
              isPlayer2 ? "player2" : "",
              isHighlighted1 ? "animate player1" : "",
              isHighlighted2 ? "animate player2" : "",
              isSpecialCell ? "special-cell" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={cell}
                className={cellClasses}
                data-cell={cell}
                title={isSpecialCell ? `Special Cell: ${specialCells[cell].type} effect` : ""}
              >
                {cell}
              </div>

            );
          })}
        </div>
      ))}
    </div>
  );

};

export default GameBoard;
