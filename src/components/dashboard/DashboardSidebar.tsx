import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  ScanLine, 
  FileText, 
  Home,
  X,
  Gamepad2
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActivePanel = "welcome" | "chat" | "scanner" | "notes" | "games";

interface DashboardSidebarProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { id: "welcome" as const, label: "Home", icon: Home },
  { id: "chat" as const, label: "AI Tutor", icon: MessageSquare },
  { id: "scanner" as const, label: "Scan Notes", icon: ScanLine },
  { id: "notes" as const, label: "My Notes", icon: FileText },
  { id: "games" as const, label: "Brain Games", icon: Gamepad2 },
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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activePanel === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  activePanel === item.id && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
                onClick={() => {
                  setActivePanel(item.id);
                  setIsOpen(false);
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
              <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
              <p className="text-xs text-muted-foreground">
                Use the AI Tutor to explain concepts from your scanned notes!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
