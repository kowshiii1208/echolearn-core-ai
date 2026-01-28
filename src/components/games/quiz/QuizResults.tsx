import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  categoryName: string;
  categoryIcon: string;
  accent: {
    bg: string;
    gradient: string;
    border: string;
  };
  onBack: () => void;
  onRestart: () => void;
}

export const QuizResults = ({ 
  score, 
  totalQuestions, 
  categoryName, 
  categoryIcon, 
  accent, 
  onBack, 
  onRestart 
}: QuizResultsProps) => {
  const percentage = (score / totalQuestions) * 100;
  
  let message = "";
  let emoji = "";
  
  if (percentage >= 80) {
    message = "Excellent! You're a pro!";
    emoji = "🎉";
  } else if (percentage >= 60) {
    message = "Good job! Keep practicing!";
    emoji = "👍";
  } else if (percentage >= 40) {
    message = "Not bad! Room for improvement.";
    emoji = "📚";
  } else {
    message = "Keep learning! You'll get better!";
    emoji = "💪";
  }

  return (
    <Card className={cn(
      "p-8 text-center max-w-lg mx-auto relative overflow-hidden border-2",
      `bg-gradient-to-br ${accent.gradient} ${accent.border}`
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl -translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-white/40 to-transparent rounded-full blur-3xl translate-x-20 translate-y-20" />
      
      <div className="relative">
        <div className="text-7xl mb-4 animate-bounce">{emoji}</div>
        
        <div className={cn(
          "w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br",
          accent.bg,
          "shadow-lg"
        )}>
          <Trophy className={cn("w-10 h-10", percentage >= 80 ? "text-yellow-300" : "text-white")} />
        </div>
        
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">{categoryIcon}</span>
          {categoryName} Quiz Complete!
        </h2>
        
        <div className={cn(
          "text-6xl font-bold my-6 bg-gradient-to-r bg-clip-text text-transparent",
          accent.bg
        )}>
          {score}/{totalQuestions}
        </div>
        
        <p className="text-lg text-muted-foreground mb-8">{message}</p>
        
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={onBack}
            className={cn("px-6 py-5", accent.border)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Button>
          <Button 
            onClick={onRestart}
            className={cn("px-6 py-5 bg-gradient-to-r text-white shadow-lg hover:shadow-xl", accent.bg)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </Card>
  );
};
