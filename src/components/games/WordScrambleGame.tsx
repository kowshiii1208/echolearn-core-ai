import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle, Clock, Play, Trophy, Calendar, Type, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGameScores, getDailySeed } from "@/hooks/useGameScores";

type Difficulty = "easy" | "medium" | "hard";

const WORDS: Record<Difficulty, string[]> = {
  easy: ["APPLE", "HOUSE", "WATER", "CHAIR", "BRUSH", "PLANT", "TRAIN", "STONE", "LIGHT", "BREAD", "CLOUD", "DANCE", "FLAME", "GREEN", "HEART"],
  medium: ["PLANET", "BRIDGE", "CASTLE", "FOREST", "GARDEN", "ISLAND", "JUNGLE", "LAPTOP", "MARKET", "ORANGE", "PUZZLE", "ROCKET", "SILVER", "TEMPLE", "WINTER"],
  hard: ["ABSTRACT", "BUILDING", "CHAMPION", "DAUGHTER", "ELEPHANT", "FUNCTION", "GORGEOUS", "HOSPITAL", "INFRARED", "KEYBOARD", "LANGUAGE", "MOUNTAIN", "NITROGEN", "OPPOSITE", "PLATFORM"],
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const scrambleWord = (word: string, seed?: number): string => {
  let currentSeed = seed ?? Math.random() * 1000000;
  const random = () => {
    currentSeed++;
    return seededRandom(currentSeed);
  };
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === word ? scrambleWord(word, (seed ?? 0) + 1) : result;
};

export const WordScrambleGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [currentWord, setCurrentWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const usedWordsRef = useRef<Set<string>>(new Set());
  const { toast } = useToast();
  const { bestScore, saveScore } = useGameScores("wordscramble");

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

  const pickWord = useCallback((diff: Difficulty, seed?: number) => {
    let currentSeed = seed ?? Math.random() * 1000000;
    const random = () => {
      currentSeed++;
      return seededRandom(currentSeed);
    };
    const pool = WORDS[diff].filter(w => !usedWordsRef.current.has(w));
    const available = pool.length > 0 ? pool : WORDS[diff];
    const word = available[Math.floor(random() * available.length)];
    usedWordsRef.current.add(word);
    return { word, scrambled: scrambleWord(word, currentSeed) };
  }, []);

  const initGame = useCallback((daily: boolean = false) => {
    const seed = daily ? getDailySeed() + 4000 : undefined;
    const diff = daily ? "medium" : difficulty;
    usedWordsRef.current = new Set();
    const { word, scrambled: s } = pickWord(diff, seed);
    setCurrentWord(word);
    setScrambled(s);
    setGuess("");
    setScore(0);
    setRound(1);
    setIsComplete(false);
    setCompletionTime(null);
    setIsDailyChallenge(daily);
    setFeedback(null);
    startTimer();
    setIsPlaying(true);
  }, [difficulty, startTimer, pickWord]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (isPlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPlaying, round]);

  const nextRound = useCallback(() => {
    const diff = isDailyChallenge ? "medium" : difficulty;
    const { word, scrambled: s } = pickWord(diff);
    setCurrentWord(word);
    setScrambled(s);
    setGuess("");
    setFeedback(null);
  }, [difficulty, isDailyChallenge, pickWord]);

  const handleSubmit = () => {
    if (guess.toUpperCase() === currentWord) {
      setScore(s => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    if (round >= totalRounds) {
      const finalScore = guess.toUpperCase() === currentWord ? score + 1 : score;
      setTimeout(() => {
        setIsComplete(true);
        setCompletionTime(elapsedTime);
        stopTimer();
        saveScore({ difficulty: isDailyChallenge ? "medium" : difficulty, completionTime: elapsedTime, isDailyChallenge });
        toast({ title: "📝 Game Over!", description: `You got ${finalScore}/${totalRounds} in ${elapsedTime}s!` });
      }, 600);
    } else {
      setTimeout(() => {
        setRound(r => r + 1);
        nextRound();
      }, 600);
    }
  };

  const handleSkip = () => {
    if (round >= totalRounds) {
      setIsComplete(true);
      setCompletionTime(elapsedTime);
      stopTimer();
      saveScore({ difficulty: isDailyChallenge ? "medium" : difficulty, completionTime: elapsedTime, isDailyChallenge });
      toast({ title: "📝 Game Over!", description: `You got ${score}/${totalRounds} in ${elapsedTime}s!` });
    } else {
      setRound(r => r + 1);
      nextRound();
    }
  };

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
      <Card className="p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-lime-50 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-lime-950/40 border-2 border-amber-200 dark:border-amber-800 shadow-xl shadow-amber-200/50 dark:shadow-amber-900/30 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-lime-400/20 to-transparent rounded-full blur-2xl" />

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-lime-500 mb-4 shadow-lg shadow-amber-400/40 dark:shadow-amber-600/30 relative">
          <Type className="w-14 h-14 text-white drop-shadow-lg" />
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-lime-600 bg-clip-text text-transparent mb-1">
          Word Scramble
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Unscramble the letters</p>

        {bestScore && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-4 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800">
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
                  ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 border-0 shadow-lg shadow-amber-400/40 scale-105"
                  : "hover:scale-105 hover:border-amber-400"
              )}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => initGame(false)}
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 hover:from-amber-600 hover:via-yellow-600 hover:to-lime-600 text-white px-8 py-5 text-lg shadow-lg shadow-amber-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>
          <Button
            onClick={() => initGame(true)}
            variant="outline"
            className="border-lime-300 dark:border-lime-700 bg-gradient-to-r from-lime-100 to-amber-100 dark:from-lime-900/40 dark:to-amber-900/40 hover:scale-105 transition-all duration-300 py-5"
          >
            <Calendar className="w-5 h-5 mr-2 text-lime-500" />
            Daily
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-lime-50 dark:from-amber-950/30 dark:to-lime-950/30 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-lime-500">
            <Type className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-lime-600 bg-clip-text text-transparent">Scramble</h2>
          {isDailyChallenge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-lime-200 dark:bg-lime-800 text-lime-700 dark:text-lime-300">Daily</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span>Round {round}/{totalRounds}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="mb-3 p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium text-sm">Score: {score}/{totalRounds} in {formatTime(completionTime!)}!</span>
        </div>
      )}

      {!isComplete && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Score: {score}/{totalRounds}</p>
            <div className="flex justify-center gap-2 mb-4">
              {scrambled.split("").map((letter, i) => (
                <span
                  key={i}
                  className="w-10 h-12 rounded-lg bg-gradient-to-br from-amber-300 to-yellow-300 dark:from-amber-700 dark:to-yellow-700 flex items-center justify-center text-xl font-bold text-foreground shadow-md"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && guess.length > 0 && handleSubmit()}
              placeholder="Type your answer..."
              className={cn(
                "flex-1 px-4 py-2 rounded-lg border-2 bg-background text-foreground font-medium text-center text-lg tracking-wider focus:outline-none transition-colors",
                feedback === "correct" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                feedback === "wrong" && "border-red-500 bg-red-50 dark:bg-red-950/30",
                !feedback && "border-amber-300 dark:border-amber-700 focus:border-amber-500"
              )}
              disabled={isComplete}
              maxLength={currentWord.length}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={guess.length === 0}
              className="flex-1 bg-gradient-to-r from-amber-500 to-lime-500 hover:from-amber-600 hover:to-lime-600 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Submit
            </Button>
            <Button variant="outline" onClick={handleSkip} className="border-amber-300 dark:border-amber-700">
              <SkipForward className="w-4 h-4 mr-1" />
              Skip
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Button variant="outline" onClick={handleBack} className="text-xs h-8 border-amber-300 dark:border-amber-700">
          ← Back
        </Button>
        <Button variant="outline" onClick={() => initGame(isDailyChallenge)} className="flex-1 text-xs h-8 border-amber-300 dark:border-amber-700">
          <RefreshCw className="w-3 h-3 mr-1" />
          New Game
        </Button>
      </div>
    </Card>
  );
};
