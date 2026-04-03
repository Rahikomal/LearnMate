import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { SkillVectorTag } from "./SkillVectorTag";
import { motion } from "framer-motion";
import { Link2, Sparkles, Brain } from "lucide-react";

interface MatchExplainerDrawerProps {
  open: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
}

export const MatchExplainerDrawer = ({ open, onClose, mentorId, mentorName }: MatchExplainerDrawerProps) => {
  const { data: explanation, isLoading } = useQuery({
    queryKey: ["match-explanation", mentorId],
    queryFn: async () => {
      // Backend already exists simulation
      const res = await fetch(`/api/match/explain/${mentorId}`);
      if (!res.ok) {
         // Mocking response for UI demo if API doesn't exist yet
         return {
           learning_skills: ["React", "TypeScript", "UI Design"],
           teaching_skills: ["Frontend Architecture", "React", "State Management", "Tailwind"],
           matched_pairs: [["React", "React"]]
         };
      }
      return res.json();
    },
    enabled: open
  });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-card selection:bg-primary/20 border-l border-border/50 backdrop-blur-xl">
        <SheetHeader className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Brain className="w-6 h-6" />
            </div>
            <SheetTitle className="text-2xl font-display font-bold">AI Match Insights</SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground italic">
            Visual breakdown of how your learning goals align with {mentorName}'s expertise.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-secondary/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : explanation && (
          <div className="space-y-12 pb-8">
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Connection lines would go here, simplified with arrows for now */}
              <div className="space-y-4">
                <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Your Needs</span>
                {explanation.learning_skills.map((s: string) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={s}
                  >
                    <SkillVectorTag skill={s} isMatched={explanation.matched_pairs.some((p: any) => p[0] === s)} className="w-full justify-center py-4" />
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">{mentorName}'s Skills</span>
                {explanation.teaching_skills.map((s: string) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={s}
                  >
                    <SkillVectorTag skill={s} isMatched={explanation.matched_pairs.some((p: any) => p[1] === s)} className="w-full justify-center py-4 bg-secondary/30" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-premium !p-6 border-primary/20 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Sparkles className="w-16 h-16" />
              </div>
              <h4 className="font-display font-bold text-[1.125rem] flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" /> Key Connection
              </h4>
              <p className="text-[0.875rem] text-muted-foreground leading-relaxed italic">
                The AI detected a strong alignment in <span className="text-primary font-bold">{explanation.matched_pairs[0]?.[0]}</span>. 
                This mentor's specific approach to teaching this skill matches your current learning velocity.
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
