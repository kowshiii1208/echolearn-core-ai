import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Crown, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type BoardSize = 4 | 5 | 6 | 8;

const generateColorRegions = (size: BoardSize): number[][] => {
  const regions = Array(size).fill(null).map(() => Array(size).fill(-1));
  
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
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (regions[r][c] === -1) {
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
  "bg-gradient-to-br from-rose-300 to-rose-400 dark:from-rose-800 dark:to-rose-700",
  "bg-gradient-to-br from-sky-300 to-sky-400 dark:from-sky-800 dark:to-sky-700",
  "bg-gradient-to-br from-emerald-300 to-emerald-400 dark:from-emerald-800 dark:to-emerald-700",
  "bg-gradient-to-br from-amber-300 to-amber-400 dark:from-amber-800 dark:to-amber-700",
  "bg-gradient-to-br from-violet-300 to-violet-400 dark:from-violet-800 dark:to-violet-700",
  "bg-gradient-to-br from-pink-300 to-pink-400 dark:from-pink-800 dark:to-pink-700",
  "bg-gradient-to-br from-orange-300 to-orange-400 dark:from-orange-800 dark:to-orange-700",
  "bg-gradient-to-br from-cyan-300 to-cyan-400 dark:from-cyan-800 dark:to-cyan-700",
];

export const QueensGame = () => {
  const [size, setSize] = useState<BoardSize>(5);
  const [regions, setRegions] = useState<number[][]>([]);
  const [queens, setQueens] = useState<boolean[][]>([]);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
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
    const newRegions = generateColorRegions(size);
    setRegions(newRegions);
    setQueens(Array(size).fill(null).map(() => Array(size).fill(false)));
    setConflicts(new Set());
    setIsComplete(false);
    setCompletionTime(null);
    startTimer();
  }, [size, startTimer]);

  useEffect(() => {
    initGame();
    return () => stopTimer();
  }, [initGame, stopTimer]);

  const checkConflicts = (board: boolean[][]): Set<string> => {
    const newConflicts = new Set<string>();
    const queenPositions: [number, number][] = [];
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c]) {
          queenPositions.push([r, c]);
        }
      }
    }
    
    for (let i = 0; i < queenPositions.length; i++) {
      for (let j = i + 1; j < queenPositions.length; j++) {
        const [r1, c1] = queenPositions[i];
        const [r2, c2] = queenPositions[j];
        
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          newConflicts.add(`${r1}-${c1}`);
          newConflicts.add(`${r2}-${c2}`);
        }
        
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
      setCompletionTime(elapsedTime);
      stopTimer();
      toast({ title: "👑 Congratulations!", description: `You placed all queens correctly in ${elapsedTime} seconds!` });
    }
  };

  const queenCount = queens.flat().filter(Boolean).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30 border-2 border-violet-200 dark:border-violet-800 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500">
          <Crown className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Queens</h2>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="w-4 h-4 text-violet-500" />
          <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
        </div>
        <div className="flex gap-1">
          {([4, 5, 6, 8] as BoardSize[]).map((s) => (
            <Button
              key={s}
              variant={size === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSize(s)}
              className={cn(
                "text-xs h-7 px-2",
                size === s && "bg-gradient-to-r from-violet-500 to-pink-500 border-0"
              )}
            >
              {s}×{s}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        Place {size} queens—no attacks, one per color.
      </p>

      {isComplete && (
        <div className="mb-3 p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium text-sm">Completed in {formatTime(completionTime!)}!</span>
        </div>
      )}

      <div className="mb-3 flex items-center gap-2 text-sm">
        <Crown className="w-4 h-4 text-amber-500" />
        <span className="font-medium">{queenCount} / {size}</span>
      </div>

      <div 
        className="grid gap-0.5 mb-3 aspect-square rounded-lg overflow-hidden shadow-inner p-1 bg-foreground/10"
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
                  "aspect-square flex items-center justify-center rounded-sm transition-all shadow-sm",
                  regionColors[regionIndex % regionColors.length],
                  hasConflict && "ring-2 ring-red-500 ring-inset animate-pulse",
                  !isComplete && "hover:brightness-110 hover:scale-105 cursor-pointer active:scale-95"
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {hasQueen && (
                  <Crown 
                    className={cn(
                      "w-5 h-5 drop-shadow-lg",
                      hasConflict ? "text-red-600 dark:text-red-400" : "text-amber-500"
                    )} 
                    fill="currentColor"
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      <Button 
        variant="outline" 
        onClick={initGame} 
        className="w-full text-xs h-8 border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/50"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        New Game
      </Button>
    </Card>
  );
};
