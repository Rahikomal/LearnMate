import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer, HelpCircle, GraduationCap, Zap, Sparkles } from "lucide-react";

interface AssessmentStartModalProps {
  open: boolean;
  onClose: () => void;
  skill: string;
  /** Passed from parent after engine responds (or default 12 while loading) */
  estimatedMinutes?: number;
  /** Passed from parent after engine responds (or default 10 while loading) */
  questionCount?: number;
  onConfirm: () => void;
  isStarting: boolean;
}

export const AssessmentStartModal = ({
  open,
  onClose,
  skill,
  estimatedMinutes = 12,
  questionCount = 10,
  onConfirm,
  isStarting,
}: AssessmentStartModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[1.5rem] p-6 md:p-8 bg-white border-slate-200">
        <DialogHeader className="text-left space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100 mb-1.5">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Ready for your{" "}
            <span className="text-primary italic">{skill}</span> check?
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium leading-relaxed italic">
            A comprehensive evaluation based on official documentation and best practices. 
            Pass to earn a verified digital badge in the LearnMate community.
          </DialogDescription>
        </DialogHeader>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="p-4 rounded-[1.25rem] bg-slate-50 border border-slate-100 space-y-1.5 group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Timer className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                Est. Time
              </span>
            </div>
            <p className="text-xl font-black text-slate-900">
              {estimatedMinutes} mins
            </p>
          </div>
          <div className="p-4 rounded-[1.25rem] bg-slate-50 border border-slate-100 space-y-1.5 group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-1.5 text-slate-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                Questions
              </span>
            </div>
            <p className="text-xl font-black text-slate-900">
              {questionCount} Qs
            </p>
          </div>
        </div>

        {/* Quality notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-primary/5 border border-primary/15 flex gap-3 items-center">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-primary/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[11px] font-black text-primary/80 leading-tight uppercase tracking-wider">
            Verified assessment covering core principles, real-world usage, and advanced architectural patterns.
          </p>
        </div>

        {/* Warning */}
        <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 items-center">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-amber-200 flex-shrink-0">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </div>
          <p className="text-[11px] font-black text-amber-700 leading-tight uppercase tracking-wider">
            Once you start, the timer cannot be paused. Ensure you have a stable
            connection.
          </p>
        </div>

        <DialogFooter className="mt-8 sm:justify-start gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isStarting}
            className="rounded-xl h-12 px-6 font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            disabled={isStarting}
            onClick={onConfirm}
            className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-[1rem] h-12 px-6 font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Technical Check…
              </span>
            ) : (
              "Start Assessment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};