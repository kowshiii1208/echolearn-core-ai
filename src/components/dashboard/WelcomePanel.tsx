import { User } from "@supabase/supabase-js";
import { MessageSquare, ScanLine, FileText, Sparkles, ArrowRight, BookOpen, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

type ActivePanel = "welcome" | "chat" | "scanner" | "notes" | "games" | "quiz";

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
    gradient: "from-primary to-primary/70",
    bgGlow: "group-hover:shadow-[0_0_30px_hsl(195_35%_42%/0.15)]",
  },
  {
    id: "scanner" as const,
    title: "Scan Notes",
    description: "Upload photos of your notes for AI analysis",
    icon: ScanLine,
    gradient: "from-accent to-primary",
    bgGlow: "group-hover:shadow-[0_0_30px_hsl(200_85%_8%/0.15)]",
  },
  {
    id: "notes" as const,
    title: "My Notes",
    description: "Access all your saved notes and scans",
    icon: FileText,
    gradient: "from-primary/80 to-accent",
    bgGlow: "group-hover:shadow-[0_0_30px_hsl(195_35%_42%/0.12)]",
  },
  {
    id: "games" as const,
    title: "Brain Games",
    description: "Sharpen your mind with fun challenges",
    icon: Gamepad2,
    gradient: "from-accent to-accent/70",
    bgGlow: "group-hover:shadow-[0_0_30px_hsl(200_85%_8%/0.12)]",
  },
  {
    id: "quiz" as const,
    title: "Quizzes",
    description: "Test your knowledge across categories",
    icon: BookOpen,
    gradient: "from-primary to-accent",
    bgGlow: "group-hover:shadow-[0_0_30px_hsl(195_35%_42%/0.15)]",
  },
];

export const WelcomePanel = ({ user, setActivePanel }: WelcomePanelProps) => {
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome message */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-accent" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          {greeting}, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          What would you like to learn today?
        </p>
      </motion.div>

      {/* Quick actions - 2+3 grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {features.map((feature, index) => (
          <motion.button
            key={feature.id}
            onClick={() => setActivePanel(feature.id)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: "easeOut" }}
            className={`group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 ${feature.bgGlow}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              {feature.title}
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Tips section */}
      <motion.div
        className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Getting Started</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { step: "1", title: "Ask the AI Tutor", desc: "Type any question and get clear, step-by-step explanations" },
            { step: "2", title: "Scan Your Notes", desc: "Upload a photo and let AI extract and organize the content" },
            { step: "3", title: "Save & Review", desc: "All your notes are saved for easy access anytime" },
            { step: "4", title: "Learn Smarter", desc: "Ask the AI to explain concepts from your scanned notes" },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{item.step}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
