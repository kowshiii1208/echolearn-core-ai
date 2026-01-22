import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Sparkles, Target, Zap } from "lucide-react";
import { QuizQuestion } from "./quizData";
import { cn } from "@/lib/utils";

interface QuizGameProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    questions: QuizQuestion[];
  };
  onBack: () => void;
}

const categoryAccents: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  c: { bg: "from-blue-500 to-cyan-500", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40" },
  cpp: { bg: "from-purple-500 to-indigo-500", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", gradient: "from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40" },
  python: { bg: "from-green-500 to-teal-500", text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-800", gradient: "from-green-50 to-teal-50 dark:from-green-950/40 dark:to-teal-950/40" },
  java: { bg: "from-orange-500 to-amber-500", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", gradient: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40" },
  javascript: { bg: "from-yellow-500 to-orange-500", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", gradient: "from-yellow-50 to-orange-50 dark:from-yellow-950/40 dark:to-orange-950/40" },
  sql: { bg: "from-cyan-500 to-teal-500", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800", gradient: "from-cyan-50 to-teal-50 dark:from-cyan-950/40 dark:to-teal-950/40" },
  htmlcss: { bg: "from-pink-500 to-rose-500", text: "text-pink-600 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800", gradient: "from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40" },
  dsa: { bg: "from-indigo-500 to-violet-500", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", gradient: "from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40" },
};

export const QuizGame = ({ category, onBack }: QuizGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const accent = categoryAccents[category.id] || categoryAccents.c;

  const randomQuestions = useMemo(() => {
    const shuffled = [...category.questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [category.questions]);

  const question = randomQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    setShowResult(true);
    
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
    setAnswered(false);
  };

  // Results Screen
  if (isFinished) {
    const percentage = (score / 10) * 100;
    let message = "";
    let emoji = "";
    let trophyColor = "";
    
    if (percentage >= 80) {
      message = "Excellent! You're a pro!";
      emoji = "🎉";
      trophyColor = "text-yellow-500";
    } else if (percentage >= 60) {
      message = "Good job! Keep practicing!";
      emoji = "👍";
      trophyColor = "text-gray-400";
    } else if (percentage >= 40) {
      message = "Not bad! Room for improvement.";
      emoji = "📚";
      trophyColor = "text-orange-400";
    } else {
      message = "Keep learning! You'll get better!";
      emoji = "💪";
      trophyColor = "text-orange-400";
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
            <span className="text-3xl">{category.icon}</span>
            {category.name} Quiz Complete!
          </h2>
          
          <div className={cn(
            "text-6xl font-bold my-6 bg-gradient-to-r bg-clip-text text-transparent",
            accent.bg
          )}>
            {score}/10
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
              onClick={handleRestart}
              className={cn("px-6 py-5 bg-gradient-to-r text-white shadow-lg hover:shadow-xl", accent.bg)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Question Screen
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="gap-2 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl bg-gradient-to-br shadow-lg",
            accent.bg
          )}>
            <span className="text-2xl drop-shadow">{category.icon}</span>
          </div>
          <span className="font-bold text-xl">{category.name} Quiz</span>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r",
          accent.gradient,
          accent.border,
          "border"
        )}>
          <Target className="w-4 h-4 text-primary" />
          <span className="font-bold text-lg">{score}</span>
          <span className="text-muted-foreground">/10</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className={cn(
        "p-6 relative overflow-hidden border-2",
        `bg-gradient-to-br ${accent.gradient} ${accent.border}`
      )}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/30 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16" />
        
        <div className="relative">
          {/* Progress Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className={cn("w-5 h-5", accent.text)} />
              <span className="font-medium">
                Question <span className={cn("font-bold", accent.text)}>{currentQuestion + 1}</span> of 10
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-40 h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className={cn(
                  "h-full bg-gradient-to-r transition-all duration-500 ease-out rounded-full",
                  accent.bg
                )}
                style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 10 }).map((_, i) => (
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

          {/* Question Text */}
          <div className="bg-background/50 backdrop-blur-sm rounded-xl p-5 mb-6 shadow-inner border border-white/20">
            <h3 className="text-lg font-semibold text-foreground leading-relaxed">
              {question.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const isSelected = index === selectedAnswer;
              const optionLetter = String.fromCharCode(65 + index);
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
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

          {/* Next Button */}
          {answered && (
            <Button 
              onClick={handleNext} 
              className={cn(
                "w-full py-6 text-lg bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
                accent.bg
              )}
            >
              {currentQuestion < 9 ? (
                <>
                  Next Question
                  <Sparkles className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  See Results
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
