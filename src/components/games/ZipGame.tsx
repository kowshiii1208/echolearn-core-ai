import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle, Undo, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type GridSize = 5 | 6 | 7;

const generateZipPuzzle = (size: GridSize): { start: [number, number]; end: [number, number]; grid: number[][] } => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(0));
  
  const path: [number, number][] = [];
  const visited = new Set<string>();
  
  const startRow = Math.floor(Math.random() * size);
  const startCol = Math.floor(Math.random() * size);
  path.push([startRow, startCol]);
  visited.add(`${startRow}-${startCol}`);
  
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  
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
      if (path.length > 1) {
        path.pop();
        const lastKey = `${current[0]}-${current[1]}`;
        visited.delete(lastKey);
        current = path[path.length - 1];
      }
    }
    attempts++;
  }
  
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
    const newPuzzle = generateZipPuzzle(size);
    setPuzzle(newPuzzle);
    setPath([newPuzzle.start]);
    setIsComplete(false);
    setCompletionTime(null);
    startTimer();
  }, [size, startTimer]);

  useEffect(() => {
    initGame();
    return () => stopTimer();
  }, [initGame, stopTimer]);

  const isAdjacent = (pos1: [number, number], pos2: [number, number]): boolean => {
    const [r1, c1] = pos1;
    const [r2, c2] = pos2;
    return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
  };

  const handleCellClick = (row: number, col: number) => {
    if (isComplete || !puzzle) return;
    
    const lastPos = path[path.length - 1];
    
    if (path.length > 1) {
      const prevPos = path[path.length - 2];
      if (prevPos[0] === row && prevPos[1] === col) {
        setPath(path.slice(0, -1));
        return;
      }
    }
    
    if (path.some(([r, c]) => r === row && c === col)) {
      return;
    }
    
    if (!isAdjacent(lastPos, [row, col])) {
      return;
    }
    
    const newPath = [...path, [row, col] as [number, number]];
    setPath(newPath);
    
    if (row === puzzle.end[0] && col === puzzle.end[1] && newPath.length === size * size) {
      setIsComplete(true);
      setCompletionTime(elapsedTime);
      stopTimer();
      toast({ title: "⚡ Congratulations!", description: `You completed Zip in ${elapsedTime} seconds!` });
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!puzzle) return null;

  const targetLength = size * size;

  return (
    <Card className="p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Zip</h2>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
        </div>
        <div className="flex gap-1">
          {([5, 6, 7] as GridSize[]).map((s) => (
            <Button
              key={s}
              variant={size === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSize(s)}
              className={cn(
                "text-xs h-7 px-2",
                size === s && "bg-gradient-to-r from-emerald-500 to-cyan-500 border-0"
              )}
            >
              {s}×{s}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        Connect 1 to {targetLength}. Visit every cell once.
      </p>

      {isComplete && (
        <div className="mb-3 p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium text-sm">Completed in {formatTime(completionTime!)}!</span>
        </div>
      )}

      <div className="mb-3 text-sm font-medium text-muted-foreground">
        Progress: <span className="text-emerald-600 dark:text-emerald-400">{path.length}</span> / {targetLength}
      </div>

      <div 
        className="grid gap-0.5 mb-3 aspect-square rounded-lg overflow-hidden shadow-inner p-1 bg-foreground/10"
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
                  "aspect-square flex items-center justify-center rounded-sm transition-all text-sm font-bold relative shadow-sm",
                  "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700",
                  inPath && "from-emerald-300 to-cyan-300 dark:from-emerald-700 dark:to-cyan-700",
                  isLastInPath && !isComplete && "ring-2 ring-emerald-500 from-emerald-400 to-cyan-400 dark:from-emerald-600 dark:to-cyan-600",
                  canClick && !isComplete && "hover:from-emerald-200 hover:to-cyan-200 dark:hover:from-emerald-800 dark:hover:to-cyan-800 hover:scale-105 cursor-pointer",
                  !canClick && !inPath && "opacity-60",
                  isStart && "from-green-400 to-green-500 dark:from-green-600 dark:to-green-500",
                  isEnd && "from-red-400 to-red-500 dark:from-red-600 dark:to-red-500"
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isComplete}
              >
                {isStart && <span className="text-white font-bold drop-shadow">1</span>}
                {isEnd && <span className="text-white font-bold drop-shadow">{targetLength}</span>}
                {inPath && !isStart && !isEnd && (
                  <span className="text-emerald-800 dark:text-emerald-200 text-xs font-bold">{pathIdx + 1}</span>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={initGame} 
          className="flex-1 text-xs h-8 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          New
        </Button>
        <Button 
          variant="outline" 
          onClick={handleUndo} 
          disabled={path.length <= 1 || isComplete}
          className="text-xs h-8 border-cyan-300 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/50"
        >
          <Undo className="w-3 h-3 mr-1" />
          Undo
        </Button>
      </div>
    </Card>
  );
};
