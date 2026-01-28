import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  accent: {
    bg: string;
    text: string;
  };
}

export const QuizProgress = ({ currentQuestion, totalQuestions, accent }: QuizProgressProps) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Progress Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={cn("w-5 h-5", accent.text)} />
          <span className="font-medium">
            Question <span className={cn("font-bold", accent.text)}>{currentQuestion + 1}</span> of {totalQuestions}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-40 h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className={cn(
              "h-full bg-gradient-to-r transition-all duration-500 ease-out rounded-full",
              accent.bg
            )}
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Progress Dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              i < currentQuestion 
                ? `bg-gradient-to-r ${accent.bg}` 
                : i === currentQuestion 
                  ? `bg-gradient-to-r ${accent.bg} ring-2 ring-offset-2 ring-primary/50 scale-125`
                  : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};
