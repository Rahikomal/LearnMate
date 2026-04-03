import { motion, AnimatePresence } from "framer-motion";
import { FolderHeart, ChevronRight, Sparkles, TrendingUp, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface SavedPath {
  id: string;
  title: string;
  skill_tag: string;
  completion: number;
}

interface SavedPathsProps {
  paths: SavedPath[];
  onSelect: (id: string) => void;
  activeId: string | null;
  onDelete: (id: string) => void;
}

export const SavedPaths = ({ paths, onSelect, activeId, onDelete }: SavedPathsProps) => {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-6">
      <div className="flex items-center gap-4 min-w-max px-2">
        {paths.map((path) => (
          <motion.div
            key={path.id}
            onClick={() => onSelect(path.id)}
            whileHover={{ y: -2 }}
            className={`group cursor-pointer min-w-[170px] p-4 rounded-2xl border transition-all relative flex items-center gap-4 ${
              activeId === path.id
                ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                : "bg-white border-border/50 hover:border-primary/20"
            }`}
          >
            <div className="relative flex-shrink-0">
              <CircularProgress percentage={path.completion} size={42} strokeWidth={3} />
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-primary">
                {path.completion}%
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`text-[13px] font-bold truncate transition-colors ${activeId === path.id ? "text-primary" : "text-foreground"}`}>
                {path.title}
              </h4>
              <p className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-tighter mt-0.5">
                {path.skill_tag}
              </p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(path.id);
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CircularProgress = ({ size = 24, strokeWidth = 2, percentage = 0 }: { size?: number, strokeWidth?: number, percentage: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        className="text-muted-foreground/10"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-700 ease-out"
      />
    </svg>
  );
};

