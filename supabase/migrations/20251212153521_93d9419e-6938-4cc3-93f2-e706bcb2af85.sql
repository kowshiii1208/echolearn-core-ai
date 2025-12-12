-- Create game scores table for tracking user performance
CREATE TABLE public.game_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  game_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  completion_time INTEGER NOT NULL,
  is_daily_challenge BOOLEAN DEFAULT false,
  challenge_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own scores" 
ON public.game_scores 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores" 
ON public.game_scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_game_scores_user_game ON public.game_scores(user_id, game_type);
CREATE INDEX idx_game_scores_daily ON public.game_scores(challenge_date, game_type) WHERE is_daily_challenge = true;