import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Send, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { reviewsApi } from "@/lib/api";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SKILL_TAGS = [
  "React JS", "TypeScript", "Python", "Node.js", "Tailwind CSS",
  "Azure", "AI/ML", "C#", "Java", "Go", "DevOps", "UI/UX", "Other",
];

const schema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().optional(),
  skill_tag: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface SubmitReviewModalProps {
  mentorId: number;
  mentorName?: string;
  open: boolean;
  onClose: () => void;
}

export function SubmitReviewModal({ mentorId, mentorName, open, onClose }: SubmitReviewModalProps) {
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      reviewsApi.submitReview({
        mentor_id: mentorId,
        rating: data.rating,
        comment: data.comment,
        skill_tag: selectedTag || data.skill_tag,
      }),
    onSuccess: () => {
      toast.success("Review submitted! Thank you for your feedback. 🌟");
      queryClient.invalidateQueries({ queryKey: ["reviews", mentorId] });
      queryClient.invalidateQueries({ queryKey: ["mentor-rating", mentorId] });
      reset();
      setSelectedTag(undefined);
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to submit review");
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden rounded-[2.5rem] bg-transparent">
        <div className="glass-strong rounded-[2.5rem] p-8 w-full shadow-2xl border border-white/20 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="mb-6">
            <DialogTitle className="font-display font-bold text-2xl text-foreground text-center sm:text-left">
              Leave a Review
            </DialogTitle>
            {mentorName && (
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Sharing your experience with <span className="text-primary font-bold">{mentorName}</span>
              </p>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                How would you rate it?
              </Label>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <StarRating
                  value={rating}
                  onChange={(v) => setValue("rating", v, { shouldValidate: true })}
                  size="lg"
                />
                {rating > 0 && (
                  <span className="text-xs font-bold text-muted-foreground/80 bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-xs text-destructive font-semibold">{errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Learned Skill
              </Label>
              <div className="flex flex-wrap gap-2">
                {SKILL_TAGS.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag === selectedTag ? undefined : tag)}
                    className={`text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-xl border-2 transition-all ${
                      selectedTag === tag
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                Detailed Feedback
              </Label>
              <Textarea
                {...register("comment")}
                placeholder="What did you learn? What should other students know?"
                className="rounded-2xl bg-secondary/30 min-h-[100px] resize-none border-border/50 p-4"
              />
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending || rating === 0}
              className="w-full h-14 gradient-primary text-primary-foreground rounded-2xl text-base font-black shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" /> Submit Review
                </span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
