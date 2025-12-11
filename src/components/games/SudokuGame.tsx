import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Difficulty = "easy" | "medium" | "hard";

const generateSudoku = (difficulty: Difficulty): { puzzle: number[][], solution: number[][] } => {
  // Generate a solved sudoku first
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

  // Create puzzle by removing numbers
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

export const SudokuGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [userBoard, setUserBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const initGame = useCallback(() => {
    const { puzzle: newPuzzle, solution: newSolution } = generateSudoku(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setUserBoard(newPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setErrors(new Set());
    setIsComplete(false);
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

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

    // Check for errors
    const newErrors = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newBoard[r][c] !== 0 && newBoard[r][c] !== solution[r][c]) {
          newErrors.add(`${r}-${c}`);
        }
      }
    }
    setErrors(newErrors);

    // Check completion
    const complete = newBoard.every((row, r) => 
      row.every((cell, c) => cell === solution[r][c])
    );
    if (complete) {
      setIsComplete(true);
      toast({ title: "Congratulations!", description: "You solved the Sudoku!" });
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

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Sudoku</h2>
        <div className="flex gap-2">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Puzzle Completed!</span>
        </div>
      )}

      <div className="grid grid-cols-9 gap-0 border-2 border-foreground/30 mb-4 aspect-square">
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

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-lg font-medium border border-border/50 transition-colors",
                  colIndex % 3 === 2 && colIndex !== 8 && "border-r-2 border-r-foreground/30",
                  rowIndex % 3 === 2 && rowIndex !== 8 && "border-b-2 border-b-foreground/30",
                  isSelected && "bg-primary/30",
                  !isSelected && isInSameBox && "bg-muted/50",
                  !isSelected && isInSameRowOrCol && "bg-muted/30",
                  isOriginal ? "text-foreground font-bold" : "text-primary",
                  hasError && "bg-destructive/20 text-destructive",
                  !isOriginal && !isSelected && "hover:bg-muted cursor-pointer"
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

      <div className="grid grid-cols-9 gap-1 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="aspect-square p-0 text-lg font-medium"
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell || isComplete}
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={initGame} className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          New Game
        </Button>
        <Button variant="outline" onClick={handleHint} disabled={isComplete}>
          <Lightbulb className="w-4 h-4 mr-2" />
          Hint
        </Button>
        <Button variant="outline" onClick={clearCell} disabled={!selectedCell || isComplete}>
          <XCircle className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </Card>
  );
};
