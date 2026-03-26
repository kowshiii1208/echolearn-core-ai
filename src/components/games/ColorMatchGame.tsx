import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Play, Trophy, Calendar, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGameScores, getDailySeed } from "@/hooks/useGameScores";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  { name: "Red", hsl: "0 80% 55%" },
  { name: "Blue", hsl: "220 80% 55%" },
  { name: "Green", hsl: "140 70% 42%" },
  { name: "Yellow", hsl: "50 90% 50%" },
  { name: "Purple", hsl: "270 70% 55%" },
  { name: "Orange", hsl: "25 90% 55%" },
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

interface Round {
  word: string;
  displayColor: string;
  displayColorName: string;
  isMatch: boolean;
}

const generateRounds = (count: number, seed?: number): Round[] => {
  let currentSeed = seed ?? Math.random() * 1000000;
  const random = () => {
    currentSeed++;
    return seededRandom(currentSeed);
  };

  const rounds: Round[] = [];
  for (let i = 0; i < count; i++) {
    const wordIdx = Math.floor(random() * COLORS.length);
    const isMatch = random() > 0.5;
    const colorIdx = isMatch ? wordIdx : (wordIdx + 1 + Math.floor(random() * (COLORS.length - 1))) % COLORS.length;
    rounds.push({
      word: COLORS[wordIdx].name,
      displayColor: COLORS[colorIdx].hsl,
      displayColorName: COLORS[colorIdx].name,
      isMatch: isMatch,
    });
  }
  return rounds;
};

const ROUND_COUNTS = { easy: 10, medium: 15, hard: 25 };
type Difficulty = "easy" | "medium" | "hard";

export const ColorMatchGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const { bestScore, saveScore } = useGameScores("colormatch");

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedTime(0);
    timerRef.current = setInterval(() => setElapsedTime(p => p + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const initGame = useCallback((daily: boolean = false) => {
    const seed = daily ? getDailySeed() + 5000 : undefined;
    const diff = daily ? "medium" : difficulty;
    setRounds(generateRounds(ROUND_COUNTS[diff], seed));
    setCurrentRound(0);
    setScore(0);
    setIsComplete(false);
    setCompletionTime(null);
    setIsDailyChallenge(daily);
    setFeedback(null);
    startTimer();
    setIsPlaying(true);
  }, [difficulty, startTimer]);

  const handleAnswer = (answer: boolean) => {
    if (isComplete || feedback) return;
    const correct = answer === rounds[currentRound].isMatch;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= rounds.length) {
        const finalScore = correct ? score + 1 : score;
        setIsComplete(true);
        setCompletionTime(elapsedTime);
        stopTimer();
        saveScore({ difficulty: isDailyChallenge ? "medium" : difficulty, completionTime: elapsedTime, isDailyChallenge });
        toast({ title: "🎨 Game Over!", description: `Score: ${finalScore}/${rounds.length} in ${elapsedTime}s` });
      } else {
        setCurrentRound(r => r + 1);
      }
    }, 500);
  };

  const formatTime = (s: number) => { const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s}s`; };

  if (!isPlaying) {
    return (
      <Card className="p-6 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-fuchsia-950/40 border-2 border-rose-200 dark:border-rose-800 shadow-xl shadow-rose-200/50 dark:shadow-rose-900/30 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-fuchsia-400/20 to-transparent rounded-full blur-2xl" />

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 mb-4 shadow-lg shadow-rose-400/40 relative">
          <Palette className="w-14 h-14 text-white drop-shadow-lg" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">Color Match</h2>
        <p className="text-sm text-muted-foreground mb-4">Does the word match its color?</p>

        {bestScore && (
          <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 mb-4 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Best: {formatTime(bestScore.completion_time)}</span>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
            <Button key={d} variant={difficulty === d ? "default" : "outline"} size="sm"
              onClick={() => setDifficulty(d)}
              className={cn("text-sm px-4 py-2 transition-all duration-300",
                difficulty === d ? "bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 border-0 shadow-lg scale-105" : "hover:scale-105 hover:border-rose-400"
              )}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => initGame(false)} className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 hover:from-rose-600 hover:via-pink-600 hover:to-fuchsia-600 text-white px-8 py-5 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Play className="w-5 h-5 mr-2" /> Play
          </Button>
          <Button onClick={() => initGame(true)} variant="outline" className="border-fuchsia-300 dark:border-fuchsia-700 bg-gradient-to-r from-fuchsia-100 to-rose-100 dark:from-fuchsia-900/40 dark:to-rose-900/40 hover:scale-105 transition-all duration-300 py-5">
            <Calendar className="w-5 h-5 mr-2 text-fuchsia-500" /> Daily
          </Button>
        </div>
      </Card>
    );
  }

  const round = rounds[currentRound];

  return (
    <Card className="p-4 bg-gradient-to-br from-rose-50 to-fuchsia-50 dark:from-rose-950/30 dark:to-fuchsia-950/30 border-2 border-rose-200 dark:border-rose-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500 to-fuchsia-500">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">Color Match</h2>
          {isDailyChallenge && <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-200 dark:bg-fuchsia-800 text-fuchsia-700 dark:text-fuchsia-300">Daily</span>}
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span>{score}/{rounds.length}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-rose-500" />
            <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-rose-100 dark:bg-rose-900/40 mb-4 overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500"
          animate={{ width: `${((currentRound + (isComplete ? 1 : 0)) / rounds.length) * 100}%` }}
          transition={{ duration: 0.3 }} />
      </div>

      {isComplete ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
          <div className="text-6xl mb-4">{score >= rounds.length * 0.8 ? "🏆" : score >= rounds.length * 0.5 ? "👍" : "💪"}</div>
          <h3 className="text-2xl font-bold mb-2">Final Score: {score}/{rounds.length}</h3>
          <p className="text-muted-foreground mb-4">Completed in {formatTime(completionTime!)}</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => setIsPlaying(false)} className="border-rose-300">← Back</Button>
            <Button onClick={() => initGame(isDailyChallenge)} className="bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white">Play Again</Button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-6 py-4">
          <p className="text-sm text-muted-foreground">Does the <strong>word</strong> match its <strong>display color</strong>?</p>

          <AnimatePresence mode="wait">
            <motion.div key={currentRound} initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }} exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn("relative text-5xl md:text-7xl font-extrabold py-8 px-12 rounded-2xl select-none",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 shadow-2xl border border-white/50 dark:border-white/10",
                feedback === "correct" && "ring-4 ring-emerald-400",
                feedback === "wrong" && "ring-4 ring-red-400"
              )}
              style={{ color: `hsl(${round.displayColor})` }}>
              {round.word}
              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className={cn("absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                      feedback === "correct" ? "bg-emerald-500" : "bg-red-500")}>
                    {feedback === "correct" ? <CheckCircle className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => handleAnswer(true)} size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg shadow-lg shadow-emerald-300/40">
                <CheckCircle className="w-5 h-5 mr-2" /> Match
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => handleAnswer(false)} size="lg"
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-6 text-lg shadow-lg shadow-red-300/40">
                <X className="w-5 h-5 mr-2" /> No Match
              </Button>
            </motion.div>
          </div>

          <p className="text-xs text-muted-foreground">Round {currentRound + 1} of {rounds.length}</p>
        </div>
      )}

      {!isComplete && (
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={() => { setIsPlaying(false); stopTimer(); }} className="text-xs h-8 border-rose-300 dark:border-rose-700">← Back</Button>
        </div>
      )}
    </Card>
  );
};
