import { useState } from "react";
import { Button } from "@heroui/react";

const WIN_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (currentBoard: (string | null)[]) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [a, b, c] = WIN_CONDITIONS[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: WIN_CONDITIONS[i] };
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner("Draw");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto p-4">
      <div className="flex justify-between items-center w-full px-2">
        <h3 className="text-xl font-bold">Tic-Tac-Toe</h3>
        <div className="text-sm font-semibold">
          {winner ? (
            winner === "Draw" ? (
              <span className="text-warning">It's a Draw!</span>
            ) : (
              <span className="text-success">Winner: {winner}</span>
            )
          ) : (
            <span className="text-primary">Next: {isXNext ? "X" : "O"}</span>
          )}
        </div>
      </div>

      {/* Grid container with visible borders */}
      <div className="grid grid-cols-3 gap-0 w-full aspect-square border-2 border-default-200 rounded-xl overflow-hidden bg-default-200/50">
        {board.map((cell, i) => {
          const isWinningCell = winningLine?.includes(i);
          // Calculate border classes for 3x3 grid effect
          const borderClasses = `
            ${i < 6 ? "border-b-2" : ""}
            ${i % 3 !== 2 ? "border-r-2" : ""}
            border-default-200
          `;

          return (
            <div key={i} className={`relative ${borderClasses}`}>
              <Button
                className={`w-full h-full text-4xl font-bold transition-all duration-300 min-w-0 rounded-none ${
                  isWinningCell ? "bg-success/20 text-success" :
                  cell === "X" ? "text-primary" :
                  cell === "O" ? "text-danger" : "bg-content1"
                }`}
                variant="light"
                onPress={() => handleClick(i)}
                disabled={!!winner || !!cell}
              >
                {cell}
              </Button>
            </div>
          );
        })}
      </div>

      <Button
        className="w-full font-bold"
        color={winner ? "primary" : "default"}
        variant={winner ? "shadow" : "flat"}
        onPress={resetGame}
      >
        {winner ? "Play Again" : "Reset Game"}
      </Button>
    </div>
  );
}
