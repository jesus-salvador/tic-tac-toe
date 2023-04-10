import { useState } from "react";

function Square({ value, highlighted, onSquareClick }) {
  return (
    <button
      className={highlighted ? "square--highlithed" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ onPlay, squares, xIsNext }) {
  const [winner, winner_line] = calculateWinner(squares);
  let status;
  if (winner === 'draw') {
    status = 'Draw Game'
  } else if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const size = 3
  const line = Array(size).fill(null);
  const rows = line.map((row, rowIndex) => {
    const columns = line.map((column, columnIndex) => {
      const index = columnIndex + (rowIndex * size);
      return <Square
        key={columnIndex}
        highlighted={winner_line?.includes(index)}
        onSquareClick={() => handleClick(index)}
        value={squares[index]}
      />;
    });
    return (
      <div key={rowIndex} className="board-row">{columns}</div>
    );
  })

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game(props) {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [enabledAscOrder, setEnabledAscOrder] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleMovesOrder() {
    setEnabledAscOrder(!enabledAscOrder);
  }

  const moves = history.map((squares, move) => {
    let description;
    let coordenate = '';
    if (move > 0) {
      const prev_squares = history[move - 1];
      const updated_index = prev_squares.findIndex((val, index) => {
        return val !== squares[index];
      });
      coordenate = `in ${getColRowFormat(updated_index)}`;
      description = `Go to move #${move} ${coordenate}`;
    } else {
      description = `Go to game start`;
    }

    if (currentMove === move) {
      return (
        <li key={move}>
          {`You are at move #${currentMove} ${coordenate}`}
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  })
  const orderedMoves = enabledAscOrder ? moves : moves.slice(0).reverse()

  return (
    <div className="game">
      <div className="game-board">
        <Board
          onPlay={handlePlay}
          squares={currentSquares}
          xIsNext={xIsNext}
        />
      </div>
      <div className="game-info">
        <button onClick={toggleMovesOrder}>{enabledAscOrder ? 'Asc' : 'Desc'}</button>
        <ol>{orderedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]){
        return [squares[a], [a, b, c]];
    }
  }

  if (squares.indexOf(null) === -1) {
    return ['draw']
  }

  return [null];
}

function getColRowFormat(index) {
    const col = Math.floor(index / 3)
    const row = index % 3
    return `(${col}, ${row})`
}
