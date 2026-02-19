import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Brain, Zap, GraduationCap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(195_35%_42%/0.12)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_85%_8%/0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(195_30%_75%/0.1)_0%,transparent_40%)]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      {/* Animated orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-accent/8 rounded-full blur-[120px] animate-float-delayed" />
      
      {/* Floating glass elements */}
      <div className="absolute top-28 right-[18%] animate-float hidden md:block">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-elevated">
          <BookOpen className="w-7 h-7 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-36 left-[12%] animate-float-delayed hidden md:block">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-elevated">
          <Brain className="w-7 h-7 text-accent" />
        </div>
      </div>
      <div className="absolute top-[40%] left-[8%] animate-pulse-soft hidden lg:block">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-3 rounded-xl shadow-card">
          <Zap className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-[30%] right-[8%] animate-float hidden lg:block">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-3 rounded-xl shadow-card">
          <GraduationCap className="w-5 h-5 text-accent" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 px-5 py-2.5 rounded-full mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            AI-Powered Learning Companion
          </span>
        </div>

        {/* Main heading */}
        <h1 
          className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          Learn Smarter with{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              EchoLearn
            </span>
            <svg 
              className="absolute -bottom-1 left-0 w-full" 
              viewBox="0 0 200 8" 
              fill="none"
            >
              <path 
                d="M2 6 Q 50 2, 100 6 T 198 4" 
                stroke="hsl(var(--primary))" 
                strokeWidth="3" 
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in"
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
            <Button variant="hero" size="xl" className="group relative overflow-hidden">
              <span className="relative z-10">Start Learning Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="heroSecondary" size="xl" className="backdrop-blur-sm">
              See How It Works
            </Button>
          </a>
        </div>

        {/* Trust indicators */}
        <div 
          className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-5 py-2.5">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-background"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">10k+ Students</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-5 py-2.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-primary fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">4.9 Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};
