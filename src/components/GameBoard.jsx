import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { completeMove } from "../redux/slices/gameSlice";
import styles from "./GameBoard.module.css";

const GameBoard = React.memo(({ board, specialCells }) => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.game.players);
  const playerAnimations = useSelector((state) => state.game.playerAnimations);
  const [highlightedCells, setHighlightedCells] = useState([null, null]);

  useEffect(() => {
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

      setHighlightedCells((prev) => {
        const newHighlights = [...prev];
        newHighlights[playerIndex] = steps[stepIndex];
        return newHighlights;
      });

      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          stepIndex++;

          setHighlightedCells((prev) => {
            const newHighlights = [...prev];
            newHighlights[playerIndex] = steps[stepIndex];
            return newHighlights;
          });

        } else {
          clearInterval(interval);

          setTimeout(() => {
            const finalPosition = steps[steps.length - 1];
            dispatch(completeMove({ playerIndex, finalPosition }));
          }, 500);
        }
      }, 300);
    }
  };

  return (
    <div className={styles.gameBoard}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell) => {
            const isPlayer1 = players[0] === cell;
            const isPlayer2 = players[1] === cell;
            const isHighlighted1 = highlightedCells[0] === cell;
            const isHighlighted2 = highlightedCells[1] === cell;

            const isSpecialCell = specialCells[cell];
            const bothPlayersOnCell = isPlayer1 && isPlayer2;

            const cellClasses = [
              styles.cell,
              bothPlayersOnCell ? styles.bothPlayers : "",
              isPlayer1 && !bothPlayersOnCell ? styles.player1 : "",
              isPlayer2 && !bothPlayersOnCell ? styles.player2 : "",
              isHighlighted1 ? styles.animatePlayer1 : "",
              isHighlighted2 ? styles.animatePlayer2 : "",
              isSpecialCell ? styles.specialCell : "",
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
});

export default GameBoard;