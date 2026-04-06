import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, AlertCircle, LogOut, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/pages/Assessments";

interface QuizScreenProps {
  questions: QuizQuestion[];
  estimatedMinutes: number;
  onSubmit: (answers: { questionId: string; answer: string }[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DIFFICULTY_STYLES = {
  beginner: "bg-emerald-50 text-emerald-600 border-emerald-200",
  intermediate: "bg-amber-50  text-amber-600  border-amber-200",
  expert: "bg-rose-50   text-rose-600   border-rose-200",
};

export const QuizScreen = ({
  questions,
  estimatedMinutes,
  onSubmit,
  onCancel,
  isSubmitting,
}: QuizScreenProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(estimatedMinutes * 60);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(answers);
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const currentAns = answers.find((a) => a.questionId === currentQ?.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (option: string) => {
    setAnswers((prev) => {
      const without = prev.filter((a) => a.questionId !== currentQ.id);
      return [...without, { questionId: currentQ.id, answer: option }];
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((p) => p + 1);
    } else {
      onSubmit(answers);
    }
  };

  const isLast = currentIdx === questions.length - 1;
  const isTimeLow = timeLeft < 60;

  if (!currentQ) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto"
    >
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Question counter */}
          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
            Question{" "}
            <span className="text-slate-900">
              {currentIdx + 1}/{questions.length}
            </span>
          </span>

          {/* Right side: timer + exit */}
          <div className="flex items-center gap-4">
            <div
              className={`px-3 py-1.5 rounded-lg border font-mono font-bold flex items-center gap-1.5 text-sm transition-colors ${isTimeLow
                  ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                  : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span className="tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="rounded-full hover:bg-rose-50 hover:text-rose-600 h-8 w-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-50 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute top-0 left-0 h-full bg-primary"
          />
        </div>
      </div>

      {/* ── Question Body ─────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Topic + difficulty badges */}
            <div className="flex flex-wrap gap-2">
              {currentQ.topic && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                  {currentQ.topic}
                </span>
              )}
              {currentQ.difficulty && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[currentQ.difficulty] ??
                    "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                >
                  {currentQ.difficulty}
                </span>
              )}
            </div>

            {/* Question text */}
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
              {currentQ.text}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {currentQ.options.map((opt, i) => {
                const isSelected = currentAns?.answer === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 relative overflow-hidden group ${isSelected
                        ? "border-primary bg-primary/[0.03] shadow-sm shadow-primary/5"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                      }`}
                  >
                    {/* Letter badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shrink-0 transition-all ${isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-slate-100 text-slate-400 group-hover:border-slate-300"
                        }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span
                      className={`text-sm font-bold transition-colors ${isSelected ? "text-slate-900" : "text-slate-600"
                        }`}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Fixed Bottom Bar ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
          {/* Warning */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Backtracking disabled
            </span>
          </div>

          {/* Next / Finish */}
          <Button
            disabled={!currentAns || isSubmitting}
            onClick={handleNext}
            className="flex-1 md:flex-none rounded-xl h-12 px-10 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scoring…
              </span>
            ) : isLast ? (
              "Finish Assessment"
            ) : (
              "Save & Continue"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};