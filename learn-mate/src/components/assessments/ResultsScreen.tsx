import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillBadge } from "./SkillBadge";

interface ResultsScreenProps {
  skill: string;
  results: {
    score: number;
    badge: "Beginner" | "Intermediate" | "Expert";
    explanations: any[];
  };
  onClose: () => void;
}

export const ResultsScreen = ({ skill, results, onClose }: ResultsScreenProps) => {
  const scorePercentage = results.score;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scorePercentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-white overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto py-20 px-6 flex flex-col items-center">
        {/* Score Ring */}
        <div className="relative w-[140px] h-[140px] mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="fill-none stroke-slate-100 stroke-[10]"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              className="fill-none stroke-primary stroke-[10] transition-all"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900">{results.score}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">Percent</span>
          </div>
        </div>

        <SkillBadge skill={skill} variant={results.badge} className="mb-16 transform scale-110 shadow-xl shadow-slate-100" />

        <div className="w-full space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary" /> Question Review
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {results.explanations.filter(e => e.correct).length} / {results.explanations.length} Correct
            </span>
          </div>

          <div className="space-y-4">
            {results.explanations.map((exp: any, i: number) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] space-y-6 shadow-sm hover:border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start gap-5">
                   <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${exp.correct ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                      {exp.correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                   </div>
                   <div className="space-y-2">
                     <p className="text-lg font-bold text-slate-800 leading-tight">
                       {exp.question}
                     </p>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4 pl-[3.25rem]">
                   {!exp.correct && (
                     <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest pl-1">Your answer</span>
                        <div className="px-4 py-2 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100 italic">
                          {exp.userAnswer || "Unanswered"}
                        </div>
                     </div>
                   )}
                   <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest pl-1">Correct answer</span>
                      <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100">
                        {exp.correctAnswer}
                      </div>
                   </div>
                </div>

                <div className="pl-[3.25rem] pt-6 border-t border-slate-50">
                  <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                    {exp.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row gap-6 w-full max-w-lg pb-32">
          <Button variant="ghost" onClick={onClose} className="rounded-2xl h-16 px-10 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex-1">
            <Home className="w-4 h-4 mr-2" /> Exit to Certs
          </Button>
          <Button onClick={() => window.location.reload()} className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-primary/20 flex-1 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Test
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

