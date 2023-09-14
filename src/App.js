import React, { useState, useEffect } from "react";
import Board from "./Board";

const App = () => {
  const [board, setBoard] = useState([]);
  const [firstClick, setFirstClick] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [boardSize, setBoardSize] = useState({
    rows: 16,
    cols: 30,
  });
  const [totalMines, setTotalMines] = useState(99);

  const initiateBoard = () => {
    const board = [];
    for (let i = 0; i < boardSize.rows; i++) {
      board.push([]);
      for (let j = 0; j < boardSize.cols; j++) {
        board[i].push({
          value: 0,
          isRevealed: false,
          hasFlag: false,
          isHighlighted: false,
        });
      }
    }
    return board;
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (firstClick === true) {
      let newBoard = initiateBoard();
      setFirstClick(false);
      newBoard = addMines(newBoard, rowIndex, colIndex);
      newBoard = calculateValues(newBoard);
      newBoard[rowIndex][colIndex].isRevealed = true;
      // first reveal the cell that was clicked and then reveal all the cells that are not mines and are adjacent to the cell that was clicked
      newBoard = revealAdjacentCells(newBoard, rowIndex, colIndex);
      setBoard(newBoard);
    } else if (board[rowIndex][colIndex].value === "X") {
      setGameOver(true);
    } else {
      if (board[rowIndex][colIndex].isRevealed === false) {
        const newBoard = revealAdjacentCells(board, rowIndex, colIndex);
        setBoard(newBoard);
      }
    }
  };

  const handleRightClick = (rowIndex, colIndex) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    if (
      newBoard[rowIndex][colIndex].isRevealed === false &&
      firstClick === false
    ) {
      newBoard[rowIndex][colIndex].hasFlag =
        !newBoard[rowIndex][colIndex].hasFlag;
      setBoard(newBoard);
    }
  };

  const handleBothClick = (event, rowIndex, colIndex) => {
    console.log("row and column", rowIndex, colIndex);
    let newBoard = JSON.parse(JSON.stringify(board));
    if (event.buttons === 3) {
      const totalAdjacentFlags = countAdjacentFlags(
        newBoard,
        rowIndex,
        colIndex
      );
      console.log("totalFlags:", totalAdjacentFlags);
      // if (totalAdjacentFlags === newBoard[rowIndex][colIndex].value) {
      // }
      if (newBoard[rowIndex][colIndex].isRevealed === true) {
        const response = highlightAdjacentCells(newBoard, rowIndex, colIndex);
        newBoard = response.newBoard;
        const highlightedCells = response.highlightedCells;
        if (totalAdjacentFlags === newBoard[rowIndex][colIndex].value) {
          for (let i = 0; i < highlightedCells.length; i++) {
            const row = highlightedCells[i].rowIndex;
            const col = highlightedCells[i].colIndex;
            if (newBoard[row][col].value === "X") {
              setGameOver(true);
              break;
            } else {
              newBoard[row][col].isRevealed = true;
              newBoard = revealAdjacentCells(newBoard, row, col);
            }
          }
        }
        setBoard(newBoard);
      }
    }
  };

  const handleBothRelease = (event, rowIndex, colIndex) => {
    console.log(rowIndex, colIndex);
    let newBoard = JSON.parse(JSON.stringify(board));
    newBoard = unHighlightAllCells(newBoard);
    setBoard(newBoard);
  };

  const unHighlightAllCells = (board) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    console.log("unhighlighting");
    for (let i = 0; i < boardSize.rows; i++) {
      for (let j = 0; j < boardSize.cols; j++) {
        newBoard[i][j].isHighlighted = false;
      }
    }
    return newBoard;
  };

  const highlightAdjacentCells = (board, rowIndex, colIndex) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    const highlightedCells = [];
    if (rowIndex > 0 && colIndex > 0) {
      if (
        newBoard[rowIndex - 1][colIndex - 1].isRevealed === false &&
        newBoard[rowIndex - 1][colIndex - 1].hasFlag === false
      ) {
        newBoard[rowIndex - 1][colIndex - 1].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex - 1,
          colIndex: colIndex - 1,
        });
        console.log("highlighted", rowIndex - 1, colIndex - 1);
      }
    }
    if (rowIndex > 0) {
      if (
        newBoard[rowIndex - 1][colIndex].isRevealed === false &&
        newBoard[rowIndex - 1][colIndex].hasFlag === false
      ) {
        newBoard[rowIndex - 1][colIndex].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex - 1,
          colIndex: colIndex,
        });
        console.log("highlighted", rowIndex - 1, colIndex);
      }
    }
    if (rowIndex > 0 && colIndex < boardSize.cols - 1) {
      if (
        newBoard[rowIndex - 1][colIndex + 1].isRevealed === false &&
        newBoard[rowIndex - 1][colIndex + 1].hasFlag === false
      ) {
        newBoard[rowIndex - 1][colIndex + 1].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex - 1,
          colIndex: colIndex + 1,
        });
        console.log("highlighted", rowIndex - 1, colIndex + 1);
      }
    }
    if (colIndex > 0) {
      if (
        newBoard[rowIndex][colIndex - 1].isRevealed === false &&
        newBoard[rowIndex][colIndex - 1].hasFlag === false
      ) {
        newBoard[rowIndex][colIndex - 1].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex,
          colIndex: colIndex - 1,
        });
        console.log("highlighted", rowIndex, colIndex - 1);
      }
    }
    if (colIndex < boardSize.cols - 1) {
      if (
        newBoard[rowIndex][colIndex + 1].isRevealed === false &&
        newBoard[rowIndex][colIndex + 1].hasFlag === false
      ) {
        newBoard[rowIndex][colIndex + 1].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex,
          colIndex: colIndex + 1,
        });
        console.log("highlighted", rowIndex, colIndex + 1);
      }
    }
    if (rowIndex < boardSize.rows - 1 && colIndex > 0) {
      if (
        newBoard[rowIndex + 1][colIndex - 1].isRevealed === false &&
        newBoard[rowIndex + 1][colIndex - 1].hasFlag === false
      ) {
        newBoard[rowIndex + 1][colIndex - 1].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex + 1,
          colIndex: colIndex - 1,
        });
        console.log("highlighted", rowIndex + 1, colIndex - 1);
      }
    }
    if (rowIndex < boardSize.rows - 1) {
      if (
        newBoard[rowIndex + 1][colIndex].isRevealed === false &&
        newBoard[rowIndex + 1][colIndex].hasFlag === false
      ) {
        newBoard[rowIndex + 1][colIndex].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex + 1,
          colIndex: colIndex,
        });
        console.log("highlighted", rowIndex + 1, colIndex);
      }
    }
    if (rowIndex < boardSize.rows - 1 && colIndex < boardSize.cols - 1) {
      if (
        newBoard[rowIndex + 1][colIndex + 1].isRevealed === false &&
        newBoard[rowIndex + 1][colIndex + 1].hasFlag === false
      ) {
        newBoard[rowIndex + 1][colIndex + 1].isHighlighted = true;
        highlightedCells.push({
          rowIndex: rowIndex + 1,
          colIndex: colIndex + 1,
        });
        console.log("highlighted", rowIndex + 1, colIndex + 1);
      }
    }
    return { newBoard, highlightedCells };
  };

  const countAdjacentFlags = (board, rowIndex, colIndex) => {
    let count = 0;
    if (rowIndex > 0 && colIndex > 0) {
      if (board[rowIndex - 1][colIndex - 1].hasFlag === true) {
        count++;
      }
    }
    if (rowIndex > 0) {
      if (board[rowIndex - 1][colIndex].hasFlag === true) {
        count++;
      }
    }
    if (rowIndex > 0 && colIndex < boardSize.cols - 1) {
      if (board[rowIndex - 1][colIndex + 1].hasFlag === true) {
        count++;
      }
    }
    if (colIndex > 0) {
      if (board[rowIndex][colIndex - 1].hasFlag === true) {
        count++;
      }
    }
    if (colIndex < boardSize.cols - 1) {
      if (board[rowIndex][colIndex + 1].hasFlag === true) {
        count++;
      }
    }
    if (rowIndex < boardSize.rows - 1 && colIndex > 0) {
      if (board[rowIndex + 1][colIndex - 1].hasFlag === true) {
        count++;
      }
    }
    if (rowIndex < boardSize.rows - 1) {
      if (board[rowIndex + 1][colIndex].hasFlag === true) {
        count++;
      }
    }
    if (rowIndex < boardSize.rows - 1 && colIndex < boardSize.cols - 1) {
      if (board[rowIndex + 1][colIndex + 1].hasFlag === true) {
        count++;
      }
    }
    return count;
  };

  const revealAdjacentCells = (board, rowIndex, colIndex) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    newBoard[rowIndex][colIndex].isRevealed = true;

    if (newBoard[rowIndex][colIndex].value === 0) {
      if (
        rowIndex < boardSize.rows - 1 &&
        newBoard[rowIndex + 1][colIndex].isRevealed === false &&
        newBoard[rowIndex + 1][colIndex].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex + 1, colIndex);
      } else if (
        rowIndex < boardSize.rows - 1 &&
        newBoard[rowIndex + 1][colIndex].value !== "X"
      ) {
        newBoard[rowIndex + 1][colIndex].isRevealed = true;
      }
      if (
        rowIndex > 0 &&
        newBoard[rowIndex - 1][colIndex].isRevealed === false &&
        newBoard[rowIndex - 1][colIndex].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex - 1, colIndex);
      } else if (
        rowIndex > 0 &&
        newBoard[rowIndex - 1][colIndex].value !== "X"
      ) {
        newBoard[rowIndex - 1][colIndex].isRevealed = true;
      }
      if (
        colIndex < boardSize.cols - 1 &&
        newBoard[rowIndex][colIndex + 1].isRevealed === false &&
        newBoard[rowIndex][colIndex + 1].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex, colIndex + 1);
      } else if (
        colIndex < boardSize.cols - 1 &&
        newBoard[rowIndex][colIndex + 1].value !== "X"
      ) {
        newBoard[rowIndex][colIndex + 1].isRevealed = true;
      }
      if (
        colIndex > 0 &&
        newBoard[rowIndex][colIndex - 1].isRevealed === false &&
        newBoard[rowIndex][colIndex - 1].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex, colIndex - 1);
      } else if (
        colIndex > 0 &&
        newBoard[rowIndex][colIndex - 1].value !== "X"
      ) {
        newBoard[rowIndex][colIndex - 1].isRevealed = true;
      }
      if (
        rowIndex < boardSize.rows - 1 &&
        colIndex < boardSize.cols - 1 &&
        newBoard[rowIndex + 1][colIndex + 1].isRevealed === false &&
        newBoard[rowIndex + 1][colIndex + 1].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex + 1, colIndex + 1);
      } else if (
        rowIndex < boardSize.rows - 1 &&
        colIndex < boardSize.cols - 1 &&
        newBoard[rowIndex + 1][colIndex + 1].value !== "X"
      ) {
        newBoard[rowIndex + 1][colIndex + 1].isRevealed = true;
      }
      if (
        rowIndex < boardSize.rows - 1 &&
        colIndex > 0 &&
        newBoard[rowIndex + 1][colIndex - 1].isRevealed === false &&
        newBoard[rowIndex + 1][colIndex - 1].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex + 1, colIndex - 1);
      } else if (
        rowIndex < boardSize.rows - 1 &&
        colIndex > 0 &&
        newBoard[rowIndex + 1][colIndex - 1].value !== "X"
      ) {
        newBoard[rowIndex + 1][colIndex - 1].isRevealed = true;
      }
      if (
        rowIndex > 0 &&
        colIndex < boardSize.cols - 1 &&
        newBoard[rowIndex - 1][colIndex + 1].isRevealed === false &&
        newBoard[rowIndex - 1][colIndex + 1].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex - 1, colIndex + 1);
      } else if (
        rowIndex > 0 &&
        colIndex < boardSize.cols - 1 &&
        newBoard[rowIndex - 1][colIndex + 1].value !== "X"
      ) {
        newBoard[rowIndex - 1][colIndex + 1].isRevealed = true;
      }
      if (
        rowIndex > 0 &&
        colIndex > 0 &&
        newBoard[rowIndex - 1][colIndex - 1].isRevealed === false &&
        newBoard[rowIndex - 1][colIndex - 1].value === 0
      ) {
        newBoard = revealAdjacentCells(newBoard, rowIndex - 1, colIndex - 1);
      } else if (
        rowIndex > 0 &&
        colIndex > 0 &&
        newBoard[rowIndex - 1][colIndex - 1].value !== "X"
      ) {
        newBoard[rowIndex - 1][colIndex - 1].isRevealed = true;
      }
    }
    return newBoard;
  };

  const addMines = (board, rowIndex, colIndex) => {
    let mines = 0;
    while (mines < totalMines) {
      const randomRow = Math.floor(Math.random() * boardSize.rows);
      const randomCol = Math.floor(Math.random() * boardSize.cols);
      // if the cell clicked and all the cell adjacent to clicked cell is a mine, then continue
      if (
        (randomRow === rowIndex && randomCol === colIndex) ||
        (randomRow === rowIndex + 1 && randomCol === colIndex) ||
        (randomRow === rowIndex - 1 && randomCol === colIndex) ||
        (randomRow === rowIndex && randomCol === colIndex + 1) ||
        (randomRow === rowIndex && randomCol === colIndex - 1) ||
        (randomRow === rowIndex + 1 && randomCol === colIndex + 1) ||
        (randomRow === rowIndex + 1 && randomCol === colIndex - 1) ||
        (randomRow === rowIndex - 1 && randomCol === colIndex + 1) ||
        (randomRow === rowIndex - 1 && randomCol === colIndex - 1)
      ) {
        continue;
      }

      if (board[randomRow][randomCol].value !== "X") {
        board[randomRow][randomCol].value = "X";
        mines++;
      }
    }
    return board;
  };

  const calculateValues = (board) => {
    for (let i = 0; i < boardSize.rows; i++) {
      for (let j = 0; j < boardSize.cols; j++) {
        let mines = 0;
        if (board[i][j].value !== "X") {
          if (i > 0 && j > 0 && board[i - 1][j - 1].value === "X") {
            mines++;
          }
          if (i > 0 && board[i - 1][j].value === "X") {
            mines++;
          }
          if (
            i > 0 &&
            j < boardSize.cols - 1 &&
            board[i - 1][j + 1].value === "X"
          ) {
            mines++;
          }
          if (j > 0 && board[i][j - 1].value === "X") {
            mines++;
          }
          if (j < boardSize.cols - 1 && board[i][j + 1].value === "X") {
            mines++;
          }
          if (
            i < boardSize.rows - 1 &&
            j > 0 &&
            board[i + 1][j - 1].value === "X"
          ) {
            mines++;
          }
          if (i < boardSize.rows - 1 && board[i + 1][j].value === "X") {
            mines++;
          }
          if (
            i < boardSize.rows - 1 &&
            j < boardSize.cols - 1 &&
            board[i + 1][j + 1].value === "X"
          ) {
            mines++;
          }
          board[i][j].value = mines;
          // just show all the cells in board for now to check if the values are correct
          // board[i][j].isRevealed = true;
        }
      }
    }
    return board;
  };

  useEffect(() => {
    setBoard(initiateBoard());
  }, []);

  return (
    <div
      className="App"
      style={{
        margin: "10%",
      }}
    >
      {gameOver ? (
        // create a modal to show game over
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1>Game Over</h1>
          <button
            onClick={() => {
              // reload the page to start a new game
              window.location.reload();
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <h1>Minesweeper</h1>
          {board.length ? (
            <Board
              board={board}
              onCellClick={handleCellClick}
              onCellRightClick={handleRightClick}
              onCellBothClick={handleBothClick}
              onCellBothRelease={handleBothRelease}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default App;
