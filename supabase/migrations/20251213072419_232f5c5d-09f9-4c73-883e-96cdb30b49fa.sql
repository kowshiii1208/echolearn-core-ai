-- Drop the existing SELECT policy and create a new one that allows viewing all scores for leaderboard
DROP POLICY IF EXISTS "Users can view own scores" ON public.game_scores;

-- Allow users to view all scores (for leaderboard)
CREATE POLICY "Users can view all scores for leaderboard" 
ON public.game_scores 
FOR SELECT 
USING (true);

-- Add index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_game_scores_leaderboard ON public.game_scores(game_type, completion_time ASC);