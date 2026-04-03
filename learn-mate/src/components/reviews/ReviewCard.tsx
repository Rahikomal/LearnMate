import { motion } from "framer-motion";
import { format } from "date-fns";
import { Tag } from "lucide-react";
import { StarRating } from "./StarRating";
import type { ReviewOut } from "@/lib/api";

interface ReviewCardProps {
  review: ReviewOut;
  index?: number;
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const initials = `U${review.reviewer_id}`;
  const colors = [
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-green-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  const gradient = colors[review.reviewer_id % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="glass rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">User #{review.reviewer_id}</span>
            <StarRating value={review.rating} readonly size="sm" />
          </div>

          {review.skill_tag && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium mb-2">
              <Tag className="w-3 h-3" />
              {review.skill_tag}
            </span>
          )}

          {review.comment && (
            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
          )}

          <p className="text-xs text-muted-foreground/60 mt-2">
            {format(new Date(review.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
