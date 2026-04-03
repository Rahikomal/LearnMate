import { Check } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface PathProgressBarProps {
  milestones: Milestone[];
}

export const PathProgressBar = ({ milestones }: PathProgressBarProps) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="sticky top-[5rem] z-40 w-full bg-white/80 backdrop-blur-xl border-b border-border/50 py-8 shadow-sm">
      <div className="container-custom">
        <div className="flex items-start justify-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {milestones.map((milestone, idx) => {
            const isCompleted = milestone.completed;
            const isNext = !isCompleted && (idx === 0 || milestones[idx - 1].completed);
            
            return (
              <div key={milestone.id} className="flex items-start">
                <div className="flex flex-col items-center group relative">
                  {/* Node */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 ${
                    isCompleted 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : isNext 
                        ? "bg-white border-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                        : "bg-gray-100 border-gray-200 text-gray-400"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                    
                    {/* Pulsing dot for active */}
                    {isNext && (
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>

                  {/* Label */}
                  <span className="mt-3 text-[9px] font-mono font-bold uppercase tracking-tighter text-center max-w-[72px] line-clamp-2 leading-tight text-muted-foreground group-hover:text-primary transition-colors">
                    {milestone.title.length > 12 ? `${milestone.title.substring(0, 12)}...` : milestone.title}
                  </span>
                </div>

                {/* Connector Line */}
                {idx < milestones.length - 1 && (
                  <div className="w-12 h-[2px] mt-4 mx-1">
                    <div className={`h-full transition-all duration-1000 ${
                      milestones[idx + 1].completed ? "bg-primary" : "bg-gray-100"
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

