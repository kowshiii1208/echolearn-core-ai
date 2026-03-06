import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GraduationCap, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  RefreshCw, 
  Sparkles,
  Clock,
  BarChart3,
  DollarSign
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
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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

const levelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'beginner': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'intermediate': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'advanced': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    default: return 'bg-muted text-muted-foreground';
  }
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary" />
            Learning Resources
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-curated courses & study materials • Updated {lastUpdated || "today"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchResources(true)}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {!resources ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No resources available. Click refresh to try again.</p>
        </Card>
      ) : (
        <Tabs defaultValue="free" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-11">
            <TabsTrigger value="free" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Free Courses
            </TabsTrigger>
            <TabsTrigger value="paid" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Paid Courses
            </TabsTrigger>
            <TabsTrigger value="materials" className="gap-2">
              <FileText className="w-4 h-4" />
              Study Materials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {resources.freeCourses?.map((course, i) => (
                <Card key={i} className="group hover:shadow-md transition-all duration-200 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.provider}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                      <span className="mx-1">•</span>
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${levelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {course.topics?.slice(0, 3).map((topic, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">{topic}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paid" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {resources.paidCourses?.map((course, i) => (
                <Card key={i} className="group hover:shadow-md transition-all duration-200 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.provider}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                      <span className="mx-1">•</span>
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${levelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <span className="mx-1">•</span>
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-medium text-foreground">{course.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {course.topics?.slice(0, 3).map((topic, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">{topic}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.studyMaterials?.map((material, i) => (
                <Card key={i} className="group hover:shadow-md transition-all duration-200 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm leading-snug">{material.title}</CardTitle>
                      <a href={material.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">{material.type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {material.topics?.slice(0, 3).map((topic, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">{topic}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
