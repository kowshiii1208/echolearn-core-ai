import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Grid3X3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  game_type: string;
  difficulty: string;
  completion_time: number;
  created_at: string;
  user_name?: string;
}

const useLeaderboard = (gameType: string) => {
  return useQuery({
    queryKey: ["leaderboard", gameType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_scores")
        .select("*")
        .eq("game_type", gameType)
        .order("completion_time", { ascending: true })
        .limit(10);

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 0:
      return <Trophy className="w-5 h-5 text-amber-500" />;
    case 1:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 2:
      return <Medal className="w-5 h-5 text-amber-700" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank + 1}</span>;
  }
};

const gameConfig = {
  sudoku: {
    icon: Grid3X3,
    gradient: "from-rose-500 to-amber-500",
    bgGradient: "from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
  queens: {
    icon: Crown,
    gradient: "from-violet-500 to-pink-500",
    bgGradient: "from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
  zip: {
    icon: Zap,
    gradient: "from-emerald-500 to-cyan-500",
    bgGradient: "from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
};

const LeaderboardList = ({ gameType }: { gameType: string }) => {
  const { data: entries, isLoading } = useLeaderboard(gameType);
  const config = gameConfig[gameType as keyof typeof gameConfig];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p>No scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all",
            index === 0 && "bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-700",
            index === 1 && "bg-gradient-to-r from-gray-100/80 to-slate-100/80 dark:from-gray-800/50 dark:to-slate-800/50 border border-gray-200 dark:border-gray-700",
            index === 2 && "bg-gradient-to-r from-orange-100/80 to-amber-100/80 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-700",
            index > 2 && "bg-muted/30 hover:bg-muted/50"
          )}
        >
          <div className="flex items-center justify-center w-8">
            {getRankIcon(index)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm">
              Player {entry.user_id.slice(0, 8)}
            </p>
            <p className="text-xs text-muted-foreground">
              {entry.difficulty}
            </p>
          </div>
          <div className={cn(
            "text-right font-bold tabular-nums",
            index === 0 && "text-amber-600 dark:text-amber-400",
            index === 1 && "text-gray-600 dark:text-gray-400",
            index === 2 && "text-orange-600 dark:text-orange-400",
            index > 2 && "text-muted-foreground"
          )}>
            {formatTime(entry.completion_time)}
          </div>
        </div>
      ))}
    </div>
  );
};

export const Leaderboard = () => {
  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 border-2 border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Leaderboard
        </h2>
      </div>

      <Tabs defaultValue="sudoku" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="sudoku" className="text-xs gap-1">
            <Grid3X3 className="w-3 h-3" />
            Sudoku
          </TabsTrigger>
          <TabsTrigger value="queens" className="text-xs gap-1">
            <Crown className="w-3 h-3" />
            Queens
          </TabsTrigger>
          <TabsTrigger value="zip" className="text-xs gap-1">
            <Zap className="w-3 h-3" />
            Zip
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sudoku" className="mt-0">
          <LeaderboardList gameType="sudoku" />
        </TabsContent>
        <TabsContent value="queens" className="mt-0">
          <LeaderboardList gameType="queens" />
        </TabsContent>
        <TabsContent value="zip" className="mt-0">
          <LeaderboardList gameType="zip" />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
