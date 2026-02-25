import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle, Clock, Play, Trophy, Calendar, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGameScores, getDailySeed } from "@/hooks/useGameScores";

type Difficulty = "easy" | "medium" | "hard";

const EMOJIS = ["🐶", "🐱", "🐸", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐮", "🐷", "🐵", "🐔", "🐧", "🦄", "🐝", "🦋", "🐢"];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const generateBoard = (difficulty: Difficulty, seed?: number): string[] => {
  let currentSeed = seed ?? Math.random() * 1000000;
  const random = () => {
    currentSeed++;
    return seededRandom(currentSeed);
  };

  const pairCount = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 12;
  const selected = [...EMOJIS].sort(() => random() - 0.5).slice(0, pairCount);
  const cards = [...selected, ...selected];
  return cards.sort(() => random() - 0.5);
};

const gridConfig: Record<Difficulty, string> = {
  easy: "grid-cols-3",
  medium: "grid-cols-4",
  hard: "grid-cols-6",
};

export const MemoryMatchGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [moves, setMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { bestScore, saveScore } = useGameScores("memory");

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
    const seed = daily ? getDailySeed() + 3000 : undefined;
    const diff = daily ? "medium" : difficulty;
    const board = generateBoard(diff, seed);
    setCards(board);
    setFlipped([]);
    setMatched(new Set());
    setIsComplete(false);
    setCompletionTime(null);
    setIsDailyChallenge(daily);
    setMoves(0);
    setIsChecking(false);
    startTimer();
    setIsPlaying(true);
  }, [difficulty, startTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || isComplete || isChecking) return;
    if (flipped.includes(index) || matched.has(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        const newMatched = new Set(matched);
        newMatched.add(newFlipped[0]);
        newMatched.add(newFlipped[1]);
        setMatched(newMatched);
        setFlipped([]);
        setIsChecking(false);

        if (newMatched.size === cards.length) {
          setIsComplete(true);
          setCompletionTime(elapsedTime);
          stopTimer();
          saveScore({ difficulty: daily ? "medium" : difficulty, completionTime: elapsedTime, isDailyChallenge });
          toast({ title: "🧠 Congratulations!", description: `Completed in ${moves + 1} moves and ${elapsedTime}s!` });
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 800);
      }
    }
  };

  const daily = isDailyChallenge;

  const handleBack = () => {
    setIsPlaying(false);
    stopTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!isPlaying) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border-2 border-blue-200 dark:border-blue-800 shadow-xl shadow-blue-200/50 dark:shadow-blue-900/30 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-2xl" />

        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 mb-4 shadow-lg shadow-blue-400/40 dark:shadow-blue-600/30 relative">
          <Layers className="w-14 h-14 text-white drop-shadow-lg" />
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
          Memory Match
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Find all matching pairs</p>

        {bestScore && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Best: {formatTime(bestScore.completion_time)}</span>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(d)}
              className={cn(
                "text-sm px-4 py-2 transition-all duration-300",
                difficulty === d
                  ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 border-0 shadow-lg shadow-blue-400/40 scale-105"
                  : "hover:scale-105 hover:border-blue-400"
              )}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => initGame(false)}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-8 py-5 text-lg shadow-lg shadow-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>
          <Button
            onClick={() => initGame(true)}
            variant="outline"
            className="border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 hover:scale-105 transition-all duration-300 py-5"
          >
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Daily
          </Button>
        </div>
      </Card>
    );
  }

  const currentDiff = isDailyChallenge ? "medium" : difficulty;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Memory</h2>
          {isDailyChallenge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300">Daily</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span>{moves} moves</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="mb-3 p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium text-sm">Completed in {moves} moves & {formatTime(completionTime!)}!</span>
        </div>
      )}

      <div className={cn("grid gap-2 mb-3", gridConfig[currentDiff])}>
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index) || matched.has(index);
          return (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={cn(
                "aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all duration-300 shadow-sm",
                isFlipped
                  ? "bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 scale-100"
                  : "bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-700 dark:to-indigo-600 hover:scale-105 hover:brightness-110 cursor-pointer",
                matched.has(index) && "from-emerald-300 to-teal-300 dark:from-emerald-700 dark:to-teal-700 ring-2 ring-emerald-400"
              )}
              disabled={isComplete}
            >
              {isFlipped ? emoji : "?"}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleBack} className="text-xs h-8 border-blue-300 dark:border-blue-700">
          ← Back
        </Button>
        <Button variant="outline" onClick={() => initGame(isDailyChallenge)} className="flex-1 text-xs h-8 border-blue-300 dark:border-blue-700">
          <RefreshCw className="w-3 h-3 mr-1" />
          Restart
        </Button>
      </div>
    </Card>
  );
};
