import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Wrench,
  FileText, 
  Home,
  X,
  Gamepad2,
  BookOpen,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActivePanel = "welcome" | "chat" | "tools" | "notes" | "games" | "quiz" | "resources";

interface DashboardSidebarProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { id: "welcome" as const, label: "Home", icon: Home },
  { id: "chat" as const, label: "EchoMind", icon: Brain },
  { id: "tools" as const, label: "AI Tools", icon: Wrench },
  { id: "notes" as const, label: "My Notes", icon: FileText },
  { id: "games" as const, label: "Brain Games", icon: Gamepad2 },
  { id: "quiz" as const, label: "Quizzes", icon: BookOpen },
  { id: "resources" as const, label: "Resources", icon: GraduationCap },
];

export const DashboardSidebar = ({ 
  activePanel, 
  setActivePanel, 
  isOpen, 
  setIsOpen 
}: DashboardSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activePanel === item.id ? "secondary" : "ghost"}
                className={cn(
                  "group w-full justify-start gap-3 h-11 rounded-xl font-medium transition-all duration-200",
                  activePanel === item.id 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm hover:bg-primary/15" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => {
                  setActivePanel(item.id);
                  setIsOpen(false);
                }}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  activePanel !== item.id && "group-hover:scale-125 group-hover:rotate-[-8deg]"
                )} />
                <span className={cn(
                  "transition-transform duration-200",
                  activePanel !== item.id && "group-hover:translate-x-0.5"
                )}>
                  {item.label}
                </span>
              </Button>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-3">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Pro Tip</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use EchoMind to explain concepts from your scanned notes!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
