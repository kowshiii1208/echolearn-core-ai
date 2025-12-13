-- Create streaks table for tracking consecutive days
CREATE TABLE public.game_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.game_streaks ENABLE ROW LEVEL SECURITY;

-- Users can view own streaks
CREATE POLICY "Users can view own streaks" 
ON public.game_streaks 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert own streaks
CREATE POLICY "Users can insert own streaks" 
ON public.game_streaks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update own streaks
CREATE POLICY "Users can update own streaks" 
ON public.game_streaks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_game_streaks_updated_at
BEFORE UPDATE ON public.game_streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();