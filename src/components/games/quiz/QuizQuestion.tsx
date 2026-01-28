import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion as QuizQuestionType } from "../quizData";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  answered: boolean;
  showResult: boolean;
  accent: {
    bg: string;
  };
  onAnswer: (index: number) => void;
}

export const QuizQuestionCard = ({ 
  question, 
  selectedAnswer, 
  answered, 
  showResult, 
  accent, 
  onAnswer 
}: QuizQuestionProps) => {
  return (
    <div>
      {/* Question Text */}
      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-5 mb-6 shadow-inner border border-white/20">
        <h3 className="text-lg font-semibold text-foreground leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const isSelected = index === selectedAnswer;
          const optionLetter = String.fromCharCode(65 + index);
          
          return (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              disabled={answered}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4 group",
                "bg-background/60 backdrop-blur-sm hover:shadow-lg",
                !answered && "hover:border-primary hover:bg-primary/5 hover:scale-[1.01]",
                answered && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30",
                answered && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-lg shadow-red-200/50 dark:shadow-red-900/30",
                !answered && "border-border hover:border-primary"
              )}
            >
              {/* Option Letter */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all shrink-0",
                answered && isCorrect 
                  ? "bg-emerald-500 text-white" 
                  : answered && isSelected && !isCorrect 
                    ? "bg-red-500 text-white"
                    : `bg-gradient-to-br ${accent.bg} text-white shadow-md group-hover:scale-110`
              )}>
                {answered && isCorrect ? <CheckCircle className="w-5 h-5" /> 
                  : answered && isSelected && !isCorrect ? <XCircle className="w-5 h-5" />
                  : optionLetter}
              </div>
              
              {/* Option Text */}
              <span className="flex-1 font-medium">{option}</span>
              
              {/* Result Icon */}
              {showResult && isCorrect && !isSelected && (
                <CheckCircle className="w-6 h-6 text-emerald-500 animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
