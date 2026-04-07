import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Plus, Tag, TextQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { groupsApi } from "@/lib/api";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SKILL_TAGS = [
  "React JS", "TypeScript", "Python", "Node.js", "Tailwind CSS",
  "Azure", "Machine Learning", "C#", "Java", "Go", "DevOps", "UI/UX",
];

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  skill_tag: z.string().min(1, "Please select a skill tag"),
});

type FormData = z.infer<typeof schema>;

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedTag = watch("skill_tag");

  const mutation = useMutation({
    mutationFn: (data: FormData) => groupsApi.createGroup({
      name: data.name,
      description: data.description,
      skill_tag: data.skill_tag,
    }),
    onSuccess: () => {
      toast.success("Community Group created! 🚀");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      reset();
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-lg border-none p-0 overflow-hidden rounded-[2.5rem] bg-transparent">
        <div className="glass-strong rounded-[2.5rem] p-8 w-full shadow-2xl border border-white/20 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="mb-8">
            <DialogTitle className="font-display font-bold text-2xl text-foreground">
              Create Community Group
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Start a new space to learn and grow with others.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                <TextQuote className="w-4 h-4 text-primary" /> Group Name
              </Label>
              <Input 
                {...register("name")} 
                placeholder="e.g. React Deep Divs" 
                className="rounded-2xl h-12 bg-secondary/30 focus-visible:ring-primary/20 border-border/50 text-foreground px-4 font-medium"
              />
              {errors.name && <p className="text-xs text-destructive font-semibold">{errors.name.message}</p>}
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Skill Focus
              </Label>
              <div className="flex flex-wrap gap-2">
                {SKILL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setValue("skill_tag", tag, { shouldValidate: true })}
                    className={`text-[10px] items-center uppercase font-black tracking-wider px-3 py-1.5 rounded-xl border-2 transition-all ${
                      selectedTag === tag
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                        : "border-border/50 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {errors.skill_tag && <p className="text-xs text-destructive font-semibold">{errors.skill_tag.message}</p>}
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                Description
              </Label>
              <Textarea 
                {...register("description")} 
                placeholder="What are the goals of this group?" 
                className="rounded-2xl bg-secondary/30 min-h-[100px] resize-none border-border/50 focus-visible:ring-primary/20 p-4"
              />
            </div>

            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full h-14 gradient-primary text-primary-foreground rounded-2xl text-base font-black shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              {mutation.isPending ? "Creating..." : "Launch Group"}
              <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
