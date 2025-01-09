import { BOARD_SIZE } from "../constants/constants";

export const generateSpecialCells = () => {
  const numSpecialCells = Math.floor(Math.random() * 3) + 9;  
  const specialCells = [];

  Array.from({ length: numSpecialCells }).forEach(() => {
    let cell;
    do {
      cell = Math.floor(Math.random() * (BOARD_SIZE - 8)) + 8;
    } while (specialCells.some(specialCell => specialCell.cell === cell || cell < 8 || cell > 97));

    const effectType = Math.random() > 0.5 ? 'position' : 'attempts';
    let value;

    if (effectType === 'position') {
      if (cell >= 90) {
        value = Math.floor(Math.random() * 6) - 6;  
      } else if (cell <= 10) {
        value = Math.floor(Math.random() * 6) + 1;  
      } else {
        value = Math.floor(Math.random() * 13) - 6; 
      }
    } else {
      value = Math.floor(Math.random() * 11) - 5;  
    }

   specialCells.push({ cell, effectType, value });
  });

  specialCells.sort((a, b) => a.cell - b.cell);

  const validSpecialCells = [];
  let lastCell = -Infinity;

  for (const specialCell of specialCells) {
    if (specialCell.cell - lastCell >= 10) {
      validSpecialCells.push(specialCell);
      lastCell = specialCell.cell;
    }
  }

  const specialCellsObject = validSpecialCells.reduce((acc, { cell, effectType, value }) => {
    acc[cell] = { type: effectType, value };
    return acc;
  }, {});

  return specialCellsObject;
};

export const generateBoard = () => {
  const board = [];

  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      if (i % 2 === 0) row.push(i * 10 + j + 1);
      else row.push(i * 10 + 10 - j);
    }
    board.push(row);
  }
  return board;
};

export const generateAttempts = () => {
  const attempts = Math.floor(Math.random() * 11) + 30;
  return [attempts, attempts];
};
