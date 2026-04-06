import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, User, Compass, Play, BookOpen, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Milestone {
  id: string;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  mentor?: {
    name: string;
    id: string;
  };
  completed: boolean;
  subtopics: string[];
  mentor_skill_tag?: string;
  resources?: { title: string; url: string; type: string }[];
}

interface LearningPathRoadmapProps {
  milestones: Milestone[];
  onComplete: (id: string, completed: boolean) => void;
}

export const LearningPathRoadmap = ({ milestones, onComplete }: LearningPathRoadmapProps) => {
  return (
    <div className="space-y-6 py-6 w-full max-w-5xl mx-auto">
      {milestones.map((milestone, idx) => (
        <MilestoneCard
          key={milestone.id}
          milestone={milestone}
          idx={idx}
          onToggle={() => onComplete(milestone.id, !milestone.completed)}
        />
      ))}
    </div>
  );
};

const MilestoneCard = ({ milestone, idx, onToggle }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative bg-white border border-border/50 rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5 ${milestone.completed ? "opacity-70 grayscale-[0.3]" : ""}`}
    >
      <div className="flex flex-col md:flex-row min-h-[260px]">
        {/* Left Section: Information */}
        <div className="flex-1 p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl font-mono font-black text-primary/5 select-none leading-none">0{idx + 1}</span>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-foreground tracking-tight leading-tight">{milestone.title}</h3>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-secondary/50 rounded-full text-[10px] font-bold text-muted-foreground border border-border/50">
                  <Clock className="w-3 h-3 text-primary" /> {milestone.duration}
                </div>
                <Badge variant={milestone.difficulty === "Expert" ? "destructive" : milestone.difficulty === "Intermediate" ? "default" : "secondary"} className="text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {milestone.difficulty}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              <Compass className="w-3 h-3 text-primary" /> Core Subtopics
            </div>
            <div className="flex flex-wrap gap-1.5">
              {milestone.subtopics?.map((sub: string) => (
                <span key={sub} className="px-2.5 py-1 rounded-lg bg-secondary/30 border border-border/50 text-[10px] font-bold text-foreground/70 hover:border-primary/30 hover:bg-white transition-all">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {milestone.resources && milestone.resources.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                <BookOpen className="w-3 h-3 text-primary" /> Recommended Resources
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {milestone.resources.map((res: any, rIdx: number) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-3 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-white transition-all group/res"
                  >
                    <span className="text-xs font-bold text-foreground line-clamp-1 group-hover/res:text-primary transition-colors">{res.title}</span>
                    <span className="text-[9px] font-mono font-black uppercase text-primary/40 mt-0.5">{res.type}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-10 px-5 border-border/50 hover:border-primary/40 hover:bg-primary/5 group"
              onClick={() => window.open(`/discover?skill=${encodeURIComponent(milestone.mentor_skill_tag || milestone.title)}`, "_blank")}
            >
              <User className="w-4 h-4 text-primary mr-2 transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold">Connect with {milestone.mentor?.name || "Expert"}</span>
            </Button>
          </div>
        </div>

        {/* Right Section: Status Panel */}
        <div className="w-full md:w-56 bg-secondary/20 border-l border-border/30 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-5 relative z-10">
            <div className="flex flex-col items-center text-center space-y-3">
              {milestone.completed ? (
                <div className="px-4 py-1.5 rounded-full bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-200">
                  MASTERED
                </div>
              ) : (
                <div className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-200">
                  IN PROGRESS
                </div>
              )}

              <div className="w-full space-y-2">
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-border/30 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: milestone.completed ? "100%" : "0%" }}
                    className={`h-full ${milestone.completed ? "bg-green-500" : "bg-amber-400"}`}
                  />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground italic">
                  {milestone.completed ? "Excellent work!" : "0% completion reached"}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-center text-muted-foreground/60 font-medium leading-relaxed">
              {milestone.completed
                ? "You've successfully covered all subtopics for this milestone."
                : "Complete all resources and subtopics to master this stage."}
            </p>
          </div>

          <div className="mt-6 relative z-10 w-full space-y-3">
            <Button
              onClick={onToggle}
              className={`w-full h-10 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${milestone.completed
                  ? "bg-white border-2 border-primary/20 text-primary hover:bg-primary/5"
                  : "bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1"
                }`}
            >
              {milestone.completed ? "Revoke Mastery" : "Complete Now"}
            </Button>
          </div>

          {/* Decorative Background Element */}
          <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${milestone.completed ? "bg-green-400" : "bg-primary/40"}`} />
        </div>
      </div>

      {/* Completed State Animation Strip */}
      <AnimatePresence>
        {milestone.completed && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-0 left-0 right-0 h-10 bg-green-500/10 border-t border-green-500/20 flex items-center justify-center pointer-events-none"
          >
            <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] flex items-center gap-2">
              <Check className="w-3.5 h-3.5" /> Stage Mastered
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform origin-left transition-transform duration-700" style={{ transform: `scaleX(${milestone.completed ? 1 : 0})` }} />
    </motion.div>
  );
};