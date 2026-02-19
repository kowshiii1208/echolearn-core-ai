import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Mail, Lock, User, Sparkles, ArrowRight, GraduationCap, Brain, Zap } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password, fullName: isLogin ? undefined : fullName });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string; fullName?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: fullName },
          },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ 
              title: "Account exists", 
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive"
            });
            setIsLogin(true);
            return;
          }
          throw error;
        }
        toast({ title: "Welcome to EchoLearn!", description: "Your account has been created." });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] animate-float-delayed pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] animate-pulse-soft pointer-events-none" />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-primary/90 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(195_40%_55%/0.4)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(200_85%_8%/0.3)_0%,transparent_50%)]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Floating glass cards */}
        <div className="absolute top-[15%] right-[10%] animate-float">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl">
            <GraduationCap className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="absolute bottom-[20%] left-[10%] animate-float-delayed">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl">
            <Brain className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="absolute top-[55%] right-[25%] animate-pulse-soft">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-2xl">
            <Zap className="w-6 h-6 text-white/90" />
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-primary-foreground">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-3xl font-display font-bold">EchoLearn</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-display font-bold leading-tight mb-6">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Study Companion
            </span>
          </h1>
          
          <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
            Transform your learning experience with personalized AI tutoring, 
            smart note scanning, and adaptive study tools.
          </p>
          
          <div className="space-y-4">
            {[
              "Chat with AI for instant explanations",
              "Scan notes & textbooks with OCR",
              "Personalized learning paths",
              "Track your progress & stay motivated"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white/85 group">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-8">
            {[
              { label: "Students", value: "10K+" },
              { label: "Rating", value: "4.9★" },
              { label: "Topics", value: "500+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">EchoLearn</span>
          </div>

          {/* Glass form container */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-elevated">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isLogin 
                  ? "Sign in to continue your learning journey" 
                  : "Start your personalized learning journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground text-sm font-medium">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20 transition-all"
                    />
                  </div>
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-sm font-medium">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                variant="hero"
                size="lg"
                className="w-full h-12 rounded-xl text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? (
                  <>Don't have an account? <span className="text-primary font-semibold">Sign up</span></>
                ) : (
                  <>Already have an account? <span className="text-primary font-semibold">Sign in</span></>
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
