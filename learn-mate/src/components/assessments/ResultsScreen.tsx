import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Home, RotateCcw, BarChart2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillBadge } from "./SkillBadge";
import type { QuizResults } from "@/pages/Assessments";

interface ResultsScreenProps {
  skill: string;
  results: QuizResults;
  onClose: () => void;
  onRetake: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-600 border-emerald-200",
  intermediate: "bg-amber-50  text-amber-600  border-amber-200",
  expert: "bg-rose-50   text-rose-600   border-rose-200",
};

export const ResultsScreen = ({
  skill,
  results,
  onClose,
  onRetake,
}: ResultsScreenProps) => {
  const { score, correct, total, badge, topic_breakdown, explanations } = results;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-white overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto py-14 px-5 flex flex-col items-center">

        {/* ── Score Ring ──────────────────────────────────────────────────── */}
        <div className="relative w-[110px] h-[110px] mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={radius}
              className="fill-none stroke-slate-100 stroke-[10]"
            />
            <motion.circle
              cx="60" cy="60" r={radius}
              className="fill-none stroke-primary stroke-[10]"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{score}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">
              Percent
            </span>
          </div>
        </div>

        {/* ── Badge ───────────────────────────────────────────────────────── */}
        <SkillBadge
          skill={skill}
          variant={badge}
          className="mb-8 shadow-xl shadow-slate-100"
        />

        {/* ── Summary pill ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-10">
          <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 uppercase tracking-wider">
            ✓ {correct} Correct
          </span>
          <span className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-black border border-rose-200 uppercase tracking-wider">
            ✗ {total - correct} Wrong
          </span>
        </div>

        {/* ── Topic Breakdown ─────────────────────────────────────────────── */}
        {topic_breakdown && topic_breakdown.length > 0 && (
          <div className="w-full mb-10">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-primary" /> Topic Breakdown
            </h3>
            <div className="space-y-3">
              {topic_breakdown.map((t) => (
                <div key={t.topic} className="flex items-center gap-4">
                  <span className="w-32 text-xs font-bold text-slate-500 truncate shrink-0">
                    {t.topic}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${t.pct >= 75
                          ? "bg-emerald-400"
                          : t.pct >= 50
                            ? "bg-amber-400"
                            : "bg-rose-400"
                        }`}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-500 w-14 text-right">
                    {t.correct}/{t.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Per-question Review ─────────────────────────────────────────── */}
        <div className="w-full space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" /> Question Review
            </h3>
          </div>

          <div className="space-y-4">
            {explanations.map((exp, i) => (
              <div
                key={i}
                className="p-6 bg-white border border-slate-100 rounded-[1.5rem] space-y-4 shadow-sm hover:border-slate-200 hover:shadow-md transition-all"
              >
                {/* Question header */}
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${exp.correct
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}
                  >
                    {exp.correct ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    {/* Topic + difficulty badges */}
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {exp.topic && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200">
                          {exp.topic}
                        </span>
                      )}
                      {exp.difficulty && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${DIFFICULTY_COLORS[exp.difficulty] ??
                            "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                        >
                          {exp.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-slate-800 leading-tight">
                      {exp.question}
                    </p>
                  </div>
                </div>

                {/* Answer comparison */}
                <div className="flex flex-wrap gap-3 pl-11">
                  {!exp.correct && (
                    <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                      <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest pl-1">
                        Your answer
                      </span>
                      <div className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 italic">
                        {exp.userAnswer || "Unanswered"}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest pl-1">
                      Correct answer
                    </span>
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                      {exp.correctAnswer}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {exp.explanation && (
                  <div className="pl-11 pt-3 border-t border-slate-50">
                    <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                      {exp.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Action Buttons ──────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col sm:flex-row gap-4 w-full max-w-lg pb-24">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl h-12 px-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex-1"
          >
            <Home className="w-3.5 h-3.5 mr-2" /> Exit to Certs
          </Button>
          <Button
            onClick={onRetake}
            className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-primary/20 flex-1 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" /> Retake with New Questions
          </Button>
        </div>
      </div>
    </motion.div>
  );
};