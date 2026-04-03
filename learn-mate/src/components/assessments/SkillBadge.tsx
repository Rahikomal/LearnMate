import { cn } from "@/lib/utils";
import { Award, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface SkillBadgeProps {
  skill: string;
  variant: "Beginner" | "Intermediate" | "Expert";
  className?: string;
}

export const SkillBadge = ({ skill, variant, className }: SkillBadgeProps) => {
  const configs = {
    Beginner: { color: "bg-slate-400/10 text-slate-500 border-slate-400/30", icon: ShieldCheck, label: "Beginner" },
    Intermediate: { color: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: Zap, label: "Intermediate" },
    Expert: { color: "bg-purple-600/10 text-purple-600 border-purple-600/30", icon: Award, label: "Expert" }
  };

  const config = configs[variant];

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "relative flex flex-col items-center gap-4 p-8 rounded-[2rem] border transition-all glass-premium text-center min-w-[12rem] overflow-hidden group",
        config.color,
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:rotate-12 transition-transform">
        <config.icon className="w-20 h-20" />
      </div>

      <div className={cn(
        "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-xl border-4 border-background",
        variant === "Expert" ? "gradient-orange" : variant === "Intermediate" ? "bg-amber-500" : "bg-slate-400"
      )}>
        <config.icon className="w-8 h-8 text-white" />
      </div>
      
      <div className="space-y-1 relative z-10">
        <h4 className="text-[1rem] font-display font-black text-foreground m-0">{skill}</h4>
        <span className="text-[0.625rem] font-black uppercase tracking-[0.2em]">{config.label} Verified</span>
      </div>

      <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden mt-2">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: "100%" }}
           className={cn(
             "h-full rounded-full",
             variant === "Expert" ? "bg-purple-600" : variant === "Intermediate" ? "bg-amber-500" : "bg-slate-400"
           )}
         />
      </div>
    </motion.div>
  );
};
