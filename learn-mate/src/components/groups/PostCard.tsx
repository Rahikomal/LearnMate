import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, User2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { groupsApi, type GroupPostOut } from "@/lib/api";
import { toast } from "sonner";

interface PostCardProps {
  post: GroupPostOut;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likes);

  const likeMutation = useMutation({
    mutationFn: () => groupsApi.likePost(post.id),
    onMutate: () => {
      // Optimistic update
      setLiked(true);
      setOptimisticLikes((l) => l + 1);
    },
    onSuccess: (data) => {
      setOptimisticLikes(data.likes);
      queryClient.invalidateQueries({ queryKey: ["group-posts"] });
    },
    onError: (err: Error) => {
      setLiked(false);
      setOptimisticLikes((l) => l - 1);
      toast.error(err.message);
    },
  });

  const colors = [
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-green-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  const gradient = colors[post.author_id % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="glass rounded-2xl p-4 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
        >
          <User2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm text-foreground">User #{post.author_id}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => !liked && likeMutation.mutate()}
              disabled={liked || likeMutation.isPending}
              className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1 transition-all ${
                liked
                  ? "bg-rose-500/15 text-rose-400"
                  : "bg-secondary hover:bg-rose-500/10 hover:text-rose-400 text-muted-foreground"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={liked ? "liked" : "not-liked"}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-400" : ""}`} />
                </motion.span>
              </AnimatePresence>
              <motion.span
                key={optimisticLikes}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {optimisticLikes}
              </motion.span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
