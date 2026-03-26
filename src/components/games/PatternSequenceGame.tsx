import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Play, Trophy, Calendar, Grid2X2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGameScores, getDailySeed } from "@/hooks/useGameScores";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "easy" | "medium" | "hard";

const TILE_COLORS = [
  "from-rose-400 to-pink-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-sky-500",
];

const GRID_SIZE: Record<Difficulty, number> = { easy: 9, medium: 12, hard: 16 };
const START_SEQ: Record<Difficulty, number> = { easy: 3, medium: 4, hard: 5 };

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const PatternSequenceGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [level, setLevel] = useState(1);
  const [highlightTile, setHighlightTile] = useState<number | null>(null);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const { bestScore, saveScore } = useGameScores("pattern");

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedTime(0);
    timerRef.current = setInterval(() => setElapsedTime(p => p + 1), 1000);
  }, []);
  const stopTimer = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);
  useEffect(() => () => stopTimer(), [stopTimer]);

  const gridSize = isDailyChallenge ? GRID_SIZE.medium : GRID_SIZE[difficulty];
  const cols = Math.ceil(Math.sqrt(gridSize));

  const addToSequence = useCallback((seed?: number) => {
    let currentSeed = seed ?? Math.random() * 1000000;
    const random = () => { currentSeed++; return seededRandom(currentSeed); };
    return (prev: number[]) => {
      const next = Math.floor(random() * gridSize);
      return [...prev, next];
    };
  }, [gridSize]);

  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowing(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setHighlightTile(seq[i]);
      await new Promise(r => setTimeout(r, 500));
      setHighlightTile(null);
    }
    await new Promise(r => setTimeout(r, 200));
    setIsShowing(false);
  }, []);

  const initGame = useCallback((daily: boolean = false) => {
    const diff = daily ? "medium" : difficulty;
    const startLen = START_SEQ[diff];
    const seed = daily ? getDailySeed() + 6000 : Math.random() * 1000000;
    let s = seed;
    let seq: number[] = [];
    const g = daily ? GRID_SIZE.medium : GRID_SIZE[diff];
    for (let i = 0; i < startLen; i++) {
      s++;
      const x = Math.sin(s) * 10000;
      const r = x - Math.floor(x);
      seq.push(Math.floor(r * g));
    }
    setSequence(seq);
    setPlayerSequence([]);
    setLevel(1);
    setIsComplete(false);
    setCompletionTime(null);
    setIsDailyChallenge(daily);
    setWrongTile(null);
    setIsPlaying(true);
    startTimer();
    setTimeout(() => showSequence(seq), 500);
  }, [difficulty, startTimer, showSequence]);

  const handleTileClick = (index: number) => {
    if (isShowing || isComplete) return;

    const nextIndex = playerSequence.length;
    if (sequence[nextIndex] === index) {
      setHighlightTile(index);
      setTimeout(() => setHighlightTile(null), 200);
      const newPlayerSeq = [...playerSequence, index];
      setPlayerSequence(newPlayerSeq);

      if (newPlayerSeq.length === sequence.length) {
        // Level complete!
        setLevel(l => l + 1);
        const newSeq = [...sequence];
        const s = Math.random() * 1000000;
        const x = Math.sin(s) * 10000;
        newSeq.push(Math.floor((x - Math.floor(x)) * gridSize));
        setSequence(newSeq);
        setPlayerSequence([]);
        setTimeout(() => showSequence(newSeq), 800);
      }
    } else {
      // Wrong!
      setWrongTile(index);
      setTimeout(() => setWrongTile(null), 500);
      setIsComplete(true);
      setCompletionTime(elapsedTime);
      stopTimer();
      const finalLevel = level;
      saveScore({ difficulty: isDailyChallenge ? "medium" : difficulty, completionTime: elapsedTime, isDailyChallenge });
      toast({ title: "🧩 Game Over!", description: `Reached level ${finalLevel} (${sequence.length - 1} tiles) in ${elapsedTime}s` });
    }
  };

  const formatTime = (s: number) => { const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s}s`; };

  if (!isPlaying) {
    return (
      <Card className="p-6 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 dark:from-teal-950/40 dark:via-cyan-950/30 dark:to-sky-950/40 border-2 border-teal-200 dark:border-teal-800 shadow-xl shadow-teal-200/50 dark:shadow-teal-900/30 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-sky-400/20 to-transparent rounded-full blur-2xl" />

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 mb-4 shadow-lg shadow-teal-400/40 relative">
          <Grid2X2 className="w-14 h-14 text-white drop-shadow-lg" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent mb-1">Pattern Sequence</h2>
        <p className="text-sm text-muted-foreground mb-4">Watch & repeat the pattern</p>

        {bestScore && (
          <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 mb-4 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Best: {formatTime(bestScore.completion_time)}</span>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
            <Button key={d} variant={difficulty === d ? "default" : "outline"} size="sm"
              onClick={() => setDifficulty(d)}
              className={cn("text-sm px-4 py-2 transition-all duration-300",
                difficulty === d ? "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 border-0 shadow-lg scale-105" : "hover:scale-105 hover:border-teal-400"
              )}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => initGame(false)} className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 hover:from-teal-600 hover:via-cyan-600 hover:to-sky-600 text-white px-8 py-5 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Play className="w-5 h-5 mr-2" /> Play
          </Button>
          <Button onClick={() => initGame(true)} variant="outline" className="border-sky-300 dark:border-sky-700 bg-gradient-to-r from-sky-100 to-teal-100 dark:from-sky-900/40 dark:to-teal-900/40 hover:scale-105 transition-all duration-300 py-5">
            <Calendar className="w-5 h-5 mr-2 text-sky-500" /> Daily
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-950/30 dark:to-sky-950/30 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-sky-500">
            <Grid2X2 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">Pattern</h2>
          {isDailyChallenge && <span className="text-xs px-2 py-0.5 rounded-full bg-sky-200 dark:bg-sky-800 text-sky-700 dark:text-sky-300">Daily</span>}
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span>Level {level}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-teal-500" />
            <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
          </div>
        </div>
      </div>

      {isShowing && (
        <div className="mb-3 p-2 bg-gradient-to-r from-teal-500/20 to-sky-500/20 border border-teal-500/30 rounded-lg flex items-center gap-2 text-teal-600 dark:text-teal-400">
          <Eye className="w-4 h-4 animate-pulse" />
          <span className="font-medium text-sm">Watch the sequence...</span>
        </div>
      )}

      {isComplete && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mb-3 p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Trophy className="w-4 h-4" />
          <span className="font-medium text-sm">Reached level {level} — {sequence.length - 1} tiles memorized!</span>
        </motion.div>
      )}

      <div className={cn("grid gap-2 mb-3")} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: gridSize }, (_, i) => (
          <motion.button key={i}
            whileHover={!isShowing && !isComplete ? { scale: 1.08 } : {}}
            whileTap={!isShowing && !isComplete ? { scale: 0.92 } : {}}
            onClick={() => handleTileClick(i)}
            disabled={isShowing || isComplete}
            className={cn(
              "aspect-square rounded-xl transition-all duration-200 shadow-sm border",
              highlightTile === i
                ? "bg-gradient-to-br from-amber-300 to-yellow-400 dark:from-amber-500 dark:to-yellow-500 scale-110 shadow-lg shadow-amber-300/50 border-amber-400"
                : wrongTile === i
                ? "bg-gradient-to-br from-red-400 to-rose-500 scale-95 shadow-lg shadow-red-300/50 border-red-400"
                : "bg-gradient-to-br from-teal-200 to-cyan-200 dark:from-teal-800 dark:to-cyan-800 hover:from-teal-300 hover:to-cyan-300 dark:hover:from-teal-700 dark:hover:to-cyan-700 cursor-pointer border-teal-300 dark:border-teal-700"
            )}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => { setIsPlaying(false); stopTimer(); }} className="text-xs h-8 border-teal-300 dark:border-teal-700">← Back</Button>
        <Button variant="outline" onClick={() => initGame(isDailyChallenge)} className="flex-1 text-xs h-8 border-teal-300 dark:border-teal-700">Restart</Button>
      </div>
    </Card>
  );
};
