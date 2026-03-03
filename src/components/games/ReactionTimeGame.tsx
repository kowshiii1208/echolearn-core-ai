import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Play, Trophy, Calendar, Zap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGameScores, getDailySeed } from "@/hooks/useGameScores";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "waiting" | "ready" | "go" | "result" | "too-early";

const TOTAL_ROUNDS = 5;

export const ReactionTimeGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const goTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { bestScore, saveScore } = useGameScores("reaction");

  const startRound = useCallback(() => {
    setPhase("ready");
    const delay = 1500 + Math.random() * 4000;
    timeoutRef.current = setTimeout(() => {
      goTimeRef.current = performance.now();
      setPhase("go");
    }, delay);
  }, []);

  const initGame = useCallback((daily: boolean = false) => {
    setReactionTimes([]);
    setCurrentRound(0);
    setIsComplete(false);
    setIsDailyChallenge(daily);
    setIsPlaying(true);
    setPhase("waiting");
  }, []);

  const handleClick = () => {
    if (phase === "waiting") {
      startRound();
    } else if (phase === "ready") {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("too-early");
    } else if (phase === "go") {
      const rt = Math.round(performance.now() - goTimeRef.current);
      const newTimes = [...reactionTimes, rt];
      setReactionTimes(newTimes);
      setCurrentRound(c => c + 1);
      setPhase("result");

      if (newTimes.length >= TOTAL_ROUNDS) {
        setIsComplete(true);
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
        const avgSeconds = Math.round(avg / 100) / 10; // convert to rough seconds for leaderboard
        saveScore({ difficulty: "medium", completionTime: avgSeconds, isDailyChallenge: daily });
        toast({ title: "⚡ Results!", description: `Average reaction time: ${avg}ms` });
      }
    } else if (phase === "result" || phase === "too-early") {
      if (!isComplete) startRound();
    }
  };

  const avgTime = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
  const daily = isDailyChallenge;

  const formatTime = (s: number) => `${s}s`;

  if (!isPlaying) {
    return (
      <Card className="p-6 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/40 dark:via-amber-950/30 dark:to-orange-950/40 border-2 border-yellow-200 dark:border-yellow-800 shadow-xl shadow-yellow-200/50 dark:shadow-yellow-900/30 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-orange-400/20 to-transparent rounded-full blur-2xl" />

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 mb-4 shadow-lg shadow-yellow-400/40 relative">
          <Zap className="w-14 h-14 text-white drop-shadow-lg" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">Reaction Time</h2>
        <p className="text-sm text-muted-foreground mb-4">Test your reflexes!</p>

        {bestScore && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-4 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Best avg: {formatTime(bestScore.completion_time)}</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={() => initGame(false)} className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white px-8 py-5 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Play className="w-5 h-5 mr-2" /> Play
          </Button>
          <Button onClick={() => initGame(true)} variant="outline" className="border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/40 dark:to-yellow-900/40 hover:scale-105 transition-all duration-300 py-5">
            <Calendar className="w-5 h-5 mr-2 text-orange-500" /> Daily
          </Button>
        </div>
      </Card>
    );
  }

  const phaseConfig = {
    waiting: { bg: "from-sky-400 to-blue-500", text: "Click to start!", subtext: `Round ${currentRound + 1} of ${TOTAL_ROUNDS}` },
    ready: { bg: "from-red-500 to-rose-600", text: "Wait for green...", subtext: "Don't click yet!" },
    go: { bg: "from-emerald-400 to-green-500", text: "CLICK NOW!", subtext: "" },
    "too-early": { bg: "from-red-600 to-rose-700", text: "Too early! ❌", subtext: "Click to try again" },
    result: { bg: "from-sky-400 to-indigo-500", text: `${reactionTimes[reactionTimes.length - 1]}ms`, subtext: isComplete ? "Done!" : "Click for next round" },
  };

  const config = phaseConfig[phase];

  return (
    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Reaction</h2>
          {isDailyChallenge && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300">Daily</span>}
        </div>
        <span className="text-sm font-medium text-muted-foreground">{currentRound}/{TOTAL_ROUNDS}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-3 justify-center">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <motion.div key={i}
            animate={{ scale: i === currentRound && !isComplete ? [1, 1.3, 1] : 1 }}
            transition={{ repeat: i === currentRound && !isComplete ? Infinity : 0, duration: 1 }}
            className={cn("w-3 h-3 rounded-full transition-all",
              i < reactionTimes.length ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm shadow-emerald-300" :
              i === currentRound ? "bg-gradient-to-r from-amber-400 to-orange-500" :
              "bg-muted"
            )} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.button key={phase} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }}
          onClick={handleClick}
          disabled={isComplete}
          className={cn(
            "w-full rounded-2xl py-16 flex flex-col items-center justify-center cursor-pointer select-none transition-shadow",
            `bg-gradient-to-br ${config.bg}`,
            "shadow-2xl hover:shadow-3xl",
            isComplete && "opacity-60 cursor-default"
          )}>
          <span className={cn("text-white font-extrabold drop-shadow-lg", phase === "result" ? "text-5xl" : "text-3xl")}>
            {config.text}
          </span>
          {config.subtext && <span className="text-white/80 text-sm mt-2">{config.subtext}</span>}
        </motion.button>
      </AnimatePresence>

      {/* Results */}
      {reactionTimes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Average</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-lg">{avgTime}ms</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {reactionTimes.map((t, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                className={cn("text-xs px-2 py-1 rounded-full font-medium",
                  t < 250 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                  t < 400 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                )}>
                {t}ms
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex gap-2 mt-3">
        <Button variant="outline" onClick={() => setIsPlaying(false)} className="text-xs h-8 border-yellow-300 dark:border-yellow-700">← Back</Button>
        <Button variant="outline" onClick={() => initGame(isDailyChallenge)} className="flex-1 text-xs h-8 border-yellow-300 dark:border-yellow-700">
          <RotateCcw className="w-3 h-3 mr-1" /> Restart
        </Button>
      </div>
    </Card>
  );
};
