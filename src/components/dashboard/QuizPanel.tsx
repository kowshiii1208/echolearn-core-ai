import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Code, Trophy, Sparkles, GraduationCap } from "lucide-react";
import { quizCategories } from "@/components/games/quizData";
import { QuizGame } from "@/components/games/QuizGame";
import { cn } from "@/lib/utils";

const categoryStyles: Record<string, { bg: string; border: string; shadow: string; accent: string }> = {
  c: { 
    bg: "from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-950/40 dark:via-sky-950/30 dark:to-cyan-950/40",
    border: "border-blue-200 dark:border-blue-800",
    shadow: "shadow-blue-200/50 dark:shadow-blue-900/30",
    accent: "from-blue-500 via-sky-500 to-cyan-500"
  },
  cpp: { 
    bg: "from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/40 dark:via-violet-950/30 dark:to-indigo-950/40",
    border: "border-purple-200 dark:border-purple-800",
    shadow: "shadow-purple-200/50 dark:shadow-purple-900/30",
    accent: "from-purple-500 via-violet-500 to-indigo-500"
  },
  python: { 
    bg: "from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/40 dark:via-emerald-950/30 dark:to-teal-950/40",
    border: "border-green-200 dark:border-green-800",
    shadow: "shadow-green-200/50 dark:shadow-green-900/30",
    accent: "from-green-500 via-emerald-500 to-teal-500"
  },
  java: { 
    bg: "from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-yellow-950/40",
    border: "border-orange-200 dark:border-orange-800",
    shadow: "shadow-orange-200/50 dark:shadow-orange-900/30",
    accent: "from-orange-500 via-amber-500 to-yellow-500"
  },
  javascript: { 
    bg: "from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/40 dark:via-amber-950/30 dark:to-orange-950/40",
    border: "border-yellow-200 dark:border-yellow-800",
    shadow: "shadow-yellow-200/50 dark:shadow-yellow-900/30",
    accent: "from-yellow-500 via-amber-500 to-orange-500"
  },
  sql: { 
    bg: "from-cyan-50 via-teal-50 to-emerald-50 dark:from-cyan-950/40 dark:via-teal-950/30 dark:to-emerald-950/40",
    border: "border-cyan-200 dark:border-cyan-800",
    shadow: "shadow-cyan-200/50 dark:shadow-cyan-900/30",
    accent: "from-cyan-500 via-teal-500 to-emerald-500"
  },
  htmlcss: { 
    bg: "from-pink-50 via-rose-50 to-red-50 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-red-950/40",
    border: "border-pink-200 dark:border-pink-800",
    shadow: "shadow-pink-200/50 dark:shadow-pink-900/30",
    accent: "from-pink-500 via-rose-500 to-red-500"
  },
  dsa: { 
    bg: "from-indigo-50 via-blue-50 to-violet-50 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-violet-950/40",
    border: "border-indigo-200 dark:border-indigo-800",
    shadow: "shadow-indigo-200/50 dark:shadow-indigo-900/30",
    accent: "from-indigo-500 via-blue-500 to-violet-500"
  },
};

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 shadow-lg shadow-primary/20">
            <Code className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Programming Quizzes
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Test your coding knowledge with 10 random questions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">{quizCategories.length} Categories</span>
        </div>
      </div>

      {/* Quiz Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {quizCategories.map((category) => {
          const style = categoryStyles[category.id] || categoryStyles.c;
          
          return (
            <Card 
              key={category.id}
              className={cn(
                "group relative overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer border-2",
                "hover:scale-[1.02] hover:-translate-y-1",
                `bg-gradient-to-br ${style.bg} ${style.border} shadow-lg ${style.shadow}`
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/40 dark:from-white/10 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/30 dark:from-white/5 to-transparent rounded-full blur-xl transform -translate-x-6 translate-y-6" />
              
              <div className="relative p-6 flex flex-col items-center text-center">
                {/* Icon container with glow effect */}
                <div className={cn(
                  "text-5xl mb-4 p-4 rounded-2xl bg-gradient-to-br",
                  style.accent,
                  "shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                )}>
                  <span className="drop-shadow-lg filter brightness-110">{category.icon}</span>
                </div>
                
                <h3 className="font-bold text-xl mb-1 text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {category.questions.length} Questions Available
                </p>
                <p className="text-xs text-muted-foreground/70 mb-4 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  10 Random per Quiz
                </p>
                
                <Button 
                  className={cn(
                    "w-full bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-300",
                    "hover:scale-105 py-5",
                    style.accent
                  )}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
