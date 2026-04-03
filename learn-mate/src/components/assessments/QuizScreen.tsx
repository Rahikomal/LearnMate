import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Brain, AlertCircle, LogOut } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  type: "mcq" | "short";
  text: string;
  options?: string[];
  correctAnswer?: string;
}

interface QuizScreenProps {
  questions: Question[];
  onSubmit: (answers: any[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const QuizScreen = ({ questions, onSubmit, onCancel, isSubmitting }: QuizScreenProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(answers);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handleAnswer = (val: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = { questionId: currentQ.id, answer: val };
    setAnswers(newAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto"
    >
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">
              Question <span className="text-slate-900">{currentIdx + 1}/{questions.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className={`px-4 py-2 rounded-xl border font-mono font-bold flex items-center gap-2 transition-colors ${timeLeft < 60 ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
               <Timer className="w-4 h-4" />
               <span className="tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-rose-50 hover:text-rose-600 h-10 w-10">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* Full-width progress bar */}
        <div className="w-full h-1 bg-slate-50 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute top-0 left-0 h-full bg-primary"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {currentQ.text}
            </h2>

            {currentQ.type === "mcq" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                {currentQ.options?.map((opt, i) => {
                  const isSelected = answers[currentIdx]?.answer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 relative overflow-hidden group ${
                        isSelected 
                          ? "border-primary bg-primary/[0.03] shadow-sm shadow-primary/5" 
                          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 shrink-0 transition-all ${
                        isSelected 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white border-slate-100 text-slate-400 group-hover:border-slate-300"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`text-base font-bold transition-colors ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                 <Textarea 
                   placeholder="Your architectural insight goes here..." 
                   value={answers[currentIdx]?.answer || ""}
                   onChange={(e) => handleAnswer(e.target.value)}
                   className="min-h-[320px] p-8 rounded-[2rem] bg-slate-50 border-slate-100 text-lg font-medium leading-relaxed focus:ring-4 focus:ring-primary/5 transition-all border-2 resize-none"
                 />
                 <div className="flex justify-end pr-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {answers[currentIdx]?.answer?.length || 0} characters typed
                    </span>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-6">
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Backtracking disabled</span>
          </div>
          <Button 
            disabled={!answers[currentIdx] || isSubmitting}
            onClick={handleNext}
            className="flex-1 md:flex-none rounded-xl h-14 px-12 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? "Judging Answer..." : currentIdx === questions.length - 1 ? "Finish Assessment" : "Save & Continue"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

