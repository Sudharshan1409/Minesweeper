import React from "react";
import Cell from "./Cell";

const Board = ({
  board,
  onCellClick,
  onCellRightClick,
  onCellBothClick,
  onCellBothRelease,
}) => {
  const boardStyle = {
    // Add your board styles here
    // For example:
    display: "grid",
    gridTemplateColumns: `repeat(${board[0].length}, 40px)`,
    gap: "1px",
  };

  return (
    <div style={boardStyle}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell.value}
            isRevealed={cell.isRevealed}
            hasFlag={cell.hasFlag}
            isHighlighted={cell.isHighlighted}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onRightClick={(e) => {
              e.preventDefault();
              onCellRightClick(rowIndex, colIndex);
            }}
            onBothClick={(e) => {
              e.preventDefault();
              onCellBothClick(e, rowIndex, colIndex);
            }}
            onBothRelease={(e) => {
              e.preventDefault();
              onCellBothRelease(e, rowIndex, colIndex);
            }}
          />
        ))
      )}
    </div>
  );
};

export default Board;
