import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Crown, CheckCircle, Clock, Play, Trophy, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGameScores, getDailySeed } from "@/hooks/useGameScores";

type BoardSize = 4 | 5 | 6 | 8;

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const generateColorRegions = (size: BoardSize, seed?: number): number[][] => {
  let currentSeed = seed ?? Math.random() * 1000000;
  const random = () => {
    currentSeed++;
    return seededRandom(currentSeed);
  };

  const regions = Array(size).fill(null).map(() => Array(size).fill(-1));
  
  for (let i = 0; i < size; i++) {
    const startRow = Math.floor(random() * size);
    const startCol = Math.floor(random() * size);
    
    const queue: [number, number][] = [[startRow, startCol]];
    let filled = 0;
    const targetSize = Math.floor((size * size) / size);
    
    while (queue.length > 0 && filled < targetSize) {
      const [r, c] = queue.shift()!;
      if (r < 0 || r >= size || c < 0 || c >= size) continue;
      if (regions[r][c] !== -1) continue;
      
      regions[r][c] = i;
      filled++;
      
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]].sort(() => random() - 0.5);
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
  "bg-gradient-to-br from-rose-400 to-rose-500 dark:from-rose-700 dark:to-rose-600 shadow-rose-300/50 dark:shadow-rose-800/50",
  "bg-gradient-to-br from-sky-400 to-sky-500 dark:from-sky-700 dark:to-sky-600 shadow-sky-300/50 dark:shadow-sky-800/50",
  "bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-700 dark:to-emerald-600 shadow-emerald-300/50 dark:shadow-emerald-800/50",
  "bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-700 dark:to-amber-600 shadow-amber-300/50 dark:shadow-amber-800/50",
  "bg-gradient-to-br from-violet-400 to-violet-500 dark:from-violet-700 dark:to-violet-600 shadow-violet-300/50 dark:shadow-violet-800/50",
  "bg-gradient-to-br from-pink-400 to-pink-500 dark:from-pink-700 dark:to-pink-600 shadow-pink-300/50 dark:shadow-pink-800/50",
  "bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-700 dark:to-orange-600 shadow-orange-300/50 dark:shadow-orange-800/50",
  "bg-gradient-to-br from-cyan-400 to-cyan-500 dark:from-cyan-700 dark:to-cyan-600 shadow-cyan-300/50 dark:shadow-cyan-800/50",
];

export const QueensGame = () => {
  const [size, setSize] = useState<BoardSize>(5);
  const [regions, setRegions] = useState<number[][]>([]);
  const [queens, setQueens] = useState<boolean[][]>([]);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { bestScore, saveScore } = useGameScores("queens");

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

  const initGame = useCallback((daily: boolean = false) => {
    const seed = daily ? getDailySeed() + 1000 : undefined;
    const gameSize = daily ? 6 : size;
    const newRegions = generateColorRegions(gameSize, seed);
    setRegions(newRegions);
    setQueens(Array(gameSize).fill(null).map(() => Array(gameSize).fill(false)));
    setConflicts(new Set());
    setIsComplete(false);
    setCompletionTime(null);
    setIsDailyChallenge(daily);
    startTimer();
    setIsPlaying(true);
  }, [size, startTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const handlePlay = (daily: boolean = false) => {
    initGame(daily);
  };

  const currentSize = isDailyChallenge ? 6 : size;

  const checkConflicts = useCallback((board: boolean[][], boardRegions: number[][]): Set<string> => {
    const newConflicts = new Set<string>();
    const queenPositions: [number, number][] = [];
    const boardSize = board.length;
    
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) {
          queenPositions.push([r, c]);
        }
      }
    }
    
    for (let i = 0; i < queenPositions.length; i++) {
      for (let j = i + 1; j < queenPositions.length; j++) {
        const [r1, c1] = queenPositions[i];
        const [r2, c2] = queenPositions[j];
        
        // Check row, column, and diagonal conflicts
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          newConflicts.add(`${r1}-${c1}`);
          newConflicts.add(`${r2}-${c2}`);
        }
        
        // Check same region conflict
        if (boardRegions[r1]?.[c1] === boardRegions[r2]?.[c2]) {
          newConflicts.add(`${r1}-${c1}`);
          newConflicts.add(`${r2}-${c2}`);
        }
      }
    }
    
    return newConflicts;
  }, []);

  const checkWin = useCallback((board: boolean[][], boardRegions: number[][]): boolean => {
    let queenCount = 0;
    const regionsWithQueens = new Set<number>();
    const boardSize = board.length;
    
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) {
          queenCount++;
          if (boardRegions[r]?.[c] !== undefined) {
            regionsWithQueens.add(boardRegions[r][c]);
          }
        }
      }
    }
    
    return queenCount === boardSize && 
           regionsWithQueens.size === boardSize && 
           checkConflicts(board, boardRegions).size === 0;
  }, [checkConflicts]);

  const handleCellClick = (row: number, col: number) => {
    if (isComplete || !isPlaying || regions.length === 0) return;
    
    const newQueens = queens.map(r => [...r]);
    newQueens[row][col] = !newQueens[row][col];
    setQueens(newQueens);
    
    const newConflicts = checkConflicts(newQueens, regions);
    setConflicts(newConflicts);
    
    if (checkWin(newQueens, regions)) {
      setIsComplete(true);
      setCompletionTime(elapsedTime);
      stopTimer();
      const gameSize = regions.length;
      saveScore({ difficulty: `${gameSize}x${gameSize}`, completionTime: elapsedTime, isDailyChallenge });
      toast({ title: "👑 Congratulations!", description: `You placed all queens correctly in ${elapsedTime} seconds!` });
    }
  };

  const queenCount = queens.flat().filter(Boolean).length;

  const handleBack = () => {
    setIsPlaying(false);
    stopTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getSizeLabel = (s: BoardSize) => {
    switch (s) {
      case 4: return "Easy";
      case 5: return "Medium";
      case 6: return "Hard";
      case 8: return "Expert";
    }
  };

  // Menu view (before playing)
  if (!isPlaying) {
    return (
      <Card className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-pink-950/40 border-2 border-violet-200 dark:border-violet-800 shadow-xl shadow-violet-200/50 dark:shadow-violet-900/30 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-pink-400/20 to-transparent rounded-full blur-2xl" />
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 mb-4 shadow-lg shadow-violet-400/40 dark:shadow-violet-600/30 animate-pulse-soft relative">
          <Crown className="w-14 h-14 text-white drop-shadow-lg" />
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
          Queens
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Place queens without conflicts</p>
        
        {bestScore && (
          <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 mb-4 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Best: {formatTime(bestScore.completion_time)}</span>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {([4, 5, 6, 8] as BoardSize[]).map((s) => (
            <Button
              key={s}
              variant={size === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSize(s)}
              className={cn(
                "text-sm px-4 py-2 transition-all duration-300",
                size === s 
                  ? "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 border-0 shadow-lg shadow-violet-400/40 scale-105" 
                  : "hover:scale-105 hover:border-violet-400"
              )}
            >
              {getSizeLabel(s)}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handlePlay(false)}
            className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-5 text-lg shadow-lg shadow-violet-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>
          <Button
            onClick={() => handlePlay(true)}
            variant="outline"
            className="border-pink-300 dark:border-pink-700 bg-gradient-to-r from-pink-100 to-violet-100 dark:from-pink-900/40 dark:to-violet-900/40 hover:scale-105 transition-all duration-300 py-5"
          >
            <Calendar className="w-5 h-5 mr-2 text-pink-500" />
            Daily
          </Button>
        </div>
      </Card>
    );
  }

  // Game view
  return (
    <Card className="p-4 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30 border-2 border-violet-200 dark:border-violet-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Queens</h2>
          {isDailyChallenge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-200 dark:bg-pink-800 text-pink-700 dark:text-pink-300">Daily</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="w-4 h-4 text-violet-500" />
          <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        Place {currentSize} queens—no attacks, one per color.
      </p>

      {isComplete && (
        <div className="mb-3 p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium text-sm">Completed in {formatTime(completionTime!)}!</span>
        </div>
      )}

      <div className="mb-3 flex items-center gap-2 text-sm">
        <Crown className="w-4 h-4 text-amber-500" />
        <span className="font-medium">{queenCount} / {currentSize}</span>
      </div>

      <div 
        className="grid gap-0.5 mb-3 aspect-square rounded-lg overflow-hidden shadow-inner p-1 bg-foreground/10"
        style={{ gridTemplateColumns: `repeat(${currentSize}, 1fr)` }}
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

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleBack} className="text-xs h-8 border-violet-300 dark:border-violet-700">
          ← Back
        </Button>
        <Button 
          variant="outline" 
          onClick={() => initGame(isDailyChallenge)} 
          className="flex-1 text-xs h-8 border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/50"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Restart
        </Button>
      </div>
    </Card>
  );
};
