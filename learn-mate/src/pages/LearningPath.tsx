import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Send, History, Compass, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { PathProgressBar } from "@/components/paths/PathProgressBar";
import { LearningPathRoadmap } from "@/components/paths/LearningPathRoadmap";
import { SavedPaths } from "@/components/paths/SavedPaths";
import { toast } from "sonner";

const LearningPath = () => {
  const queryClient = useQueryClient();
  const [goal, setGoal] = useState("");
  const [activePathId, setActivePathId] = useState<string | null>(null);

  const { data: paths = [], isLoading: loadingPaths } = useQuery({
    queryKey: ["my-paths"],
    queryFn: async () => {
      const res = await fetch("/api/learning-path/my-paths");
      if (!res.ok) {
        // Mock data for UI demo
        return [
          { id: "1", title: "Master React Architecture", skill_tag: "React", completion: 40 },
          { id: "2", title: "Python Data Science Foundations", skill_tag: "Data Science", completion: 15 }
        ];
      }
      const data = await res.json();
      return data.map((path: any) => {
        const total = path.milestones?.length || 0;
        const completed = path.milestones?.filter((m: any) => m.completed).length || 0;
        return {
          ...path,
          completion: total > 0 ? Math.round((completed / total) * 100) : 0,
          skill_tag: path.milestones?.[0]?.mentor_skill_tag || "Dev"
        };
      });
    }
  });

  const currentPath = paths.find((p: any) => p.id === activePathId) || (activePathId === "1" || activePathId === "2" ? {
    id: activePathId,
    title: activePathId === "1" ? "Master React Architecture" : "Python Data Science Foundations",
    milestones: [
      { id: "m1", title: "Context API & State Design", duration: "4h", difficulty: "Intermediate" as const, completed: true, subtopics: ["Redux vs Context", "State Machines", "Zustand"], mentor: { name: "Sarah Connor", id: "sc1" } },
      { id: "m2", title: "Advanced Hooks & Custom Patterns", duration: "6h", difficulty: "Expert" as const, completed: true, subtopics: ["useMemo Optimization", "Factory Hooks", "Concurrency"], mentor: { name: "John Doe", id: "jd1" } },
      { id: "m3", title: "Full-Stack React Integration", duration: "8h", difficulty: "Expert" as const, completed: false, subtopics: ["Tanstack Query", "Server Actions", "Next.js 14"], mentor: { name: "Kyle Simpson", id: "ks1" } },
      { id: "m4", title: "Performance & Monitoring", duration: "3h", difficulty: "Intermediate" as const, completed: false, subtopics: ["Chrome DevTools", "Core Web Vitals", "Unit Testing"], mentor: null }
    ]
  } : null);

  // We don't really need the useQuery for currentPath if we have it in 'paths'
  // But let's keep it simple and just use the finding logic above.
  const loadingCurrent = false; // It's derived now

  const generateMutation = useMutation({
    mutationFn: async (goal: string) => {
      const res = await fetch("/api/learning-path/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal })
      });

      if (!res.ok) {
        const err = await res.json();
        throw err; // throw the full error body so onError receives it
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Learning path generated!");
      setActivePathId(data.id);
      queryClient.invalidateQueries({ queryKey: ["my-paths"] });
    },
    onError: (error: any) => {
      const detail = error?.detail;

      if (detail?.type === "suggestion") {
        // Typo case — show confirm toast with action buttons
        toast(`Did you mean "${detail.suggested_topic}"?`, {
          description: detail.message,
          duration: 10000,
          action: {
            label: `Yes, use "${detail.suggested_topic}"`,
            onClick: () => generateMutation.mutate(detail.suggested_topic)
          },
          cancel: {
            label: "Cancel",
            onClick: () => toast.dismiss()
          }
        });
      } else if (detail?.type === "unrelated") {
        // Completely off-topic
        toast.error("Not a tech topic", {
          description: detail.message,
          duration: 6000
        });
      } else {
        // Generic fallback
        toast.error("Failed to generate path. Please try again.");
      }
    }
  });

  const completeMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string, completed: boolean }) => {
      await fetch(`/api/learning-path/milestone/${id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-paths"] });
      toast.success("Milestone tracked!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/learning-path/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["my-paths"] });
      if (activePathId === deletedId) {
        setActivePathId(null);
      }
      toast.success("Path removed from library");
    }
  });

  const completedCount = currentPath?.milestones.filter((m: any) => m.completed).length || 0;
  const totalCount = currentPath?.milestones.length || 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative selection:bg-primary/20">
        {/* Progress Tape */}
        <AnimatePresence>
          {activePathId && currentPath && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <PathProgressBar milestones={currentPath.milestones} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container-custom py-10 md:py-14 space-y-12">
          {/* Saved Paths horizontal row */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Saved pathways</span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <SavedPaths
              paths={paths}
              onSelect={setActivePathId}
              activeId={activePathId}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </section>

          {/* Main Dashboard */}
          <div className="space-y-12">
            {/* Hero Generator Strip */}
            <div className="bg-gradient-to-br from-violet-50/50 to-white backdrop-blur-xl border border-primary/20 p-7 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
                <Brain className="w-36 h-36" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
                    <Sparkles className="w-3 h-3" /> AI Engine
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
                    Generate Your <span className="text-primary italic">Roadmap</span>
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium max-w-md">
                    Our AI architects a personalized path through our mentor community based on your dreams.
                  </p>
                </div>

                <div className="flex-1 w-full relative">
                  <Input
                    placeholder="What's your growth goal?"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="h-14 pl-6 pr-[10rem] rounded-2xl bg-white/80 border-border/50 text-base font-bold shadow-xl focus:ring-4 focus:ring-primary/20 transition-all group-hover:border-primary/40"
                  />
                  <Button
                    onClick={() => generateMutation.mutate(goal)}
                    disabled={!goal || generateMutation.isPending}
                    className="absolute right-2 top-2 bottom-2 rounded-xl px-5 bg-primary text-white font-black text-[11px] uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all"
                  >
                    {generateMutation.isPending ? "Generating..." : <><Send className="w-3.5 h-3.5" /> Start Path</>}
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Roadmap Flow */}
            <AnimatePresence mode="wait">
              {loadingCurrent ? (
                <div className="space-y-8 max-w-5xl mx-auto">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-secondary/20 animate-pulse rounded-[2.5rem]" />
                  ))}
                </div>
              ) : currentPath ? (
                <motion.div
                  key={currentPath.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="flex items-center gap-6 px-4">
                    <div className="w-12 h-12 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                        {currentPath.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active Pathways</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                      </div>
                    </div>
                  </div>

                  <LearningPathRoadmap
                    milestones={currentPath.milestones}
                    onComplete={(id, completed) => completeMutation.mutate({ id, completed })}
                  />
                </motion.div>
              ) : (
                <div className="text-center py-16 bg-secondary/5 rounded-[2.5rem] border-2 border-dashed border-border/50">
                  <Compass className="w-14 h-14 mx-auto text-primary/10 mb-5" />
                  <h3 className="text-lg font-bold text-muted-foreground">Select or generate a path to begin</h3>
                  <p className="text-muted-foreground/60 italic mt-2 text-sm">Your educational future starts with a single goal.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default LearningPath;
