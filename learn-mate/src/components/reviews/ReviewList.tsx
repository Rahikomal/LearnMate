import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./ReviewCard";
import { reviewsApi } from "@/lib/api";

interface ReviewListProps {
  mentorId: number;
  pageSize?: number;
}

export function ReviewList({ mentorId, pageSize = 5 }: ReviewListProps) {
  const [page, setPage] = useState(1);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", mentorId],
    queryFn: () => reviewsApi.getMentorReviews(mentorId),
    enabled: !!mentorId,
  });

  const { data: rating } = useQuery({
    queryKey: ["mentor-rating", mentorId],
    queryFn: () => reviewsApi.getMentorRating(mentorId),
    enabled: !!mentorId,
  });

  const totalPages = Math.ceil(reviews.length / pageSize);
  const paginated = reviews.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-2xl h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      {rating && rating.total_count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">{rating.average_rating.toFixed(1)}</div>
            <div className="flex justify-center mt-1">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= Math.round(rating.average_rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{rating.total_count} reviews</div>
          </div>
          <div className="flex-1 space-y-1">
            {[5,4,3,2,1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = rating.total_count > 0 ? (count / rating.total_count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-muted-foreground">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full bg-amber-400"
                    />
                  </div>
                  <span className="w-5 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full w-8 h-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full w-8 h-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
