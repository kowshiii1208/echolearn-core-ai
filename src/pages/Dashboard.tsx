import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { AIChatPanel } from "@/components/dashboard/AIChatPanel";
import { ImageScannerPanel } from "@/components/dashboard/ImageScannerPanel";
import { NotesPanel } from "@/components/dashboard/NotesPanel";
import { WelcomePanel } from "@/components/dashboard/WelcomePanel";
import { GamesPanel } from "@/components/dashboard/GamesPanel";
import { QuizPanel } from "@/components/dashboard/QuizPanel";

type ActivePanel = "welcome" | "chat" | "scanner" | "notes" | "games" | "quiz";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<ActivePanel>("welcome");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        activePanel={activePanel} 
        setActivePanel={setActivePanel}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader 
          user={user} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {activePanel === "welcome" && (
            <WelcomePanel user={user} setActivePanel={setActivePanel} />
          )}
          {activePanel === "chat" && <AIChatPanel user={user} />}
          {activePanel === "scanner" && <ImageScannerPanel user={user} />}
          {activePanel === "notes" && <NotesPanel user={user} />}
          {activePanel === "games" && <GamesPanel />}
          {activePanel === "quiz" && <QuizPanel />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
