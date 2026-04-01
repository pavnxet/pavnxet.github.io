import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent scrolling for arrow keys and space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case " ":
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      <div className="flex justify-between w-full items-center px-4">
        <h3 className="text-xl font-bold">Snake Game</h3>
        <div className="flex gap-4 items-center">
          <span className="text-lg font-mono">Score: {score}</span>
          <Button size="sm" color="primary" variant="flat" onPress={() => setIsPaused((p) => !p)}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>

      <div
        className="relative bg-default-100 border-2 border-default-200 rounded-lg overflow-hidden shadow-inner"
        style={{
          width: "100%",
          aspectRatio: "1/1",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border-[0.5px] border-default-200/20 ${
                isHead ? "bg-primary rounded-sm z-10" :
                isSnake ? "bg-primary/60 rounded-sm" :
                isFood ? "bg-danger animate-pulse rounded-full" : ""
              }`}
            />
          );
        })}

        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {isGameOver ? (
              <>
                <h4 className="text-3xl font-bold text-danger mb-2">Game Over!</h4>
                <p className="text-lg mb-6">Final Score: {score}</p>
                <Button color="primary" variant="shadow" onPress={resetGame}>Try Again</Button>
              </>
            ) : (
              <>
                <h4 className="text-3xl font-bold text-primary mb-2">Paused</h4>
                <p className="text-sm text-default-500 mb-6">Press Space or click Resume to play</p>
                <Button color="primary" variant="shadow" onPress={() => setIsPaused(false)}>Resume Game</Button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-default-400">Use Arrow Keys to move • Space to pause</p>
    </div>
  );
}
