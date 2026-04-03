import { format } from "date-fns";
import { 
  Calendar, Clock, Video, CheckCircle, XCircle, 
  ChevronRight, Tag, Star, Hourglass, ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sessionsApi, type SessionOut } from "@/lib/api";
import { useState, useEffect } from "react";

interface SessionCardProps {
  session: SessionOut;
  isMentor: boolean;
  onReview?: () => void;
  index?: number;
}

const statusColors = {
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  confirmed: "bg-sky-500/15 text-sky-500 border-sky-500/20",
  completed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-rose-500/15 text-rose-500 border-rose-500/20",
};

export function SessionCard({ session, isMentor, onReview, index = 0 }: SessionCardProps) {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (session.status !== "confirmed") return;
    
    const interval = setInterval(() => {
      const start = new Date(session.scheduled_at).getTime();
      const now = new Date().getTime();
      const diff = start - now;

      if (diff <= 0) {
        setTimeLeft("Started!");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.scheduled_at, session.status]);

  const confirmMutation = useMutation({
    mutationFn: () => sessionsApi.confirmSession(session.id),
    onSuccess: () => {
      toast.success("Session confirmed! Video link generated. 🎥");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const completeMutation = useMutation({
    mutationFn: () => sessionsApi.completeSession(session.id),
    onSuccess: () => {
      toast.success("Session marked as completed! 🎉");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      if (!isMentor) onReview?.(); // Prompt learner for review
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cancelMutation = useMutation({
    mutationFn: () => sessionsApi.cancelSession(session.id),
    onSuccess: () => {
      toast.success("Session cancelled.");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const date = new Date(session.scheduled_at);
  const initials = isMentor ? `L${session.learner_id}` : `M${session.mentor_id}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-premium !p-[1.25rem] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 relative group overflow-hidden border-primary/10 shadow-lg flex flex-col gap-[1.5rem]"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-[4rem] h-[4rem] bg-gradient-to-br from-primary/10 to-transparent blur-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[1rem]">
        {/* User Info / Identity */}
        <div className="flex items-center gap-[1rem]">
          <div className="w-[3rem] h-[3rem] rounded-[1rem] gradient-primary flex items-center justify-center text-white font-black text-[1.125rem] shadow-md transition-transform group-hover:scale-105 duration-500">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-[0.5rem] mb-[0.25rem]">
              <p className="font-bold text-foreground text-[1rem] m-0">{isMentor ? "Learner" : "Mentor"} #{isMentor ? session.learner_id : session.mentor_id}</p>
              <div className={`text-[0.625rem] uppercase tracking-widest font-black px-[0.5rem] py-[0.125rem] rounded-full border ${statusColors[session.status]}`}>
                {session.status}
              </div>
            </div>
            <p className="text-[0.75rem] text-muted-foreground flex items-center gap-[0.375rem] font-bold m-0 uppercase tracking-tight">
              <Tag className="w-[0.875rem] h-[0.875rem] text-primary" />
              Skill: <span className="text-primary">{session.skill_tag}</span>
            </p>
          </div>
        </div>

        {/* Date / Time */}
        <div className="flex flex-col items-start sm:items-end gap-[0.25rem] px-[1rem] py-[0.5rem] rounded-[1rem] bg-primary/5 border border-primary/10">
          <div className="text-[0.75rem] font-black text-primary flex items-center gap-[0.375rem] uppercase tracking-widest">
            <Calendar className="w-[0.875rem] h-[0.875rem]" />
            {format(date, "MMM d, yyyy")}
          </div>
          <div className="text-[0.875rem] font-bold flex items-center gap-[0.375rem] text-foreground/80 lowercase italic">
            <Clock className="w-[0.875rem] h-[0.875rem]" />
            {format(date, "h:mm a")} · {session.duration_mins}m
          </div>
        </div>
      </div>

      {/* Details & Actions */}
      <div className="space-y-[1.25rem]">
        {session.notes && (
          <div className="text-[0.75rem] text-muted-foreground bg-secondary/20 rounded-[1rem] p-[1rem] border border-border/30 italic leading-relaxed">
            "{session.notes}"
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-[0.75rem] pt-[1rem] border-t border-border/20">
          <div className="flex items-center gap-[0.5rem]">
            {session.status === "confirmed" && timeLeft && (
              <div className="flex items-center gap-[0.375rem] text-[0.625rem] font-black uppercase tracking-widest text-sky-500 px-[0.75rem] py-[0.375rem] rounded-full bg-sky-500/10 animate-pulse border border-sky-500/20">
                <Hourglass className="w-[0.875rem] h-[0.875rem]" />
                Starting: {timeLeft}
              </div>
            )}
            {session.status === "confirmed" && session.meet_link && (
              <a 
                href={session.meet_link} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-[0.375rem] text-[0.625rem] font-black uppercase tracking-widest text-emerald-500 px-[0.75rem] py-[0.375rem] rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
              >
                <Video className="w-[0.875rem] h-[0.875rem]" />
                Join Meet <ExternalLink className="w-[0.625rem] h-[0.625rem]" />
              </a>
            )}
            {session.status === "completed" && !isMentor && (
              <Button 
                onClick={onReview} 
                size="sm" 
                variant="ghost" 
                className="text-[0.625rem] text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 rounded-full h-[2rem] px-[1rem] font-black uppercase tracking-widest border border-amber-500/10"
              >
                <Star className="w-[0.875rem] h-[0.875rem] mr-[0.375rem] fill-amber-500" />
                Review
              </Button>
            )}
          </div>

          <div className="flex items-center gap-[0.5rem]">
            {/* Action Buttons */}
            {isMentor && session.status === "pending" && (
              <Button 
                onClick={() => confirmMutation.mutate()} 
                disabled={confirmMutation.isPending}
                size="sm" 
                className="rounded-full gradient-primary text-primary-foreground text-[0.75rem] px-[1rem] h-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-transform"
              >
                <CheckCircle className="w-[0.875rem] h-[0.875rem] mr-[0.375rem]" /> Confirm
              </Button>
            )}
            {session.status !== "completed" && session.status !== "cancelled" && (
              <Button 
                onClick={() => cancelMutation.mutate()} 
                disabled={cancelMutation.isPending}
                size="sm" 
                variant="outline" 
                className="rounded-full text-[0.625rem] px-[1rem] h-[2rem] border-rose-500/20 text-rose-500 hover:bg-rose-500/5 font-black uppercase tracking-widest transition-colors"
              >
                <XCircle className="w-[0.875rem] h-[0.875rem] mr-[0.375rem]" /> Cancel
              </Button>
            )}
            {session.status === "confirmed" && (
              <Button 
                onClick={() => completeMutation.mutate()} 
                disabled={completeMutation.isPending}
                size="sm" 
                className="rounded-full gradient-primary text-primary-foreground text-[0.75rem] px-[1.25rem] h-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Mark Done <ChevronRight className="w-[0.875rem] h-[0.875rem] ml-[0.375rem]" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

