import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle, Clock, Play, Trophy, Calendar, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGameScores, getDailySeed } from "@/hooks/useGameScores";

type Difficulty = "easy" | "medium" | "hard";

interface Problem {
  question: string;
  answer: number;
  options: number[];
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const generateProblem = (difficulty: Difficulty, seed: number): Problem => {
  let currentSeed = seed;
  const random = () => {
    currentSeed++;
    return seededRandom(currentSeed);
  };

  let a: number, b: number, answer: number, question: string;

  if (difficulty === "easy") {
    a = Math.floor(random() * 20) + 1;
    b = Math.floor(random() * 20) + 1;
    const op = random() > 0.5;
    if (op) {
      answer = a + b;
      question = `${a} + ${b}`;
    } else {
      answer = a - b;
      question = `${a} - ${b}`;
    }
  } else if (difficulty === "medium") {
    const opType = Math.floor(random() * 3);
    if (opType === 0) {
      a = Math.floor(random() * 50) + 10;
      b = Math.floor(random() * 50) + 10;
      answer = a + b;
      question = `${a} + ${b}`;
    } else if (opType === 1) {
      a = Math.floor(random() * 12) + 2;
      b = Math.floor(random() * 12) + 2;
      answer = a * b;
      question = `${a} × ${b}`;
    } else {
      a = Math.floor(random() * 50) + 20;
      b = Math.floor(random() * 30) + 5;
      answer = a - b;
      question = `${a} - ${b}`;
    }
  } else {
    const opType = Math.floor(random() * 3);
    if (opType === 0) {
      a = Math.floor(random() * 15) + 5;
      b = Math.floor(random() * 15) + 5;
      answer = a * b;
      question = `${a} × ${b}`;
    } else if (opType === 1) {
      b = Math.floor(random() * 12) + 2;
      answer = Math.floor(random() * 12) + 2;
      a = b * answer;
      question = `${a} ÷ ${b}`;
    } else {
      a = Math.floor(random() * 100) + 50;
      b = Math.floor(random() * 100) + 50;
      answer = a + b;
      question = `${a} + ${b}`;
    }
  }

  const options = [answer];
  while (options.length < 4) {
    const offset = Math.floor(random() * 10) - 5;
    const wrong = answer + (offset === 0 ? 1 : offset);
    if (!options.includes(wrong)) {
      options.push(wrong);
    }
  }

  return {
    question: `${question} = ?`,
    answer,
    options: options.sort(() => random() - 0.5),
  };
};

const TOTAL_PROBLEMS = 10;

export const MathRushGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<number | null>(null); // selected option index
  const [seedBase, setSeedBase] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const { bestScore, saveScore } = useGameScores("mathrush");

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
    const seed = daily ? getDailySeed() + 5000 : Math.floor(Math.random() * 1000000);
    const diff = daily ? "medium" : difficulty;
    setSeedBase(seed);
    const p = generateProblem(diff, seed);
    setProblem(p);
    setScore(0);
    setRound(1);
    setIsComplete(false);
    setCompletionTime(null);
    setIsDailyChallenge(daily);
    setFeedback(null);
    startTimer();
    setIsPlaying(true);
  }, [difficulty, startTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const handleAnswer = (selected: number, optionIndex: number) => {
    if (feedback !== null) return;

    setFeedback(optionIndex);
    const correct = selected === problem!.answer;
    if (correct) setScore(s => s + 1);

    const currentRound = round;

    setTimeout(() => {
      if (currentRound >= TOTAL_PROBLEMS) {
        const finalScore = correct ? score + 1 : score;
        setIsComplete(true);
        setCompletionTime(elapsedTime);
        stopTimer();
        saveScore({ difficulty: isDailyChallenge ? "medium" : difficulty, completionTime: elapsedTime, isDailyChallenge });
        toast({ title: "🔢 Game Over!", description: `Score: ${finalScore}/${TOTAL_PROBLEMS} in ${elapsedTime}s!` });
      } else {
        const diff = isDailyChallenge ? "medium" : difficulty;
        const newProblem = generateProblem(diff, seedBase + currentRound * 100);
        setProblem(newProblem);
        setRound(r => r + 1);
        setFeedback(null);
      }
    }, 500);
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
      <Card className="p-6 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/40 dark:via-sky-950/30 dark:to-blue-950/40 border-2 border-cyan-200 dark:border-cyan-800 shadow-xl shadow-cyan-200/50 dark:shadow-cyan-900/30 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-400/20 to-transparent rounded-full blur-2xl" />

        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 mb-4 shadow-lg shadow-cyan-400/40 dark:shadow-cyan-600/30 relative">
          <Calculator className="w-14 h-14 text-white drop-shadow-lg" />
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 bg-clip-text text-transparent mb-1">
          Math Rush
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Quick mental math challenges</p>

        {bestScore && (
          <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 mb-4 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800">
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
                  ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 border-0 shadow-lg shadow-cyan-400/40 scale-105"
                  : "hover:scale-105 hover:border-cyan-400"
              )}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => initGame(false)}
            className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-600 hover:via-sky-600 hover:to-blue-600 text-white px-8 py-5 text-lg shadow-lg shadow-cyan-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>
          <Button
            onClick={() => initGame(true)}
            variant="outline"
            className="border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 hover:scale-105 transition-all duration-300 py-5"
          >
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Daily
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-2 border-cyan-200 dark:border-cyan-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Math Rush</h2>
          {isDailyChallenge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300">Daily</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span>{round}/{TOTAL_PROBLEMS}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span className="tabular-nums">{formatTime(completionTime ?? elapsedTime)}</span>
          </div>
        </div>
      </div>

      {isComplete ? (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-8 h-8" />
            <span className="font-bold text-xl">{score}/{TOTAL_PROBLEMS}</span>
            <span className="text-sm">Completed in {formatTime(completionTime!)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack} className="text-xs h-8 border-cyan-300 dark:border-cyan-700">
              ← Back
            </Button>
            <Button variant="outline" onClick={() => initGame(isDailyChallenge)} className="flex-1 text-xs h-8 border-cyan-300 dark:border-cyan-700">
              <RefreshCw className="w-3 h-3 mr-1" />
              Play Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Score: {score}</p>
            <div className="py-6 px-4 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 border border-cyan-200 dark:border-cyan-700">
              <span className="text-3xl font-bold text-foreground">{problem?.question}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {problem?.options.map((option, i) => {
              const isSelected = feedback === i;
              const isCorrect = option === problem.answer;
              const showResult = feedback !== null;

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(option, i)}
                  disabled={feedback !== null}
                  className={cn(
                    "py-4 rounded-xl text-lg font-bold transition-all duration-200 shadow-sm",
                    !showResult && "bg-gradient-to-br from-white to-cyan-50 dark:from-slate-800 dark:to-cyan-950 border-2 border-cyan-200 dark:border-cyan-700 hover:scale-105 hover:border-cyan-400 cursor-pointer",
                    showResult && isCorrect && "bg-gradient-to-br from-emerald-400 to-teal-400 dark:from-emerald-600 dark:to-teal-600 text-white border-2 border-emerald-500 scale-105",
                    showResult && isSelected && !isCorrect && "bg-gradient-to-br from-red-400 to-rose-400 dark:from-red-600 dark:to-rose-600 text-white border-2 border-red-500 scale-95",
                    showResult && !isCorrect && !isSelected && "opacity-50"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack} className="text-xs h-8 border-cyan-300 dark:border-cyan-700">
              ← Back
            </Button>
            <Button variant="outline" onClick={() => initGame(isDailyChallenge)} className="flex-1 text-xs h-8 border-cyan-300 dark:border-cyan-700">
              <RefreshCw className="w-3 h-3 mr-1" />
              Restart
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
