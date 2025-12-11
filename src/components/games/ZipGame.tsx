import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type GridSize = 5 | 6 | 7;

const generateZipPuzzle = (size: GridSize): { start: [number, number]; end: [number, number]; grid: number[][] } => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(0));
  
  // Generate a valid path through the grid
  const path: [number, number][] = [];
  const visited = new Set<string>();
  
  // Start from a random position
  const startRow = Math.floor(Math.random() * size);
  const startCol = Math.floor(Math.random() * size);
  path.push([startRow, startCol]);
  visited.add(`${startRow}-${startCol}`);
  
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  
  // Try to create a long path
  let current = [startRow, startCol];
  const maxAttempts = size * size * 10;
  let attempts = 0;
  
  while (path.length < size * size && attempts < maxAttempts) {
    const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
    let moved = false;
    
    for (const [dr, dc] of shuffledDirs) {
      const nr = current[0] + dr;
      const nc = current[1] + dc;
      
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited.has(`${nr}-${nc}`)) {
        path.push([nr, nc]);
        visited.add(`${nr}-${nc}`);
        current = [nr, nc];
        moved = true;
        break;
      }
    }
    
    if (!moved) {
      // Backtrack
      if (path.length > 1) {
        path.pop();
        const lastKey = `${current[0]}-${current[1]}`;
        visited.delete(lastKey);
        current = path[path.length - 1];
      }
    }
    attempts++;
  }
  
  // Mark start (1) and end (path length) on grid
  const start = path[0];
  const end = path[path.length - 1];
  grid[start[0]][start[1]] = 1;
  grid[end[0]][end[1]] = path.length;
  
  return { start, end, grid };
};

export const ZipGame = () => {
  const [size, setSize] = useState<GridSize>(5);
  const [puzzle, setPuzzle] = useState<{ start: [number, number]; end: [number, number]; grid: number[][] } | null>(null);
  const [path, setPath] = useState<[number, number][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const initGame = useCallback(() => {
    const newPuzzle = generateZipPuzzle(size);
    setPuzzle(newPuzzle);
    setPath([newPuzzle.start]);
    setIsComplete(false);
  }, [size]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const isAdjacent = (pos1: [number, number], pos2: [number, number]): boolean => {
    const [r1, c1] = pos1;
    const [r2, c2] = pos2;
    return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
  };

  const handleCellClick = (row: number, col: number) => {
    if (isComplete || !puzzle) return;
    
    const cellKey = `${row}-${col}`;
    const lastPos = path[path.length - 1];
    
    // Check if clicking on the last cell in path (to undo)
    if (path.length > 1) {
      const prevPos = path[path.length - 2];
      if (prevPos[0] === row && prevPos[1] === col) {
        // Undo last move
        setPath(path.slice(0, -1));
        return;
      }
    }
    
    // Check if cell is already in path
    if (path.some(([r, c]) => r === row && c === col)) {
      return;
    }
    
    // Check if adjacent to last position
    if (!isAdjacent(lastPos, [row, col])) {
      return;
    }
    
    const newPath = [...path, [row, col] as [number, number]];
    setPath(newPath);
    
    // Check for win
    if (row === puzzle.end[0] && col === puzzle.end[1] && newPath.length === size * size) {
      setIsComplete(true);
      toast({ title: "Congratulations!", description: "You completed the Zip puzzle!" });
    }
  };

  const handleUndo = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  const getPathIndex = (row: number, col: number): number => {
    return path.findIndex(([r, c]) => r === row && c === col);
  };

  const getConnectionClass = (row: number, col: number): string => {
    const idx = getPathIndex(row, col);
    if (idx === -1) return "";
    
    const classes: string[] = [];
    
    // Check connections to adjacent cells in path
    if (idx > 0) {
      const [pr, pc] = path[idx - 1];
      if (pr === row - 1) classes.push("border-t-primary border-t-4");
      if (pr === row + 1) classes.push("border-b-primary border-b-4");
      if (pc === col - 1) classes.push("border-l-primary border-l-4");
      if (pc === col + 1) classes.push("border-r-primary border-r-4");
    }
    
    if (idx < path.length - 1) {
      const [nr, nc] = path[idx + 1];
      if (nr === row - 1) classes.push("border-t-primary border-t-4");
      if (nr === row + 1) classes.push("border-b-primary border-b-4");
      if (nc === col - 1) classes.push("border-l-primary border-l-4");
      if (nc === col + 1) classes.push("border-r-primary border-r-4");
    }
    
    return classes.join(" ");
  };

  if (!puzzle) return null;

  const targetLength = size * size;

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Zip</h2>
        <div className="flex gap-2">
          {([5, 6, 7] as GridSize[]).map((s) => (
            <Button
              key={s}
              variant={size === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSize(s)}
            >
              {s}×{s}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Connect numbers from 1 to {targetLength} by drawing a path through adjacent cells. 
        Visit every cell exactly once.
      </p>

      {isComplete && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Puzzle Completed!</span>
        </div>
      )}

      <div className="mb-4 text-sm text-muted-foreground">
        Progress: {path.length} / {targetLength}
      </div>

      <div 
        className="grid gap-0 border-2 border-foreground/30 mb-4 aspect-square"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {Array(size).fill(null).map((_, rowIndex) =>
          Array(size).fill(null).map((_, colIndex) => {
            const isStart = puzzle.start[0] === rowIndex && puzzle.start[1] === colIndex;
            const isEnd = puzzle.end[0] === rowIndex && puzzle.end[1] === colIndex;
            const pathIdx = getPathIndex(rowIndex, colIndex);
            const inPath = pathIdx !== -1;
            const isLastInPath = pathIdx === path.length - 1;
            const lastPos = path[path.length - 1];
            const canClick = !inPath && isAdjacent(lastPos, [rowIndex, colIndex]);

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center border border-border/50 transition-all text-sm font-bold relative",
                  inPath && "bg-primary/20",
                  isLastInPath && !isComplete && "bg-primary/40 ring-2 ring-primary",
                  canClick && !isComplete && "hover:bg-primary/10 cursor-pointer",
                  !canClick && !inPath && "cursor-not-allowed opacity-50",
                  isStart && "bg-green-500/30",
                  isEnd && "bg-red-500/30",
                  getConnectionClass(rowIndex, colIndex)
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isComplete}
              >
                {isStart && <span className="text-green-600 dark:text-green-400">1</span>}
                {isEnd && <span className="text-red-600 dark:text-red-400">{targetLength}</span>}
                {inPath && !isStart && !isEnd && (
                  <span className="text-primary text-xs">{pathIdx + 1}</span>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={initGame} className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          New Game
        </Button>
        <Button variant="outline" onClick={handleUndo} disabled={path.length <= 1 || isComplete}>
          <Undo className="w-4 h-4 mr-2" />
          Undo
        </Button>
      </div>
    </Card>
  );
};
