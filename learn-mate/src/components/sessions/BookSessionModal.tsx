import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Calendar, Clock, Notebook, Tag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sessionsApi } from "@/lib/api";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const schema = z.object({
  scheduled_at: z.string().min(1, "Please select a date and time"),
  duration_mins: z.enum(["30", "60", "90"]).transform(v => parseInt(v)),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BookSessionModalProps {
  mentorId: number;
  mentorName?: string;
  skillTag: string;
  open: boolean;
  onClose: () => void;
}

export function BookSessionModal({ mentorId, mentorName, skillTag, open, onClose }: BookSessionModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration_mins: 60 as any }
  });

  const duration = watch("duration_mins");

  const mutation = useMutation({
    mutationFn: (data: FormData) => sessionsApi.bookSession({
      mentor_id: mentorId,
      skill_tag: skillTag,
      scheduled_at: new Date(data.scheduled_at).toISOString(),
      duration_mins: data.duration_mins,
      notes: data.notes,
    }),
    onSuccess: () => {
      toast.success("Session booked! Waiting for mentor confirmation. 📅");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      reset();
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden rounded-[2.5rem] bg-transparent">
        <div className="glass-strong rounded-[2.5rem] p-8 w-full shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <DialogHeader className="mb-8">
            <DialogTitle className="font-display font-bold text-2xl text-foreground">
              Book Learning Session
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-primary font-bold">{mentorName}</span> 
              <span className="w-1 h-1 rounded-full bg-border" /> 
              <Tag className="w-3.5 h-3.5" /> {skillTag}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                When should we meet?
              </Label>
              <Input 
                type="datetime-local" 
                {...register("scheduled_at")}
                className="rounded-2xl h-12 bg-secondary/30 focus-visible:ring-primary/20 border-border/50 text-foreground px-4"
              />
              {errors.scheduled_at && <p className="text-xs text-destructive font-semibold">{errors.scheduled_at.message}</p>}
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                How long for?
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[30, 60, 90].map((mins) => (
                  <label key={mins} className="relative group cursor-pointer">
                    <input 
                      type="radio" 
                      value={mins} 
                      {...register("duration_mins")} 
                      className="sr-only" 
                    />
                    <div className={`text-center py-3.5 px-1 rounded-2xl border-2 text-sm font-bold transition-all ${
                      Number(duration) === mins 
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                        : "border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50 group-active:scale-95"
                    }`}>
                      {mins}m
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                <Notebook className="w-4 h-4 text-primary" />
                Optional Notes
              </Label>
              <Textarea 
                {...register("notes")}
                placeholder="Tell the mentor what helps you learn best..." 
                className="rounded-2xl bg-secondary/30 min-h-[120px] resize-none border-border/50 focus-visible:ring-primary/20 p-4"
              />
            </div>

            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full h-14 gradient-primary text-primary-foreground rounded-2xl text-base font-black shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              Confirm Booking
              <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
