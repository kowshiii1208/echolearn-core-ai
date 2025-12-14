import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play } from "lucide-react";
import { quizCategories } from "@/components/games/quizData";
import { QuizGame } from "@/components/games/QuizGame";
import { cn } from "@/lib/utils";

export const QuizPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState<typeof quizCategories[0] | null>(null);

  if (selectedCategory) {
    return (
      <div className="animate-fade-in">
        <QuizGame 
          category={selectedCategory} 
          onBack={() => setSelectedCategory(null)} 
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Programming Quizzes</h1>
          <p className="text-muted-foreground">Test your coding knowledge!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quizCategories.map((category) => (
          <Card 
            key={category.id}
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className={cn(
              "absolute inset-0 opacity-10 bg-gradient-to-br",
              category.color
            )} />
            <div className="relative p-6 flex flex-col items-center text-center">
              <span className="text-4xl mb-3">{category.icon}</span>
              <h3 className="font-bold text-lg mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">10 Questions</p>
              <Button 
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "w-full bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                  category.color
                )}
              >
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
