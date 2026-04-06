import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  ChevronRight,
  Timer,
  BookOpen,
  AlertCircle,
  RefreshCcw,
  Code,
  Terminal,
  Server,
  Cpu,
  Palette,
  Layers,
  Wifi,
  WifiOff,
  Search,
  Zap,
  Clock,
  Award,
  Calendar,
} from "lucide-react";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import { QuizScreen } from "@/components/assessments/QuizScreen";
import { AssessmentStartModal } from "@/components/assessments/AssessmentStartModal";
import { ResultsScreen } from "@/components/assessments/ResultsScreen";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Skill catalogue ─────────────────────────────────────────────────────────
// This is the display list only. Questions come from the AI — not from a
// static file. Add / remove skills here freely; the backend handles the rest.

export interface QuizQuestion {
  id: string;
  type: "mcq";
  difficulty: "beginner" | "intermediate" | "expert";
  topic: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizPayload {
  skill: string;
  total: number;
  estimated_minutes: number;
  questions: QuizQuestion[];
}

export interface QuizResults {
  skill: string;
  score: number;
  correct: number;
  total: number;
  badge: "Beginner" | "Intermediate" | "Expert";
  topic_breakdown: { topic: string; correct: number; total: number; pct: number }[];
  explanations: {
    question: string;
    topic: string;
    difficulty: string;
    userAnswer: string;
    correctAnswer: string;
    correct: boolean;
    explanation: string;
  }[];
}

interface SavedResult {
  id: string;
  skill: string;
  score: number;
  badge: "Beginner" | "Intermediate" | "Expert";
  date: string;
  results: QuizResults;
}

const AVAILABLE_SKILLS: {
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  description: string;
}[] = [
    {
      name: "React JS",
      icon: Brain,
      color: "text-blue-500",
      bg: "bg-blue-50",
      description: "Hooks, state, rendering, ecosystem",
    },
    {
      name: "TypeScript",
      icon: Code,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      description: "Types, generics, decorators, utilities",
    },
    {
      name: "Python",
      icon: Terminal,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Syntax, OOP, stdlib, async",
    },
    {
      name: "Node.js",
      icon: Server,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Event loop, streams, modules, HTTP",
    },
    {
      name: "AI/ML",
      icon: Cpu,
      color: "text-violet-600",
      bg: "bg-violet-50",
      description: "Models, training, evaluation, ethics",
    },
    {
      name: "UI/UX",
      icon: Palette,
      color: "text-rose-600",
      bg: "bg-rose-50",
      description: "Design principles, accessibility, flows",
    },
    {
      name: "Tailwind CSS",
      icon: Layers,
      color: "text-sky-500",
      bg: "bg-sky-50",
      description: "Utilities, responsive, config, plugins",
    },
  ];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchQuiz(skill: string, count = 10): Promise<QuizPayload> {
  const res = await fetch("/api/quiz/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill, difficulty: "mixed", count }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Quiz generation failed." }));
    throw new Error(typeof err.detail === "string" ? err.detail : "Quiz generation failed.");
  }
  return res.json();
}

async function submitQuiz(
  skill: string,
  answers: { questionId: string; answer: string }[],
  questions: QuizQuestion[]
): Promise<QuizResults> {
  const res = await fetch("/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill, answers, questions }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Submission failed." }));
    throw new Error(typeof err.detail === "string" ? err.detail : "Submission failed.");
  }
  return res.json();
}

// ─── Component ────────────────────────────────────────────────────────────────

type AppState = "idle" | "modal" | "quiz" | "results";

const Assessments = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [customSkill, setCustomSkill] = useState("");
  const [appState, setAppState] = useState<AppState>("idle");
  const [quizPayload, setQuizPayload] = useState<QuizPayload | null>(null);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [history, setHistory] = useState<SavedResult[]>([]);

  // ── 0. Load history from localStorage ────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("assessment-history");
    if (saved) {
      try {
        setHistory(json_parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const json_parse = (str: string) => JSON.parse(str);

  const saveToHistory = (res: QuizResults) => {
    const newItem: SavedResult = {
      id: Math.random().toString(36).substring(7),
      skill: res.skill,
      score: res.score,
      badge: res.badge,
      date: new Date().toLocaleDateString(),
      results: res,
    };
    const updated = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updated);
    localStorage.setItem("assessment-history", JSON.stringify(updated));
  };

  // ── 1. Generate quiz from AI ─────────────────────────────────────────────
  const generateMutation = useMutation({
    mutationFn: (skill: string) => fetchQuiz(skill, 10),
    onMutate: () => {
      setBackendOnline(null); // unknown until response
    },
    onSuccess: (data) => {
      setBackendOnline(true);
      setQuizPayload(data);
      setAppState("quiz");
    },
    onError: (err: Error) => {
      setBackendOnline(false);
      toast.error("Could not load quiz", {
        description: err.message || "Make sure the backend is running on port 8000.",
      });
      setAppState("idle");
    },
  });

  // ── 2. Submit answers & score ─────────────────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: ({
      answers,
    }: {
      answers: { questionId: string; answer: string }[];
    }) => submitQuiz(selectedSkill!, answers, quizPayload!.questions),
    onSuccess: (data) => {
      setResults(data);
      setAppState("results");
      saveToHistory(data);
      toast.success("Assessment submitted!");
    },
    onError: (err: Error) => {
      toast.error("Submission failed", { description: err.message });
    },
  });

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
    setAppState("modal");
  };

  const handleConfirmStart = () => {
    if (!selectedSkill) return;
    generateMutation.mutate(selectedSkill);
  };

  const handleSubmit = (answers: { questionId: string; answer: string }[]) => {
    submitMutation.mutate({ answers });
  };

  const handleClose = () => {
    setAppState("idle");
    setQuizPayload(null);
    setResults(null);
    setSelectedSkill(null);
  };

  const selectedMeta = AVAILABLE_SKILLS.find((s) => s.name === selectedSkill);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <PageTransition>
      <div className="min-h-screen bg-white selection:bg-primary/10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center text-center mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/10 mb-5"
            >
              <Sparkles className="w-3 h-3" /> Skills Certification
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] m-0">
              Validate Your{" "}
              <span className="text-primary italic">Expertise</span>
            </h1>
            <p className="text-base text-slate-500 mt-4 max-w-xl font-medium leading-relaxed">
              Verified evaluation covering core principles, real-world edge cases, and 
              advanced architectural patterns. Showcase your skills with industry-ready matches.
            </p>            {/* Backend status pill */}
            {backendOnline !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${backendOnline
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-rose-50 text-rose-600 border-rose-200"
                  }`}
              >
                {backendOnline ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                {backendOnline ? "Assessment Engine Online" : "Backend Offline — start server on port 8000"}
              </motion.div>
            )}
          </div>

          {/* ── Custom Topic Search ─────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto mb-20 relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-500/20 to-primary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-primary/5 transition-all group-hover:border-primary/20">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-6 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Enter any technology to begin assessment..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="h-16 pl-14 pr-4 border-none bg-transparent shadow-none focus-visible:ring-0 text-lg font-bold placeholder:text-slate-300 placeholder:font-medium"
                  onKeyDown={(e) => e.key === "Enter" && customSkill.trim() && handleSkillClick(customSkill)}
                />
              </div>
              <Button
                onClick={() => handleSkillClick(customSkill)}
                disabled={!customSkill.trim()}
                className="h-16 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.25em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <Zap className="w-4 h-4 mr-2" /> Begin Assessment
              </Button>
            </div>
          </div>

          {/* ── Recent History ─────────────────────────────────────────── */}
          <AnimatePresence>
            {history.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14"
              >
                <div className="flex items-center gap-3 mb-6 px-2 opacity-60">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Your Certifications</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 nav-scroll px-2">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        setSelectedSkill(item.skill);
                        setResults(item.results);
                        setAppState("results");
                      }}
                      className="min-w-[240px] flex-shrink-0 bg-slate-50 border border-slate-100 p-5 rounded-3xl hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${item.badge === "Expert" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          item.badge === "Intermediate" ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 truncate mb-1">{item.skill}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.score}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.date}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Predefined Grid Header ───────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-10 px-2 opacity-60">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Popular Benchmarks</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* ── Skill Cards Grid ─────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AVAILABLE_SKILLS.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    onClick={() => handleSkillClick(skill.name)}
                    className="group cursor-pointer bg-white border border-slate-200 rounded-[2rem] p-6 transition-all hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col h-full"
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl ${skill.bg} ${skill.color} flex items-center justify-center mb-5 shadow-sm border border-black/5 transition-transform group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900 mb-1">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mb-3 italic">
                        {skill.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Timer className="w-3 h-3" /> ~12 Mins
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> 10 Certified Questions
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                        <Sparkles className="w-2.5 h-2.5" /> Adaptive Quiz
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 translate-x-0 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {/* Empty state (should not occur, but kept for safety) */}
          {AVAILABLE_SKILLS.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-900">Coming Soon</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                New skill certifications are being prepared.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="rounded-xl"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
          )}
        </div>

        {/* ── Modals / Overlays ─────────────────────────────────────────── */}

        {/* Start confirmation modal */}
        <AssessmentStartModal
          open={appState === "modal"}
          onClose={() => setAppState("idle")}
          skill={selectedSkill || ""}
          estimatedMinutes={quizPayload?.estimated_minutes ?? 12}
          questionCount={quizPayload?.total ?? 10}
          onConfirm={handleConfirmStart}
          isStarting={generateMutation.isPending}
        />

        {/* Quiz screen */}
        <AnimatePresence>
          {appState === "quiz" && quizPayload && (
            <QuizScreen
              questions={quizPayload.questions}
              estimatedMinutes={quizPayload.estimated_minutes}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              isSubmitting={submitMutation.isPending}
            />
          )}
        </AnimatePresence>

        {/* Results screen */}
        <AnimatePresence>
          {appState === "results" && results && (
            <ResultsScreen
              skill={selectedSkill || ""}
              results={results}
              onClose={handleClose}
              onRetake={() => {
                setResults(null);
                setQuizPayload(null);
                setAppState("modal");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Assessments;