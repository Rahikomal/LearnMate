import { motion } from "framer-motion";
import { Users, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { groupsApi, type GroupOut } from "@/lib/api";
import { Link } from "react-router-dom";

interface GroupCardProps {
  group: GroupOut;
  index?: number;
}

const tagColors: Record<string, string> = {
  "React JS": "bg-sky-500/15 text-sky-400 border-sky-500/20",
  "TypeScript": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Python": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Node.js": "bg-green-500/15 text-green-400 border-green-500/20",
  "Tailwind CSS": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "AI/ML": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  "DevOps": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "UI/UX": "bg-pink-500/15 text-pink-400 border-pink-500/20",
};
const defaultTagColor = "bg-primary/10 text-primary border-primary/20";

export function GroupCard({ group, index = 0 }: GroupCardProps) {
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: () => groupsApi.joinGroup(group.id),
    onSuccess: () => {
      toast.success(`Joined "${group.name}"! 🎉`);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const tagColor = tagColors[group.skill_tag] ?? defaultTagColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="glass-premium !p-[1.25rem] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col gap-[1.25rem] group h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-[0.75rem]">
        <div className="w-[3rem] h-[3rem] rounded-[0.75rem] gradient-primary flex items-center justify-center text-white font-black text-[1.125rem] shrink-0 shadow-md">
          {group.name[0].toUpperCase()}
        </div>
        <span className={`text-[0.625rem] px-[0.75rem] py-[0.25rem] rounded-full border font-black flex items-center gap-[0.25rem] uppercase tracking-wider ${tagColor}`}>
          <Tag className="w-[0.75rem] h-[0.75rem]" />
          {group.skill_tag}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-display font-bold text-foreground text-[1.125rem] leading-tight m-0">{group.name}</h3>
        {group.description && (
          <p className="text-[0.875rem] text-muted-foreground mt-[0.5rem] line-clamp-2 leading-relaxed mb-0">
             {group.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-[1rem] border-t border-border/30">
        <div className="flex items-center gap-[0.375rem] text-muted-foreground text-[0.75rem] font-bold uppercase tracking-tight">
          <Users className="w-[1rem] h-[1rem] text-primary/60" />
          <span>{group.member_count} members</span>
        </div>
        <div className="flex items-center gap-[0.5rem]">
          <Button
            size="sm"
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending}
            className="rounded-full gradient-primary text-primary-foreground text-[0.75rem] px-[1rem] h-[2rem] font-bold hover:scale-105 transition-transform"
          >
            {joinMutation.isPending ? "Joining…" : "Join"}
          </Button>
          <Button asChild size="icon" variant="ghost" className="w-[2rem] h-[2rem] rounded-full hover:bg-primary/10 transition-colors">
            <Link to={`/groups/${group.id}`}>
              <ArrowRight className="w-[1rem] h-[1rem]" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

