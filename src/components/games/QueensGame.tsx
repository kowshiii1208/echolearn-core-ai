import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Crown, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type BoardSize = 4 | 5 | 6 | 8;

const generateColorRegions = (size: BoardSize): number[][] => {
  const regions = Array(size).fill(null).map(() => Array(size).fill(-1));
  
  // Simple region generation - create contiguous regions
  for (let i = 0; i < size; i++) {
    const startRow = Math.floor(Math.random() * size);
    const startCol = Math.floor(Math.random() * size);
    
    const queue: [number, number][] = [[startRow, startCol]];
    let filled = 0;
    const targetSize = Math.floor((size * size) / size);
    
    while (queue.length > 0 && filled < targetSize) {
      const [r, c] = queue.shift()!;
      if (r < 0 || r >= size || c < 0 || c >= size) continue;
      if (regions[r][c] !== -1) continue;
      
      regions[r][c] = i;
      filled++;
      
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]].sort(() => Math.random() - 0.5);
      for (const [dr, dc] of dirs) {
        queue.push([r + dr, c + dc]);
      }
    }
  }
  
  // Fill any remaining cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (regions[r][c] === -1) {
        // Find nearest assigned region
        for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc] !== -1) {
            regions[r][c] = regions[nr][nc];
            break;
          }
        }
        if (regions[r][c] === -1) {
          regions[r][c] = 0;
        }
      }
    }
  }
  
  return regions;
};

const regionColors = [
  "bg-red-200 dark:bg-red-900/50",
  "bg-blue-200 dark:bg-blue-900/50",
  "bg-green-200 dark:bg-green-900/50",
  "bg-yellow-200 dark:bg-yellow-900/50",
  "bg-purple-200 dark:bg-purple-900/50",
  "bg-pink-200 dark:bg-pink-900/50",
  "bg-orange-200 dark:bg-orange-900/50",
  "bg-cyan-200 dark:bg-cyan-900/50",
];

export const QueensGame = () => {
  const [size, setSize] = useState<BoardSize>(5);
  const [regions, setRegions] = useState<number[][]>([]);
  const [queens, setQueens] = useState<boolean[][]>([]);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const initGame = useCallback(() => {
    const newRegions = generateColorRegions(size);
    setRegions(newRegions);
    setQueens(Array(size).fill(null).map(() => Array(size).fill(false)));
    setConflicts(new Set());
    setIsComplete(false);
  }, [size]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const checkConflicts = (board: boolean[][]): Set<string> => {
    const newConflicts = new Set<string>();
    const queenPositions: [number, number][] = [];
    
    // Find all queens
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c]) {
          queenPositions.push([r, c]);
        }
      }
    }
    
    // Check each pair of queens
    for (let i = 0; i < queenPositions.length; i++) {
      for (let j = i + 1; j < queenPositions.length; j++) {
        const [r1, c1] = queenPositions[i];
        const [r2, c2] = queenPositions[j];
        
        // Same row, column, or diagonal
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          newConflicts.add(`${r1}-${c1}`);
          newConflicts.add(`${r2}-${c2}`);
        }
        
        // Same region
        if (regions[r1][c1] === regions[r2][c2]) {
          newConflicts.add(`${r1}-${c1}`);
          newConflicts.add(`${r2}-${c2}`);
        }
      }
    }
    
    return newConflicts;
  };

  const checkWin = (board: boolean[][]): boolean => {
    let queenCount = 0;
    const regionsWithQueens = new Set<number>();
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c]) {
          queenCount++;
          regionsWithQueens.add(regions[r][c]);
        }
      }
    }
    
    // Need exactly `size` queens, one in each region, no conflicts
    return queenCount === size && 
           regionsWithQueens.size === size && 
           checkConflicts(board).size === 0;
  };

  const handleCellClick = (row: number, col: number) => {
    if (isComplete) return;
    
    const newQueens = queens.map(r => [...r]);
    newQueens[row][col] = !newQueens[row][col];
    setQueens(newQueens);
    
    const newConflicts = checkConflicts(newQueens);
    setConflicts(newConflicts);
    
    if (checkWin(newQueens)) {
      setIsComplete(true);
      toast({ title: "Congratulations!", description: "You placed all queens correctly!" });
    }
  };

  const queenCount = queens.flat().filter(Boolean).length;

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Queens</h2>
        <div className="flex gap-2">
          {([4, 5, 6, 8] as BoardSize[]).map((s) => (
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
        Place {size} queens so that no two queens attack each other (row, column, diagonal) 
        and each colored region has exactly one queen.
      </p>

      {isComplete && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Puzzle Completed!</span>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 text-sm">
        <Crown className="w-4 h-4 text-yellow-500" />
        <span>Queens placed: {queenCount} / {size}</span>
      </div>

      <div 
        className="grid gap-0 border-2 border-foreground/30 mb-4 aspect-square"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {queens.map((row, rowIndex) =>
          row.map((hasQueen, colIndex) => {
            const regionIndex = regions[rowIndex]?.[colIndex] ?? 0;
            const hasConflict = conflicts.has(`${rowIndex}-${colIndex}`);

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center border border-border/30 transition-all",
                  regionColors[regionIndex % regionColors.length],
                  hasConflict && "ring-2 ring-destructive ring-inset",
                  !isComplete && "hover:brightness-90 cursor-pointer"
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {hasQueen && (
                  <Crown 
                    className={cn(
                      "w-6 h-6",
                      hasConflict ? "text-destructive" : "text-yellow-600 dark:text-yellow-400"
                    )} 
                    fill="currentColor"
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      <Button variant="outline" onClick={initGame} className="w-full">
        <RefreshCw className="w-4 h-4 mr-2" />
        New Game
      </Button>
    </Card>
  );
};
