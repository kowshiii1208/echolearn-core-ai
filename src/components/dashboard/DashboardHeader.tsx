import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, LogOut, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

interface DashboardHeaderProps {
  user: User;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DashboardHeader = ({ user, sidebarOpen, setSidebarOpen }: DashboardHeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out", description: "See you next time!" });
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";

  return (
    <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-foreground hidden sm:block">EchoLearn</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-xl hover:bg-primary/10"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="hidden md:flex items-center gap-2.5 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-3 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-foreground font-medium">{displayName}</span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 rounded-xl hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};
