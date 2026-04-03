import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface SkillVectorTagProps {
  skill: string;
  isMatched?: boolean;
  className?: string;
}

export const SkillVectorTag = ({ skill, isMatched, className }: SkillVectorTagProps) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-[0.75rem] text-[0.8125rem] font-bold transition-all relative group",
      isMatched 
        ? "bg-primary/10 text-primary border border-primary/30 shadow-lg shadow-primary/5" 
        : "bg-secondary text-muted-foreground border border-border/50",
      className
    )}>
      {isMatched && (
        <>
          <div className="absolute inset-0 bg-primary/20 rounded-[0.75rem] blur-[0.75rem] opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles className="w-[0.875rem] h-[0.875rem] text-primary animate-pulse" />
        </>
      )}
      <span className="relative z-10">{skill}</span>
    </div>
  );
};
