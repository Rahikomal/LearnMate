import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer, HelpCircle, GraduationCap, Zap } from "lucide-react";
import { QUIZ_DATA } from "@/data/quizData";

interface AssessmentStartModalProps {
  open: boolean;
  onClose: () => void;
  skill: string;
  onConfirm: () => void;
  isStarting: boolean;
}

export const AssessmentStartModal = ({ open, onClose, skill, onConfirm, isStarting }: AssessmentStartModalProps) => {
  const questionCount = skill && QUIZ_DATA[skill as keyof typeof QUIZ_DATA] 
    ? QUIZ_DATA[skill as keyof typeof QUIZ_DATA].length 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-[2rem] p-8 md:p-10 bg-white border-slate-200">
        <DialogHeader className="text-left space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center border border-violet-100 mb-2">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Ready for your <span className="text-primary italic">{skill}</span> check?
          </DialogTitle>
          <DialogDescription className="text-base text-slate-500 font-medium leading-relaxed italic">
            This structured assessment validates your technical proficiency. Success earns you a verified digital badge in the LearnMate community.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-8">
           <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-2 group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 text-slate-400">
                <Timer className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Time Limit</span>
              </div>
              <p className="text-2xl font-black text-slate-900">10 Mins</p>
           </div>
           <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-2 group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 text-slate-400">
                <HelpCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Assessment</span>
              </div>
              <p className="text-2xl font-black text-slate-900">{questionCount} Qs</p>
           </div>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 items-center">
           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-amber-200 flex-shrink-0">
             <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
           </div>
           <p className="text-[11px] font-black text-amber-700 leading-tight uppercase tracking-wider">
             Once you start, the timer cannot be paused. Ensure you have a stable connection.
           </p>
        </div>

        <DialogFooter className="mt-10 sm:justify-start gap-4">
          <Button variant="ghost" onClick={onClose} className="rounded-xl h-14 px-8 font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </Button>
          <Button 
            disabled={isStarting}
            onClick={onConfirm}
            className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] h-14 px-8 font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isStarting ? "Initializing..." : "Start Assessment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

