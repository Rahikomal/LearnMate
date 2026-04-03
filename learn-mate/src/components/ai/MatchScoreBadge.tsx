import { cn } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number;
  className?: string;
}

export const MatchScoreBadge = ({ score, className }: MatchScoreBadgeProps) => {
  const getColors = (s: number) => {
    if (s >= 80) return "bg-green-500/10 text-green-600 border-green-500/30 ring-green-500/20";
    if (s >= 60) return "bg-amber-500/10 text-amber-600 border-amber-500/30 ring-amber-500/20";
    return "bg-slate-400/10 text-slate-500 border-slate-400/30 ring-slate-400/20";
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.25rem] rounded-full border text-[0.75rem] font-black uppercase tracking-wider ring-4 transition-all duration-500",
      getColors(score),
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          score >= 80 ? "bg-green-400" : score >= 60 ? "bg-amber-400" : "bg-slate-400"
        )}></span>
        <span className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-slate-500"
        )}></span>
      </span>
      {score}% Match
    </div>
  );
};
