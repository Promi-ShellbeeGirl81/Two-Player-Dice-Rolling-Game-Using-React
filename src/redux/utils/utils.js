import { BOARD_SIZE } from "../constants/constants";

export const generateSpecialCells = () => {
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
          do {
            value = Math.floor(Math.random() * 6) - 6;
          } while (value === 0);
        } else if (cell <= 10) {
          do {
            value = Math.floor(Math.random() * 6) + 1;
          } while (value === 0);
        } else {
          do {
            value = Math.floor(Math.random() * 13) - 6;
          } while (value === 0);
        }
      } else {
        do {
          value = Math.floor(Math.random() * 11) - 5;
        } while (value === 0);
      }
      specialCells[cell] = { type: effectType, value };
    });
  
    return specialCells;
  };
  
  export const generateBoard = () => {
    const board = [];
  
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        if (i % 2 == 0) row.push(i * 10 + j + 1);
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
  