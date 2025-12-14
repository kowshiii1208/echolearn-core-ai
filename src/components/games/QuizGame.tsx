import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
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

export const QuizGame = ({ category, onBack }: QuizGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

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

  if (isFinished) {
    const percentage = (score / 10) * 100;
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
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="text-6xl mb-4">{emoji}</div>
        <Trophy className={cn(
          "w-16 h-16 mx-auto mb-4",
          percentage >= 80 ? "text-yellow-500" : percentage >= 60 ? "text-gray-400" : "text-orange-400"
        )} />
        <h2 className="text-2xl font-bold mb-2">{category.name} Quiz Complete!</h2>
        <p className="text-4xl font-bold text-primary mb-2">{score}/10</p>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <span className="font-semibold text-lg">{category.name} Quiz</span>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Score: <span className="text-primary">{score}</span>/10
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion + 1} of 10
          </span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full bg-gradient-to-r transition-all", category.color)}
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-lg font-medium mb-6">{question.question}</h3>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = index === selectedAnswer;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  !answered && "hover:border-primary hover:bg-primary/5",
                  answered && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20",
                  answered && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-900/20",
                  !answered && "border-border"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <Button onClick={handleNext} className="w-full">
            {currentQuestion < 9 ? "Next Question" : "See Results"}
          </Button>
        )}
      </Card>
    </div>
  );
};
