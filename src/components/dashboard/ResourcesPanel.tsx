import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  RefreshCw, 
  Sparkles,
  Clock,
  BarChart3,
  DollarSign,
  Zap,
  Star,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";

interface FreeCourse {
  title: string;
  provider: string;
  url: string;
  description: string;
  topics: string[];
  duration: string;
  level: string;
}

interface PaidCourse extends FreeCourse {
  price: string;
}

interface StudyMaterial {
  title: string;
  type: string;
  url: string;
  description: string;
  topics: string[];
}

interface ResourcesData {
  freeCourses: FreeCourse[];
  paidCourses: PaidCourse[];
  studyMaterials: StudyMaterial[];
}

const CACHE_KEY = 'echomind_resources_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const getCachedResources = (): { data: ResourcesData; date: string } | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const setCachedResources = (data: ResourcesData, date: string) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, date, timestamp: Date.now() }));
};

const levelConfig = (level: string) => {
  switch (level.toLowerCase()) {
    case 'beginner': return { color: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30', icon: '🌱' };
    case 'intermediate': return { color: 'bg-amber-500/15 text-amber-700 border-amber-500/30', icon: '🔥' };
    case 'advanced': return { color: 'bg-rose-500/15 text-rose-700 border-rose-500/30', icon: '⚡' };
    default: return { color: 'bg-muted text-muted-foreground', icon: '📚' };
  }
};

const cardGradients = [
  'from-teal/5 via-transparent to-transparent',
  'from-primary/5 via-transparent to-transparent',
  'from-emerald-500/5 via-transparent to-transparent',
  'from-violet-500/5 via-transparent to-transparent',
  'from-amber-500/5 via-transparent to-transparent',
  'from-sky-500/5 via-transparent to-transparent',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const ResourcesPanel = () => {
  const [resources, setResources] = useState<ResourcesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchResources = async (force = false) => {
    if (!force) {
      const cached = getCachedResources();
      if (cached) {
        setResources(cached.data);
        setLastUpdated(cached.date);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('learning-resources', {
        body: { category: 'all' },
      });

      if (error) throw error;
      if (data?.success && data?.data) {
        setResources(data.data);
        setLastUpdated(data.date);
        setCachedResources(data.data, data.date);
        if (force) toast.success("Resources refreshed!");
      } else {
        throw new Error(data?.error || 'Failed to fetch resources');
      }
    } catch (err: any) {
      console.error('Error fetching resources:', err);
      toast.error("Failed to load resources. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-teal-dark text-primary-foreground">
              <GraduationCap className="w-6 h-6" />
            </div>
            Learning Resources
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-curated courses & study materials • Updated {lastUpdated || "today"}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchResources(true)}
            disabled={loading}
            className="gap-2 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>
      </div>

      {!resources ? (
        <Card className="p-8 text-center rounded-2xl">
          <p className="text-muted-foreground">No resources available. Click refresh to try again.</p>
        </Card>
      ) : (
        <Tabs defaultValue="free" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl bg-muted/60 p-1">
            <TabsTrigger value="free" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/10 data-[state=active]:to-teal/10 data-[state=active]:text-foreground transition-all duration-300">
              <Zap className="w-4 h-4" />
              Free Courses
            </TabsTrigger>
            <TabsTrigger value="paid" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/10 data-[state=active]:to-primary/10 data-[state=active]:text-foreground transition-all duration-300">
              <Star className="w-4 h-4" />
              Paid Courses
            </TabsTrigger>
            <TabsTrigger value="materials" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/10 data-[state=active]:to-primary/10 data-[state=active]:text-foreground transition-all duration-300">
              <FileText className="w-4 h-4" />
              Study Materials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="mt-5">
            <motion.div 
              className="grid gap-4 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key="free"
            >
              {resources.freeCourses?.map((course, i) => {
                const level = levelConfig(course.level);
                return (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className={`group relative overflow-hidden rounded-2xl border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--shadow-card)] bg-gradient-to-br ${cardGradients[i % cardGradients.length]}`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors duration-200">{course.title}</CardTitle>
                          <a href={course.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:text-primary">
                              <ArrowUpRight className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                          {course.provider}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                          <span className="mx-1">•</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${level.color} flex items-center gap-1`}>
                            {level.icon} {course.level}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {course.topics?.slice(0, 3).map((topic, j) => (
                            <Badge key={j} variant="secondary" className="text-xs rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">{topic}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>

          <TabsContent value="paid" className="mt-5">
            <motion.div 
              className="grid gap-4 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key="paid"
            >
              {resources.paidCourses?.map((course, i) => {
                const level = levelConfig(course.level);
                return (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className={`group relative overflow-hidden rounded-2xl border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--shadow-card)] bg-gradient-to-br ${cardGradients[i % cardGradients.length]}`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors duration-200">{course.title}</CardTitle>
                          <a href={course.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:text-primary">
                              <ArrowUpRight className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                          {course.provider}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                          <span className="mx-1">•</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${level.color} flex items-center gap-1`}>
                            {level.icon} {course.level}
                          </span>
                          <span className="mx-1">•</span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-amber-400/10 text-amber-700 border border-amber-500/25">
                            💰 {course.price}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {course.topics?.slice(0, 3).map((topic, j) => (
                            <Badge key={j} variant="secondary" className="text-xs rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">{topic}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>

          <TabsContent value="materials" className="mt-5">
            <motion.div 
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key="materials"
            >
              {resources.studyMaterials?.map((material, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className={`group relative overflow-hidden rounded-2xl border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--shadow-card)] bg-gradient-to-br ${cardGradients[i % cardGradients.length]}`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full pointer-events-none" />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-snug group-hover:text-primary transition-colors duration-200">{material.title}</CardTitle>
                        <a href={material.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:text-primary">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs rounded-lg border-primary/20 bg-primary/5 text-primary">{material.type}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {material.topics?.slice(0, 3).map((topic, j) => (
                          <Badge key={j} variant="secondary" className="text-xs rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">{topic}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
};
