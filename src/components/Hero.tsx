import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Brain } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-sage-light rounded-full blur-3xl opacity-60 animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-light rounded-full blur-3xl opacity-50 animate-float-delayed" />
      
      {/* Floating elements */}
      <div className="absolute top-32 right-[20%] animate-float">
        <div className="bg-card p-4 rounded-2xl shadow-card">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-40 left-[15%] animate-float-delayed">
        <div className="bg-card p-4 rounded-2xl shadow-card">
          <Brain className="w-8 h-8 text-accent" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-secondary-foreground">
            AI-Powered Learning Companion
          </span>
        </div>

        {/* Main heading */}
        <h1 
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          Learn Smarter with{" "}
          <span className="text-primary relative">
            EchoLearn
            <svg 
              className="absolute -bottom-2 left-0 w-full" 
              viewBox="0 0 200 12" 
              fill="none"
            >
              <path 
                d="M2 8 Q 50 2, 100 8 T 198 8" 
                stroke="hsl(var(--accent))" 
                strokeWidth="3" 
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Transform your notes into knowledge. Your AI study companion that adapts to how you learn, 
          explains concepts in your language, and keeps you motivated.
        </p>

        {/* CTA buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Link to="/auth">
            <Button variant="hero" size="xl">
              Start Learning Free
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="heroSecondary" size="xl">
              See How It Works
            </Button>
          </a>
        </div>

        {/* Trust indicators */}
        <div 
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-secondary border-2 border-background"
                />
              ))}
            </div>
            <span className="text-sm">10k+ Students</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm">4.9 Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};
