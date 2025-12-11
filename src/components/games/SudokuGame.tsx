import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Lightbulb, CheckCircle, XCircle, Clock, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Difficulty = "easy" | "medium" | "hard";

const generateSudoku = (difficulty: Difficulty): { puzzle: number[][], solution: number[][] } => {
  const solution = Array(9).fill(null).map(() => Array(9).fill(0));
  
  const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  };

  const solve = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solve(solution);

  const puzzle = solution.map(row => [...row]);
  const cellsToRemove = difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50;
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return { puzzle, solution };
};

const boxColors = [
  "bg-rose-100/50 dark:bg-rose-900/20",
  "bg-amber-100/50 dark:bg-amber-900/20",
  "bg-emerald-100/50 dark:bg-emerald-900/20",
  "bg-sky-100/50 dark:bg-sky-900/20",
  "bg-violet-100/50 dark:bg-violet-900/20",
  "bg-pink-100/50 dark:bg-pink-900/20",
  "bg-teal-100/50 dark:bg-teal-900/20",
  "bg-orange-100/50 dark:bg-orange-900/20",
  "bg-indigo-100/50 dark:bg-indigo-900/20",
];

export const SudokuGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [userBoard, setUserBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedTime(0);
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const initGame = useCallback(() => {
    const { puzzle: newPuzzle, solution: newSolution } = generateSudoku(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setUserBoard(newPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setErrors(new Set());
    setIsComplete(false);
    setCompletionTime(null);
    startTimer();
  }, [difficulty, startTimer]);

  useEffect(() => {
    initGame();
    return () => stopTimer();
  }, [initGame, stopTimer]);

  const handleCellClick = (row: number, col: number) => {
    if (puzzle[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (puzzle[row][col] !== 0) return;

    const newBoard = userBoard.map(r => [...r]);
    newBoard[row][col] = num;
    setUserBoard(newBoard);

    const newErrors = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newBoard[r][c] !== 0 && newBoard[r][c] !== solution[r][c]) {
          newErrors.add(`${r}-${c}`);
        }
      }
    }
    setErrors(newErrors);

    const complete = newBoard.every((row, r) => 
      row.every((cell, c) => cell === solution[r][c])
    );
    if (complete) {
      setIsComplete(true);
      setCompletionTime(elapsedTime);
      stopTimer();
      toast({ title: "🎉 Congratulations!", description: `You solved the Sudoku in ${elapsedTime} seconds!` });
    }
  };

  const handleHint = () => {
    if (!selectedCell) {
      toast({ title: "Select a cell first", description: "Click on an empty cell to get a hint" });
      return;
    }
    const { row, col } = selectedCell;
    if (puzzle[row][col] !== 0) return;
    
    const newBoard = userBoard.map(r => [...r]);
    newBoard[row][col] = solution[row][col];
    setUserBoard(newBoard);
    setErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(`${row}-${col}`);
      return newErrors;
    });
  };

  const clearCell = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (puzzle[row][col] !== 0) return;
    
    const newBoard = userBoard.map(r => [...r]);
    newBoard[row][col] = 0;
    setUserBoard(newBoard);
    setErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(`${row}-${col}`);
      return newErrors;
    });
  };

  const getBoxIndex = (row: number, col: number) => {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/30 border-2 border-rose-200 dark:border-rose-800 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500">
          <Grid3X3 className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">Sudoku</h2>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="w-4 h-4 text-rose-500" />
          <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
        </div>
        <div className="flex gap-1">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(d)}
              className={cn(
                "text-xs h-7 px-2",
                difficulty === d && "bg-gradient-to-r from-rose-500 to-amber-500 border-0"
              )}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="mb-3 p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium text-sm">Completed in {formatTime(completionTime!)}!</span>
        </div>
      )}

      <div className="grid grid-cols-9 gap-0 border-2 border-foreground/30 mb-3 aspect-square rounded-lg overflow-hidden shadow-inner">
        {userBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isOriginal = puzzle[rowIndex]?.[colIndex] !== 0;
            const hasError = errors.has(`${rowIndex}-${colIndex}`);
            const isInSameBox = selectedCell && 
              Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
              Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3);
            const isInSameRowOrCol = selectedCell && 
              (rowIndex === selectedCell.row || colIndex === selectedCell.col);
            const boxIdx = getBoxIndex(rowIndex, colIndex);

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm font-medium border border-border/30 transition-all",
                  colIndex % 3 === 2 && colIndex !== 8 && "border-r-2 border-r-foreground/40",
                  rowIndex % 3 === 2 && rowIndex !== 8 && "border-b-2 border-b-foreground/40",
                  boxColors[boxIdx],
                  isSelected && "!bg-rose-300 dark:!bg-rose-700 ring-2 ring-rose-500",
                  !isSelected && isInSameBox && "brightness-95",
                  !isSelected && isInSameRowOrCol && "brightness-90",
                  isOriginal ? "text-foreground font-bold" : "text-rose-600 dark:text-rose-400",
                  hasError && "!bg-red-300 dark:!bg-red-800 text-red-700 dark:text-red-300",
                  !isOriginal && !isSelected && "hover:brightness-90 cursor-pointer"
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isOriginal}
              >
                {cell !== 0 ? cell : ""}
              </button>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-9 gap-1 mb-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className={cn(
              "aspect-square p-0 text-sm font-bold",
              "bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/50 dark:to-amber-900/50",
              "hover:from-rose-200 hover:to-amber-200 dark:hover:from-rose-800/50 dark:hover:to-amber-800/50",
              "border-rose-300 dark:border-rose-700"
            )}
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell || isComplete}
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={initGame} className="flex-1 text-xs h-8 border-rose-300 dark:border-rose-700">
          <RefreshCw className="w-3 h-3 mr-1" />
          New
        </Button>
        <Button variant="outline" onClick={handleHint} disabled={isComplete} className="text-xs h-8 border-amber-300 dark:border-amber-700">
          <Lightbulb className="w-3 h-3 mr-1" />
          Hint
        </Button>
        <Button variant="outline" onClick={clearCell} disabled={!selectedCell || isComplete} className="text-xs h-8 border-rose-300 dark:border-rose-700">
          <XCircle className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
    </Card>
  );
};
