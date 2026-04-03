import { useState } from "react";
import { MentorCard } from "../MentorCard";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { MatchExplainerDrawer } from "./MatchExplainerDrawer";
import { SkillVectorTag } from "./SkillVectorTag";
import { ChevronDown, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIMatchCardProps {
  user: any;
  index: number;
  matchData: {
    score: number;
    matched_skills: string[];
    reason?: string;
  };
  onConnect: (id: string, name: string) => void;
  status: any;
}

export const AIMatchCard = ({ user, index, matchData, onConnect, status }: AIMatchCardProps) => {
  const [showExplainer, setShowExplainer] = useState(false);
  const [isWhyExpanded, setIsWhyExpanded] = useState(false);

  return (
    <>
      <MentorCard
        user={user}
        index={index}
        onConnect={onConnect}
        status={status}
        className="border-primary/30 ring-1 ring-primary/10 shadow-lg shadow-primary/5"
      >
        <div className="absolute top-[1rem] left-[1rem] z-10">
          <MatchScoreBadge score={matchData.score} />
        </div>

        {matchData.reason && (
          <div className="w-full mb-2 px-[0.75rem] py-[0.5rem] rounded-[0.75rem] bg-primary/5 border border-primary/10">
            <p className="text-[0.6875rem] text-primary/80 font-medium italic text-center leading-snug">
              {matchData.reason}
            </p>
          </div>
        )}

        <div className="w-full mb-6">
          <button
            onClick={() => setIsWhyExpanded(!isWhyExpanded)}
            className="flex items-center justify-between w-full p-[0.75rem] rounded-[1rem] bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group/why"
          >
            <div className="flex items-center gap-[0.5rem] text-[0.75rem] font-black uppercase tracking-[0.1em] text-primary">
              <BrainCircuit className="w-4 h-4" /> Why this match?
            </div>
            <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isWhyExpanded ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isWhyExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {matchData.matched_skills.slice(0, 3).map(skill => (
                      <SkillVectorTag key={skill} skill={skill} isMatched={true} className="scale-90" />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowExplainer(true)}
                    className="text-[0.6875rem] font-bold text-primary/70 hover:text-primary transition-colors hover:underline mx-auto block"
                  >
                    View detailed analytics
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MentorCard>

      <MatchExplainerDrawer
        open={showExplainer}
        onClose={() => setShowExplainer(false)}
        mentorId={user.id}
        mentorName={user.name}
      />
    </>
  );
};