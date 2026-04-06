import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Check, Clock, Star, Tag, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api";
import { BookSessionModal } from "@/components/sessions/BookSessionModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MentorCardProps {
  user: any;
  index: number;
  onConnect: (id: string, name: string) => void;
  status: any;
  className?: string;
  children?: React.ReactNode;
}

export const MentorCard = ({ user, index, onConnect, status, className, children }: MentorCardProps) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: rating, isLoading: loadingRating } = useQuery({
    queryKey: ["mentor-rating", user.id],
    queryFn: () => reviewsApi.getMentorRating(Number(user.id)),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      className={`glass-premium !p-[1.75rem] text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group relative overflow-hidden flex flex-col items-center h-full ${className || ""}`}
    >
      {/* Rating Badge */}
      <div className="absolute top-[1rem] right-[1rem] z-10">
        {loadingRating ? (
          <div className="w-[3rem] h-[1.5rem] bg-secondary/50 animate-pulse rounded-full" />
        ) : rating && rating.total_count > 0 ? (
          <div className="flex items-center gap-[0.25rem] bg-amber-400 font-bold text-[0.625rem] text-white px-[0.75rem] py-[0.25rem] rounded-full shadow-sm shadow-amber-400/20">
            <Star className="w-[0.75rem] h-[0.75rem] fill-current" />
            {rating.average_rating.toFixed(1)}
          </div>
        ) : (
          <div className="flex items-center gap-[0.25rem] bg-secondary text-muted-foreground font-black text-[0.625rem] px-[0.75rem] py-[0.25rem] rounded-full border border-border/50 shadow-sm uppercase tracking-wider">
            New
          </div>
        )}
      </div>

      <div className="relative mb-[1.25rem]">
        <div className="w-[4rem] h-[4rem] rounded-full ring-[0.25rem] ring-background shadow-xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
           <Avatar className="w-full h-full">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-black text-[1.25rem]">{user.name[0]}</AvatarFallback>
           </Avatar>
        </div>
        <div className="absolute -bottom-[0.25rem] -right-[0.25rem] w-[1.25rem] h-[1.25rem] bg-green-500 border-[0.25rem] border-background rounded-full shadow-sm" title="Online" />
      </div>

      <h3 className="font-display font-bold text-[1.125rem] text-foreground group-hover:text-primary transition-colors leading-tight mb-[0.375rem] m-0 self-center">
        {user.name}
      </h3>
      
      <div className="inline-flex items-center justify-center gap-[0.375rem] px-[0.875rem] py-[0.3rem] rounded-[0.75rem] bg-secondary/30 mb-[1.25rem] w-fit">
        <Tag className="w-[0.75rem] h-[0.75rem] text-primary" />
        <span className="text-[0.625rem] font-black uppercase tracking-[0.1em] text-muted-foreground">{user.skill}</span>
      </div>

      {children}

      <div className="flex-1 w-full">
        <p className={`text-[0.8125rem] leading-relaxed text-muted-foreground transition-all duration-300 italic mb-0 ${!isExpanded ? "line-clamp-2" : ""}`}>
           Expertise in {user.skill}. Helping developers grow their skills and progress in their careers with professional guidance.
        </p>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[0.625rem] font-black uppercase tracking-wider text-primary mt-[0.75rem] hover:underline cursor-pointer flex items-center gap-[0.25rem] mx-auto transition-all"
        >
          {isExpanded ? "Show less" : "Read more"} <ArrowRight className={`w-[0.75rem] h-[0.75rem] transition-transform ${isExpanded ? "-rotate-90" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-[0.625rem] mt-[1.5rem] w-full">
        <button
          onClick={() => onConnect(user.id, user.name)}
          disabled={status === "connected"}
          className={`flex items-center justify-center rounded-[0.875rem] text-[0.7rem] font-bold h-[2.5rem] border transition-all duration-300 ${
            status === "connected" 
              ? "bg-primary/5 border-primary/20 text-primary cursor-default" 
              : "border-border/50 hover:bg-primary/5 hover:border-primary/20 text-foreground"
          }`}
        >
          {status === "connected" ? (
             <><Check className="w-[0.75rem] h-[0.75rem] mr-[0.375rem]" /> Connected</>
          ) : status === "requested" ? (
             <><Clock className="w-[0.75rem] h-[0.75rem] mr-[0.375rem]" /> Sent</>
          ) : (
             <><UserPlus className="w-[0.75rem] h-[0.75rem] mr-[0.375rem]" /> Connect</>
          )}
        </button>
        <Button
          onClick={() => setBookingOpen(true)}
          size="sm"
          className="rounded-[0.875rem] text-[0.7rem] font-bold gradient-primary text-primary-foreground h-[2.5rem] shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all"
        >
          <Calendar className="w-[0.75rem] h-[0.75rem] mr-[0.375rem]" /> Book
        </Button>
      </div>

      <BookSessionModal 
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        mentorId={Number(user.id)}
        mentorName={user.name}
        skillTag={user.skill}
      />
    </motion.div>
  );
};
