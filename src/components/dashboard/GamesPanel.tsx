import { SudokuGame } from "@/components/games/SudokuGame";
import { QueensGame } from "@/components/games/QueensGame";
import { ZipGame } from "@/components/games/ZipGame";
import { Leaderboard } from "@/components/games/Leaderboard";
import { Gamepad2, Calendar, CheckCircle, Flame } from "lucide-react";
import { useDailyChallengeStatus, useGameStreak } from "@/hooks/useGameScores";
import { cn } from "@/lib/utils";

export const GamesPanel = () => {
  const { data: dailyStatus } = useDailyChallengeStatus();
  const { data: streak } = useGameStreak();

  const completedCount = dailyStatus 
    ? [dailyStatus.sudoku, dailyStatus.queens, dailyStatus.zip].filter(Boolean).length 
    : 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Brain Games</h1>
            <p className="text-muted-foreground">Take a break and challenge your mind!</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak Display */}
          {streak && streak.current_streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-800">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="flex flex-col">
                <span className="font-bold text-orange-600 dark:text-orange-400 text-lg leading-none">
                  {streak.current_streak}
                </span>
                <span className="text-xs text-orange-600/70 dark:text-orange-400/70">
                  day streak
                </span>
              </div>
              {streak.longest_streak > streak.current_streak && (
                <div className="ml-2 pl-2 border-l border-orange-300 dark:border-orange-700">
                  <span className="text-xs text-muted-foreground">Best: {streak.longest_streak}</span>
                </div>
              )}
            </div>
          )}

          {/* Daily Challenge Progress */}
          {dailyStatus && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-amber-700 dark:text-amber-300 hidden sm:inline">Daily</span>
              <div className="flex gap-1">
                {[dailyStatus.sudoku, dailyStatus.queens, dailyStatus.zip].map((completed, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      completed 
                        ? "bg-emerald-500 text-white scale-110" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {completed ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                ))}
              </div>
              <span className="text-sm text-amber-600 dark:text-amber-400">
                {completedCount}/3
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SudokuGame />
        <QueensGame />
        <ZipGame />
      </div>

      <div className="mt-6">
        <Leaderboard />
      </div>
    </div>
  );
};
