import React from "react";

const Cell = ({
  value,
  isRevealed,
  hasFlag,
  isHighlighted,
  onClick,
  onRightClick,
  onBothClick,
  onBothRelease,
}) => {
  const cellStyle = {
    // Add your cell styles here
    // For example:
    backgroundColor: isRevealed ? "#ccc" : isHighlighted ? "yellow" : "#999",
    color: value === "X" ? "red" : "black",
    fontWeight: "bold",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const flagStyle = {
    // Add your flag styles here
    // For example:
    fontSize: "20px",
    color: "red",
  };

  return (
    <div
      style={cellStyle}
      onClick={onClick}
      onContextMenu={onRightClick}
      onMouseDown={onBothClick}
      onMouseUp={onBothRelease}
    >
      {isRevealed ? (value === 0 ? "" : value) : ""}
      {hasFlag ? <span style={flagStyle}>🚩</span> : null}
    </div>
  );
};

export default Cell;
