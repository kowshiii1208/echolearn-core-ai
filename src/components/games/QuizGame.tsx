import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Sparkles, Target } from "lucide-react";
import { QuizQuestion } from "./quizData";
import { cn } from "@/lib/utils";
import { QuizProgress } from "./quiz/QuizProgress";
import { QuizQuestionCard } from "./quiz/QuizQuestion";
import { QuizResults } from "./quiz/QuizResults";
import { categoryAccents } from "./quiz/categoryAccents";

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

const TOTAL_QUESTIONS = 10;

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
    return shuffled.slice(0, TOTAL_QUESTIONS);
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
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
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
    return (
      <QuizResults
        score={score}
        totalQuestions={TOTAL_QUESTIONS}
        categoryName={category.name}
        categoryIcon={category.icon}
        accent={accent}
        onBack={onBack}
        onRestart={handleRestart}
      />
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
          <span className="text-muted-foreground">/{TOTAL_QUESTIONS}</span>
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
          <QuizProgress
            currentQuestion={currentQuestion}
            totalQuestions={TOTAL_QUESTIONS}
            accent={accent}
          />

          <QuizQuestionCard
            question={question}
            selectedAnswer={selectedAnswer}
            answered={answered}
            showResult={showResult}
            accent={accent}
            onAnswer={handleAnswer}
          />

          {/* Next Button */}
          {answered && (
            <Button 
              onClick={handleNext} 
              className={cn(
                "w-full py-6 text-lg bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mt-6",
                accent.bg
              )}
            >
              {currentQuestion < TOTAL_QUESTIONS - 1 ? (
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
