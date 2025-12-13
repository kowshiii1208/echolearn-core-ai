import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GameScore {
  id: string;
  user_id: string;
  game_type: string;
  difficulty: string;
  completion_time: number;
  is_daily_challenge: boolean;
  challenge_date: string | null;
  created_at: string;
}

interface GameStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export const useGameScores = (gameType: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scores, isLoading } = useQuery({
    queryKey: ["game-scores", gameType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("game_scores")
        .select("*")
        .eq("user_id", user.id)
        .eq("game_type", gameType)
        .order("completion_time", { ascending: true });

      if (error) throw error;
      return data as GameScore[];
    },
  });

  const { data: bestScore } = useQuery({
    queryKey: ["best-score", gameType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("game_scores")
        .select("*")
        .eq("user_id", user.id)
        .eq("game_type", gameType)
        .order("completion_time", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as GameScore | null;
    },
  });

  const saveScoreMutation = useMutation({
    mutationFn: async ({
      difficulty,
      completionTime,
      isDailyChallenge = false,
    }: {
      difficulty: string;
      completionTime: number;
      isDailyChallenge?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("game_scores")
        .insert({
          user_id: user.id,
          game_type: gameType,
          difficulty,
          completion_time: completionTime,
          is_daily_challenge: isDailyChallenge,
          challenge_date: isDailyChallenge ? today : null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update streak if daily challenge completed
      if (isDailyChallenge) {
        await updateStreak(user.id, today);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["game-scores", gameType] });
      queryClient.invalidateQueries({ queryKey: ["best-score", gameType] });
      queryClient.invalidateQueries({ queryKey: ["daily-challenge-status"] });
      queryClient.invalidateQueries({ queryKey: ["game-streak"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      
      if (bestScore && data.completion_time < bestScore.completion_time) {
        toast({
          title: "🏆 New Personal Best!",
          description: `You beat your previous record!`,
        });
      }
    },
  });

  return {
    scores,
    bestScore,
    isLoading,
    saveScore: saveScoreMutation.mutate,
  };
};

const updateStreak = async (userId: string, today: string) => {
  const { data: existingStreak } = await supabase
    .from("game_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (existingStreak) {
    // Check if already completed today
    if (existingStreak.last_completed_date === today) {
      return;
    }

    let newStreak = 1;
    if (existingStreak.last_completed_date === yesterdayStr) {
      newStreak = existingStreak.current_streak + 1;
    }

    const newLongest = Math.max(newStreak, existingStreak.longest_streak);

    await supabase
      .from("game_streaks")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_completed_date: today,
      })
      .eq("user_id", userId);
  } else {
    await supabase
      .from("game_streaks")
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_completed_date: today,
      });
  }
};

export const useDailyChallengeStatus = () => {
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["daily-challenge-status", today],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { sudoku: false, queens: false, zip: false };

      const { data, error } = await supabase
        .from("game_scores")
        .select("game_type")
        .eq("user_id", user.id)
        .eq("challenge_date", today)
        .eq("is_daily_challenge", true);

      if (error) throw error;

      const completed = {
        sudoku: data.some((s) => s.game_type === "sudoku"),
        queens: data.some((s) => s.game_type === "queens"),
        zip: data.some((s) => s.game_type === "zip"),
      };

      return completed;
    },
  });
};

export const useGameStreak = () => {
  return useQuery({
    queryKey: ["game-streak"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("game_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as GameStreak | null;
    },
  });
};

// Generate a daily seed based on today's date
export const getDailySeed = (): number => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};
