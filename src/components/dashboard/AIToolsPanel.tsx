import { useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageScannerPanel } from "./ImageScannerPanel";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ScanLine,
  PenLine,
  Languages,
  SpellCheck,
  FileText,
  Code2,
  Bug,
  GitCompare,
  Layers,
  Brain,
  ListChecks,
  CalendarRange,
  ImagePlus,
  Mic,
  Volume2,
  Video,
  Megaphone,
  TrendingUp,
  Workflow,
  Timer,
  Search,
  Globe,
  Newspaper,
  Building2,
  Calendar,
  ArrowLeft,
  Sparkles,
  X,
} from "lucide-react";

interface AIToolsPanelProps {
  user: User;
}

type Category =
  | "all"
  | "editing"
  | "coding"
  | "study"
  | "voice"
  | "media"
  | "marketing"
  | "sales"
  | "workflows"
  | "productivity"
  | "seo"
  | "operations"
  | "meetings";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "all">;
  icon: any;
  gradient: string;
  comingSoon?: boolean;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All Tools" },
  { id: "editing", label: "Writing & Editing" },
  { id: "coding", label: "Coding" },
  { id: "study", label: "Study" },
  { id: "voice", label: "Voice & Text" },
  { id: "media", label: "Image & Video" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "workflows", label: "Workflows" },
  { id: "productivity", label: "Productivity" },
  { id: "seo", label: "SEO & Blog" },
  { id: "operations", label: "Operations" },
  { id: "meetings", label: "Meetings" },
];

const TOOLS: Tool[] = [
  // Study
  {
    id: "scan-notes",
    name: "Scan Notes",
    description: "Capture or upload notes, get OCR + AI explanation",
    category: "study",
    icon: ScanLine,
    gradient: "from-primary to-accent",
  },
  {
    id: "flashcards",
    name: "Flashcard Generator",
    description: "Turn any text into spaced-repetition flashcards",
    category: "study",
    icon: Layers,
    gradient: "from-emerald-500 to-teal-500",
    comingSoon: true,
  },
  {
    id: "quiz-from-notes",
    name: "Quiz from Notes",
    description: "Auto-create a quiz from your study material",
    category: "study",
    icon: ListChecks,
    gradient: "from-violet-500 to-purple-500",
    comingSoon: true,
  },
  {
    id: "study-plan",
    name: "Study Plan Builder",
    description: "Personalized study schedule for any goal",
    category: "study",
    icon: CalendarRange,
    gradient: "from-amber-500 to-orange-500",
    comingSoon: true,
  },

  // Editing
  {
    id: "summarize",
    name: "Summarizer",
    description: "Condense long text into clear key points",
    category: "editing",
    icon: FileText,
    gradient: "from-sky-500 to-blue-500",
    comingSoon: true,
  },
  {
    id: "rewrite",
    name: "Rewriter",
    description: "Rephrase text in different tones and styles",
    category: "editing",
    icon: PenLine,
    gradient: "from-pink-500 to-rose-500",
    comingSoon: true,
  },
  {
    id: "translate",
    name: "Translator",
    description: "Translate between 100+ languages instantly",
    category: "editing",
    icon: Languages,
    gradient: "from-indigo-500 to-violet-500",
    comingSoon: true,
  },
  {
    id: "grammar",
    name: "Grammar Fixer",
    description: "Fix grammar, spelling, and clarity issues",
    category: "editing",
    icon: SpellCheck,
    gradient: "from-emerald-500 to-green-500",
    comingSoon: true,
  },

  // Coding
  {
    id: "explain-code",
    name: "Explain Code",
    description: "Paste any snippet and get a line-by-line breakdown",
    category: "coding",
    icon: Code2,
    gradient: "from-violet-500 to-fuchsia-500",
    comingSoon: true,
  },
  {
    id: "debug-code",
    name: "Debug Code",
    description: "Find bugs and get suggested fixes",
    category: "coding",
    icon: Bug,
    gradient: "from-red-500 to-orange-500",
    comingSoon: true,
  },
  {
    id: "convert-language",
    name: "Convert Language",
    description: "Translate code between languages (Py ↔ JS ↔ Java...)",
    category: "coding",
    icon: GitCompare,
    gradient: "from-cyan-500 to-blue-500",
    comingSoon: true,
  },

  // Voice & Text
  {
    id: "speech-to-text",
    name: "Speech to Text",
    description: "Transcribe voice recordings into text",
    category: "voice",
    icon: Mic,
    gradient: "from-rose-500 to-pink-500",
    comingSoon: true,
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Generate natural-sounding voiceovers",
    category: "voice",
    icon: Volume2,
    gradient: "from-purple-500 to-indigo-500",
    comingSoon: true,
  },

  // Media
  {
    id: "text-to-image",
    name: "Text to Image",
    description: "Generate stunning images from a text prompt",
    category: "media",
    icon: ImagePlus,
    gradient: "from-fuchsia-500 to-pink-500",
    comingSoon: true,
  },
  {
    id: "text-to-video",
    name: "Text to Video",
    description: "Create short videos from descriptions",
    category: "media",
    icon: Video,
    gradient: "from-orange-500 to-red-500",
    comingSoon: true,
  },

  // Marketing
  {
    id: "ad-copy",
    name: "Ad Copy Generator",
    description: "High-converting ad copy for any platform",
    category: "marketing",
    icon: Megaphone,
    gradient: "from-amber-500 to-yellow-500",
    comingSoon: true,
  },
  {
    id: "social-posts",
    name: "Social Media Posts",
    description: "Engaging posts tailored to each network",
    category: "marketing",
    icon: TrendingUp,
    gradient: "from-sky-500 to-cyan-500",
    comingSoon: true,
  },

  // Sales
  {
    id: "cold-email",
    name: "Cold Email Writer",
    description: "Personalized outreach that gets replies",
    category: "sales",
    icon: PenLine,
    gradient: "from-blue-500 to-indigo-500",
    comingSoon: true,
  },
  {
    id: "lead-research",
    name: "Lead Research",
    description: "Quickly research prospects and companies",
    category: "sales",
    icon: Search,
    gradient: "from-teal-500 to-emerald-500",
    comingSoon: true,
  },

  // Workflows
  {
    id: "workflow-builder",
    name: "Workflow Builder",
    description: "Automate repetitive multi-step tasks",
    category: "workflows",
    icon: Workflow,
    gradient: "from-violet-500 to-purple-500",
    comingSoon: true,
  },

  // Productivity
  {
    id: "task-planner",
    name: "Task Planner",
    description: "Turn goals into prioritized to-do lists",
    category: "productivity",
    icon: ListChecks,
    gradient: "from-emerald-500 to-teal-500",
    comingSoon: true,
  },
  {
    id: "time-blocker",
    name: "Time Blocker",
    description: "Auto-schedule deep work into your calendar",
    category: "productivity",
    icon: Timer,
    gradient: "from-amber-500 to-orange-500",
    comingSoon: true,
  },

  // SEO & Blog
  {
    id: "seo-keywords",
    name: "SEO Keyword Finder",
    description: "Discover keywords with high intent",
    category: "seo",
    icon: Search,
    gradient: "from-lime-500 to-green-500",
    comingSoon: true,
  },
  {
    id: "blog-writer",
    name: "Blog Writer",
    description: "SEO-optimized long-form articles",
    category: "seo",
    icon: Newspaper,
    gradient: "from-sky-500 to-blue-500",
    comingSoon: true,
  },
  {
    id: "website-copy",
    name: "Website Copy",
    description: "Landing page copy that converts visitors",
    category: "seo",
    icon: Globe,
    gradient: "from-indigo-500 to-violet-500",
    comingSoon: true,
  },

  // Operations
  {
    id: "sop-writer",
    name: "SOP Writer",
    description: "Standard operating procedures from a few notes",
    category: "operations",
    icon: Building2,
    gradient: "from-slate-500 to-gray-600",
    comingSoon: true,
  },

  // Meetings
  {
    id: "meeting-summary",
    name: "Meeting Summarizer",
    description: "Notes, decisions, and action items from any meeting",
    category: "meetings",
    icon: Calendar,
    gradient: "from-cyan-500 to-teal-500",
    comingSoon: true,
  },
  {
    id: "meeting-agenda",
    name: "Agenda Builder",
    description: "Structured agendas in seconds",
    category: "meetings",
    icon: ListChecks,
    gradient: "from-blue-500 to-sky-500",
    comingSoon: true,
  },
];

export const AIToolsPanel = ({ user }: AIToolsPanelProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [openTool, setOpenTool] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      const catMatch = activeCategory === "all" || t.category === activeCategory;
      const q = search.trim().toLowerCase();
      const searchMatch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [activeCategory, search]);

  // Render an open tool's full panel
  if (openTool === "scan-notes") {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpenTool(null)}
          className="mb-4 gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to AI Tools
        </Button>
        <ImageScannerPanel user={user} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-accent" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">AI Tools</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          One hub for every AI tool
          <Sparkles className="w-7 h-7 text-primary" />
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse tools by category — writing, coding, study, media, marketing, and more.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          className="pl-10 pr-10 h-11 rounded-xl bg-card/80 backdrop-blur-sm border-border/50"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === "all" ? TOOLS.length : TOOLS.filter((t) => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card/60 text-foreground border-border/50 hover:border-primary/30 hover:bg-card"
              )}
            >
              {cat.label}
              <span
                className={cn(
                  "ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                  isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tools grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-1">No tools found</p>
          <p className="text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, i) => (
              <motion.button
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                onClick={() => !tool.comingSoon && setOpenTool(tool.id)}
                disabled={tool.comingSoon}
                className={cn(
                  "group relative text-left p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 transition-all duration-300",
                  tool.comingSoon
                    ? "cursor-not-allowed opacity-75"
                    : "hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.25)]"
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-md transition-transform",
                    tool.gradient,
                    !tool.comingSoon && "group-hover:scale-110"
                  )}
                >
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{tool.name}</h3>
                  {tool.comingSoon && (
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                      Soon
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
