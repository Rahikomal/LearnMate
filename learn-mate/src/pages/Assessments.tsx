import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Trophy, 
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
  Layers
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { QuizScreen } from "@/components/assessments/QuizScreen";
import { AssessmentStartModal } from "@/components/assessments/AssessmentStartModal";
import { ResultsScreen } from "@/components/assessments/ResultsScreen";
import { QUIZ_DATA } from "@/data/quizData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AVAILABLE_SKILLS = Object.keys(QUIZ_DATA);

const SKILL_THEMES: Record<string, { icon: any, color: string, bg: string }> = {
  "React JS": { icon: Brain, color: "text-blue-500", bg: "bg-blue-50" },
  "TypeScript": { icon: Code, color: "text-indigo-600", bg: "bg-indigo-50" },
  "Python": { icon: Terminal, color: "text-amber-600", bg: "bg-amber-50" },
  "Node.js": { icon: Server, color: "text-emerald-600", bg: "bg-emerald-50" },
  "AI/ML": { icon: Cpu, color: "text-violet-600", bg: "bg-violet-50" },
  "UI/UX": { icon: Palette, color: "text-rose-600", bg: "bg-rose-50" },
  "Tailwind CSS": { icon: Layers, color: "text-sky-500", bg: "bg-sky-50" },
};

const Assessments = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [assessmentState, setAssessmentState] = useState<"idle" | "modal" | "quiz" | "results">("idle");
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const startMutation = useMutation({
    mutationFn: async (skill: string) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const questions = QUIZ_DATA[skill];
      if (!questions || questions.length === 0) {
        throw new Error("No questions found for this topic.");
      }
      return {
        assessment_id: `a-${Date.now()}`,
        questions: questions
      };
    },
    onSuccess: (data) => {
      setCurrentAssessmentId(data.assessment_id);
      setAssessmentState("quiz");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to load assessment.");
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (answers: any[]) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const questions = QUIZ_DATA[selectedSkill!];
      const review = answers.map((ans, i) => {
        const question = questions[i];
        const isCorrect = ans.answer === question.correctAnswer;
        return {
          question: question.text,
          userAnswer: ans.answer,
          correctAnswer: question.correctAnswer,
          correct: isCorrect,
          explanation: isCorrect 
            ? "Excellent! You have a firm grasp of this concept." 
            : `The correct answer is "${question.correctAnswer}". Review this topic to strengthen your foundation.`
        };
      });

      const correctCount = review.filter(r => r.correct).length;
      const score = Math.round((correctCount / questions.length) * 100);
      const badge = score >= 90 ? "Expert" : score >= 75 ? "Intermediate" : "Beginner";

      return {
        score,
        badge,
        explanations: review
      };
    },
    onSuccess: (data) => {
      setResults(data);
      setAssessmentState("results");
      toast.success("Assessment submitted!");
    }
  });

  const handleStart = (skill: string) => {
    setSelectedSkill(skill);
    setAssessmentState("modal");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white selection:bg-primary/10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1 bg-violet-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/10 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" /> Skills Certification
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] m-0">
              Validate Your <span className="text-primary italic">Expertise</span>
            </h1>
            <p className="text-lg text-slate-500 mt-6 max-w-2xl font-medium leading-relaxed">
              Take our structured assessments to earn industry-ready badges and showcase your skills to the LearnMate community.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {AVAILABLE_SKILLS.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {AVAILABLE_SKILLS.map((skill, index) => {
                  const theme = SKILL_THEMES[skill] || { icon: Brain, color: "text-slate-600", bg: "bg-slate-50" };
                  const Icon = theme.icon;
                  
                  return (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      onClick={() => handleStart(skill)}
                      className="group cursor-pointer bg-white border border-slate-200 rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col h-full"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.color} flex items-center justify-center mb-6 shadow-sm border border-black/5 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{skill}</h3>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> 10 Mins</span>
                          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {QUIZ_DATA[skill].length} Qs</span>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between group-hover:text-primary transition-colors">
                        <span className="text-xs font-black uppercase tracking-widest">Begin Assessment</span>
                        <ChevronRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-slate-900">Coming Soon</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">New skill certifications are being prepared by our expert mentors.</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Refresh List
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>

        <AssessmentStartModal
          open={assessmentState === "modal"}
          onClose={() => setAssessmentState("idle")}
          skill={selectedSkill || ""}
          onConfirm={() => startMutation.mutate(selectedSkill || "")}
          isStarting={startMutation.isPending}
        />

        <AnimatePresence>
          {assessmentState === "quiz" && (
            <QuizScreen
              questions={startMutation.data?.questions || []}
              onSubmit={(answers) => submitMutation.mutate(answers)}
              onCancel={() => setAssessmentState("idle")}
              isSubmitting={submitMutation.isPending}
            />
          )}

          {assessmentState === "results" && results && (
            <ResultsScreen
              skill={selectedSkill || ""}
              results={results}
              onClose={() => setAssessmentState("idle")}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Assessments;


