import { User } from "@supabase/supabase-js";
import { MessageSquare, ScanLine, FileText, Sparkles } from "lucide-react";

type ActivePanel = "welcome" | "chat" | "scanner" | "notes";

interface WelcomePanelProps {
  user: User;
  setActivePanel: (panel: ActivePanel) => void;
}

const features = [
  {
    id: "chat" as const,
    title: "AI Tutor",
    description: "Get instant explanations and help with any topic",
    icon: MessageSquare,
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "scanner" as const,
    title: "Scan Notes",
    description: "Upload photos of your notes for AI analysis",
    icon: ScanLine,
    gradient: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    id: "notes" as const,
    title: "My Notes",
    description: "Access all your saved notes and scans",
    icon: FileText,
    gradient: "from-secondary/40 to-secondary/10",
    iconBg: "bg-secondary",
    iconColor: "text-secondary-foreground",
  },
];

export const WelcomePanel = ({ user, setActivePanel }: WelcomePanelProps) => {
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome message */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          {greeting}, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          What would you like to learn today?
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActivePanel(feature.id)}
            className={`group relative p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-border/50 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-card`}
          >
            <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}>
              <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </button>
        ))}
      </div>

      {/* Tips section */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Getting Started</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Ask the AI Tutor</p>
              <p className="text-sm text-muted-foreground">
                Type any question and get clear, step-by-step explanations
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Scan Your Notes</p>
              <p className="text-sm text-muted-foreground">
                Upload a photo and let AI extract and organize the content
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Save & Review</p>
              <p className="text-sm text-muted-foreground">
                All your notes are saved for easy access anytime
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">4</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Learn Smarter</p>
              <p className="text-sm text-muted-foreground">
                Ask the AI to explain concepts from your scanned notes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
