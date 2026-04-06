import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, MessageSquare, GraduationCap, Calendar, History, Sparkles, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SubmitReviewModal } from "@/components/reviews/SubmitReviewModal";
import { sessionsApi } from "@/lib/api";
import { currentUser, connections, recentChats } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/Sidebar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "sessions">("overview");
  const [sessionType, setSessionType] = useState<"upcoming" | "past">("upcoming");
  const [reviewMentorId, setReviewMentorId] = useState<number | null>(null);

  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => sessionsApi.getMySessions(),
  });

  const upcomingSessions = sessions.filter(s => s.status === "pending" || s.status === "confirmed");
  const pastSessions = sessions.filter(s => s.status === "completed" || s.status === "cancelled");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] bg-background relative selection:bg-primary/20">
        <div className="container-custom py-[1.25rem] md:py-[2rem]">
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-[1.25rem] gap-[0.875rem]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-[0.25rem]"
            >
              <div className="inline-flex items-center gap-[0.5rem] px-[0.625rem] py-[0.2rem] rounded-full bg-primary/10 text-primary text-[0.7rem] font-bold border border-primary/20 mb-[0.375rem]">
                <TrendingUp className="w-[0.7rem] h-[0.7rem]" /> Dashboard Overview
              </div>
              <h1 className="font-display font-bold text-[1.625rem] sm:text-[2rem] text-foreground tracking-tight leading-tight">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground text-[0.8125rem] sm:text-[0.9375rem] max-w-[28rem]">
                Here's what's happening with your learning journey today.
              </p>
            </motion.div>

            <div className="flex p-[0.375rem] bg-secondary/30 backdrop-blur-sm rounded-[1rem] border border-border/50 self-start">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-[0.5rem] px-[1.25rem] py-[0.625rem] rounded-[0.75rem] text-[0.875rem] font-semibold transition-all duration-300 ${
                  activeTab === "overview" 
                    ? "bg-card text-primary shadow-lg shadow-primary/5 border border-border/50" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-[1rem] h-[1rem]" /> Overview
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`flex items-center gap-[0.5rem] px-[1.25rem] py-[0.625rem] rounded-[0.75rem] text-[0.875rem] font-semibold transition-all duration-300 ${
                  activeTab === "sessions" 
                    ? "bg-card text-primary shadow-lg shadow-primary/5 border border-border/50" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="w-[1rem] h-[1rem]" /> Sessions
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col lg:flex-row gap-[2rem]"
              >
                <div className="flex-1 min-w-0 space-y-[1.5rem]">
                  <div className="grid-adaptive">
                    <motion.div variants={itemVariants} className="glass rounded-[1.5rem] p-[1.25rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-[1.5rem] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <GraduationCap className="w-[6rem] h-[6rem] rotate-12" />
                      </div>
                      <div className="flex items-center gap-[0.625rem] mb-[1.25rem]">
                        <div className="p-[0.5rem] rounded-[0.625rem] bg-primary/10 text-primary">
                          <GraduationCap className="w-[1rem] h-[1rem]" />
                        </div>
                        <h2 className="font-display font-bold text-[1.125rem] text-foreground">Your Skills</h2>
                      </div>
                      <div className="space-y-[1.5rem]">
                        <div>
                          <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Expertise (Teaching)</span>
                          <div className="flex flex-wrap gap-[0.5rem] mt-[0.75rem]">
                            {currentUser.teaching.map((s) => (
                              <span key={s} className="px-[1rem] py-[0.375rem] rounded-[0.75rem] bg-primary/5 text-primary text-[0.75rem] font-bold border border-primary/10 hover:bg-primary/10 transition-colors">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Interests (Learning)</span>
                          <div className="flex flex-wrap gap-[0.5rem] mt-[0.75rem]">
                            {currentUser.learning.map((s) => (
                              <span key={s} className="px-[1rem] py-[0.375rem] rounded-[0.75rem] bg-accent/30 text-accent-foreground text-[0.75rem] font-bold border border-primary/5 hover:bg-accent/50 transition-colors">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass rounded-[1.5rem] p-[1.25rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-[1.5rem] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <Users className="w-[6rem] h-[6rem] -rotate-12" />
                      </div>
                      <div className="flex items-center gap-[0.625rem] mb-[1.25rem]">
                        <div className="p-[0.5rem] rounded-[0.625rem] bg-primary/10 text-primary">
                          <Handshake className="w-[1rem] h-[1rem]" />
                        </div>
                        <h2 className="font-display font-bold text-[1.125rem] text-foreground">Connections</h2>
                      </div>
                      <div className="space-y-[0.75rem]">
                        {connections.slice(0, 3).map((c) => (
                          <div key={c.id} className="flex items-center justify-between p-[0.875rem] rounded-[1rem] bg-secondary/30 border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all group/item">
                            <div className="flex items-center gap-[0.75rem] min-w-0">
                              <Avatar className="h-[2.25rem] w-[2.25rem] border border-border/50 shadow-sm">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-[0.75rem]">{c.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-bold text-foreground text-[0.875rem] truncate">{c.name}</p>
                                <p className="text-[0.625rem] text-muted-foreground uppercase font-bold tracking-wider">{c.skill}</p>
                              </div>
                            </div>
                            <Button asChild size="sm" variant="ghost" className="rounded-full h-[2rem] w-[2rem] p-0 hover:bg-primary hover:text-primary-foreground group-hover/item:translate-x-[0.25rem] transition-all">
                              <Link to="/chat">
                                <ArrowRight className="w-[1rem] h-[1rem]" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="glass rounded-[2rem] p-[1.5rem] shadow-sm border-border/40">
                    <div className="flex items-center justify-between mb-[1.5rem]">
                      <div className="flex items-center gap-[0.75rem]">
                        <div className="p-[0.625rem] rounded-[0.75rem] bg-primary/10 text-primary">
                          <MessageSquare className="w-[1.25rem] h-[1.25rem]" />
                        </div>
                        <h2 className="font-display font-bold text-[1.25rem] text-foreground">Recent Conversations</h2>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full text-[0.625rem] font-bold uppercase tracking-wider h-[2rem]" asChild>
                        <Link to="/chat">View Chat</Link>
                      </Button>
                    </div>
                    <div className="grid-adaptive">
                      {recentChats.map((chat, i) => (
                        <div key={i} className="flex items-center gap-[1rem] p-[1rem] rounded-[1rem] bg-secondary/20 hover:bg-secondary/40 transition-all border border-border/20 cursor-pointer group">
                          <Avatar className="h-[3rem] w-[3rem] border-2 border-background shadow-md group-hover:scale-105 transition-transform">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.user}`} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{chat.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center mb-[0.125rem]">
                              <p className="font-bold text-[0.875rem] text-foreground">{chat.user}</p>
                              <span className="text-[0.625rem] text-muted-foreground">2m ago</span>
                            </div>
                            <p className="text-[0.75rem] text-muted-foreground truncate italic">"{chat.message}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <Sidebar>
                  <motion.div variants={itemVariants} className="bg-primary/5 rounded-[2rem] p-[1.5rem] relative overflow-hidden">
                    <div className="absolute -top-[2.5rem] -right-[2.5rem] w-[8rem] h-[8rem] bg-primary/10 rounded-full blur-[2rem]" />
                    <div className="relative z-10">
                      <h3 className="font-display font-bold text-[1.125rem] mb-[1rem] flex items-center gap-[0.5rem]">
                         <TrendingUp className="w-[1.25rem] h-[1.25rem] text-primary" /> Monthly Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-[1rem]">
                         <div className="p-[1rem] rounded-[1rem] bg-background/50 border border-border/50">
                            <p className="text-[0.625rem] font-black uppercase text-muted-foreground/70 mb-[0.25rem]">Sessions</p>
                            <p className="text-[1.5rem] font-display font-bold text-primary">12</p>
                         </div>
                         <div className="p-[1rem] rounded-[1rem] bg-background/50 border border-border/50">
                            <p className="text-[0.625rem] font-black uppercase text-muted-foreground/70 mb-[0.25rem]">Skills</p>
                            <p className="text-[1.5rem] font-display font-bold text-primary">4</p>
                         </div>
                      </div>
                      <div className="mt-[1rem] p-[1rem] rounded-[1rem] bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                         <p className="text-[0.75rem] text-primary font-semibold flex items-center gap-[0.5rem]">
                            <Sparkles className="w-[0.75rem] h-[0.75rem]" /> Knowledge Shared: 18h
                         </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="glass rounded-[2rem] p-[1.5rem] overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-[1rem]">
                        <div className="w-[5rem] h-[5rem] bg-accent/20 rounded-full blur-[1.5rem]" />
                     </div>
                     <h3 className="font-display font-bold text-[1.125rem] mb-[1rem] text-foreground">Suggested Mentors</h3>
                     <div className="space-y-[1rem]">
                        {[
                          { name: "Sarah Chen", skill: "System Design" },
                          { name: "Marcus Ro", skill: "AWS Cloud" }
                        ].map((mentor, idx) => (
                          <div key={idx} className="flex items-center gap-[0.75rem]">
                             <Avatar className="h-[2.5rem] w-[2.5rem] border border-border/50">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} />
                                <AvatarFallback className="text-[0.75rem] font-bold">{mentor.name[0]}</AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="text-[0.875rem] font-bold text-foreground leading-tight">{mentor.name}</p>
                                <p className="text-[0.625rem] text-muted-foreground font-bold uppercase tracking-wider">{mentor.skill}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                     <Button variant="outline" className="w-full rounded-[1rem] mt-[1.5rem] text-[0.75rem] h-[2.5rem] border-border/50 bg-secondary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300" asChild>
                        <Link to="/discover">Explore All Mentors</Link>
                     </Button>
                  </motion.div>
                </Sidebar>
              </motion.div>
            ) : (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-[50rem] mx-auto space-y-[2rem]"
              >
                <div className="flex gap-[0.25rem] p-[0.25rem] bg-secondary/30 backdrop-blur-sm rounded-[1rem] border border-border/50 w-fit mb-[1rem]">
                  <button
                    onClick={() => setSessionType("upcoming")}
                    className={`px-[1.5rem] py-[0.625rem] rounded-[0.75rem] text-[0.875rem] font-bold flex items-center gap-[0.5rem] transition-all ${
                      sessionType === "upcoming" 
                        ? "bg-card text-primary shadow-lg shadow-primary/5 border border-border/50" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calendar className="w-[1rem] h-[1rem]" /> Upcoming
                  </button>
                  <button
                    onClick={() => setSessionType("past")}
                    className={`px-[1.5rem] py-[0.625rem] rounded-[0.75rem] text-[0.875rem] font-bold flex items-center gap-[0.5rem] transition-all ${
                      sessionType === "past" 
                        ? "bg-card text-primary shadow-lg shadow-primary/5 border border-border/50" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <History className="w-[1rem] h-[1rem]" /> Past
                  </button>
                </div>

                <div className="space-y-[1.25rem]">
                  {loadingSessions ? (
                     <div className="glass rounded-[3rem] p-[6rem] text-center flex flex-col items-center border border-primary/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse" />
                        <div className="w-[3rem] h-[3rem] border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-[1.5rem] relative z-10" />
                        <h3 className="font-display font-medium text-[1.125rem] text-foreground mb-[0.5rem] relative z-10">Fetching sessions...</h3>
                        <p className="text-muted-foreground text-[0.875rem] relative z-10 italic">Checking your learning calendar</p>
                     </div>
                  ) : (sessionType === "upcoming" ? upcomingSessions : pastSessions).length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-[6rem] glass rounded-[3rem] border border-border/50 shadow-inner"
                    >
                      <div className="w-[5rem] h-[5rem] bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-[1.5rem] shadow-inner">
                        <Calendar className="w-[2.5rem] h-[2.5rem] text-muted-foreground/30" />
                      </div>
                      <h3 className="font-display font-bold text-[1.25rem] text-foreground mb-[0.5rem]">No {sessionType} sessions</h3>
                      <p className="text-muted-foreground max-w-[20rem] mx-auto mb-[2rem] text-[0.875rem]">
                        {sessionType === "upcoming" 
                          ? "You don't have any scheduled sessions yet. Time to learn something new!" 
                          : "You haven't completed any sessions yet."}
                      </p>
                      {sessionType === "upcoming" && (
                        <Button asChild className="rounded-[1rem] gradient-primary text-primary-foreground px-[2rem] py-[1.5rem] h-auto shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                          <Link to="/discover">Discover Mentors</Link>
                        </Button>
                      )}
                    </motion.div>
                  ) : (
                    (sessionType === "upcoming" ? upcomingSessions : pastSessions).map((session, i) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        index={i}
                        isMentor={session.mentor_id === 1}
                        onReview={() => setReviewMentorId(session.mentor_id)}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <SubmitReviewModal 
            open={reviewMentorId !== null} 
            onClose={() => setReviewMentorId(null)}
            mentorId={reviewMentorId || 0}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;

