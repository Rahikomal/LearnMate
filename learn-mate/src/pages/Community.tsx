import { motion } from "framer-motion";
import { Users, Layout, Globe, Users2, Star, TrendingUp, Handshake, Heart, Shield, Sparkles, MessageCircle, RefreshCcw, Timer, Trophy } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";

const communityStats = [
  { label: "Active Mentors", value: "2.4k+", icon: Users2, color: "text-blue-500" },
  { label: "Daily Sessions", value: "1.2k+", icon: TrendingUp, color: "text-purple-500" },
  { label: "Global Presence", value: "45+", icon: Globe, color: "text-pink-500" },
  { label: "Shared Projects", value: "850+", icon: Handshake, color: "text-green-500" },
];

const topFeaturedMentors = [
  { name: "Sarah J.", skill: "UX Engineering", bio: "Leading designers to push boundaries.", rating: 4.9, swaps: 142 },
  { name: "Alex K.", skill: "Rust Developer", bio: "Systems performance enthusiast.", rating: 5.0, swaps: 89 },
  { name: "Elena V.", skill: "AI Researcher", bio: "Bridging the gap between theory and code.", rating: 4.8, swaps: 215 },
  { name: "Marcus L.", skill: "Go Language", bio: "Simplifying complex backend systems.", rating: 4.9, swaps: 112 },
];

const Community = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background/50">
        {/* Hero Section */}
        <section className="pt-20 pb-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-0 right-[-100px] w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
          </div>

          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-full text-[0.75rem] font-black uppercase tracking-[0.3em] text-foreground mb-10"
            >
              <Users className="w-3.5 h-3.5 text-primary" /> The LearnMate Collective
            </motion.div>
            <h1 className="text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] font-display font-black text-foreground tracking-tight leading-[0.9] italic mb-12">
               Built for <span className="text-primary not-italic inline-block bg-clip-text bg-gradient-to-r from-primary via-[#a855f7] to-[#ec4899] selection:bg-primary/20">Minds</span> Who Never Stop
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-[48rem] mx-auto font-medium italic mb-16 leading-relaxed">
              We aren't just a platform. We are a decentralized engine of mutual growth, connecting 25,000+ elite learners globally.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-16 md:h-18 px-10 md:px-12 rounded-2xl text-lg font-black uppercase tracking-widest gradient-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group w-full sm:w-auto">
                 Join the Collective <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 md:h-18 px-10 md:px-12 rounded-2xl text-lg font-black uppercase tracking-widest border-border/50 bg-background/50 hover:bg-secondary/80 backdrop-blur-md transition-all w-full sm:w-auto">
                 Explore Groups
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="pb-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {communityStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-premium !p-8 md:!p-10 text-center flex flex-col items-center group hover:bg-primary/[0.02] transition-all"
                >
                  <div className={`p-4 rounded-2xl bg-secondary/30 group-hover:scale-110 group-hover:rotate-6 transition-all mb-6 ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-[2.5rem] md:text-[3rem] font-display font-black text-foreground mb-1 leading-none">{stat.value}</div>
                  <p className="text-[0.625rem] md:text-[0.75rem] font-black uppercase tracking-[0.25em] text-muted-foreground/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Mentors */}
        <section className="py-24 bg-secondary/5 relative overflow-hidden">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-[40rem]">
                <h2 className="font-display font-black text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] text-foreground leading-[1.1] mb-6">World-Class <span className="text-primary italic">Expertise</span></h2>
                <p className="text-muted-foreground text-lg md:text-xl font-medium italic">Meet the most active and highly rated mentors in our community. Ready to swap high-level expertise.</p>
              </div>
              <Button variant="ghost" className="text-primary font-black uppercase tracking-widest gap-2 hover:bg-primary/5">
                View All Mentors <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topFeaturedMentors.map((mentor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-premium !p-8 group hover:shadow-2xl hover:border-primary/20 transition-all duration-500 cursor-pointer text-center relative flex flex-col h-full"
                >
                   <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden mx-auto mb-6 group-hover:scale-105 group-hover:translate-y-[-10px] transition-all shadow-xl">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=mentor-${i * 999}`} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="text-xl font-display font-black italic">{mentor.name}</h3>
                   <p className="text-[0.625rem] font-black uppercase tracking-wider text-primary mb-4 p-1 px-3 bg-primary/5 rounded-full inline-block mx-auto">{mentor.skill}</p>
                   <p className="text-muted-foreground/70 text-sm leading-relaxed mb-8 flex-1 italic line-clamp-2">
                     "{mentor.bio}"
                   </p>
                   <div className="pt-6 border-t border-border/30 grid grid-cols-2">
                      <div>
                         <p className="text-lg font-black leading-none">{mentor.rating}</p>
                         <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground/60 font-black">Rating</p>
                      </div>
                      <div>
                         <p className="text-lg font-black leading-none">{mentor.swaps}</p>
                         <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground/60 font-black">Swaps</p>
                      </div>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Values */}
        <section className="py-24">
           <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
              <div className="glass-strong p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-primary/5 opacity-50 group-hover:bg-primary/10 transition-colors" />
                 <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                       <h2 className="font-display font-black text-[2.5rem] md:text-[3.5rem] mb-10 leading-tight">Our Core <span className="text-primary italic">Principles</span></h2>
                       <div className="space-y-8">
                          {[
                           { title: "Transparency First", desc: "No hidden algorithms, just pure community feedback.", icon: Shield },
                           { title: "Mutual Enrichment", desc: "Every swap must provide genuine value to both parties.", icon: Heart },
                           { title: "Lifelong Growth", desc: "We believe learning is a continuous, community-driven journey.", icon: TrendingUp }
                          ].map((p, i) => (
                             <div key={i} className="flex gap-6 items-start group/p">
                                <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover/p:scale-110 transition-all shadow-sm">
                                   <p.icon className="w-6 h-6" />
                                </div>
                                <div>
                                   <h4 className="font-display font-black italic mb-2">{p.title}</h4>
                                   <p className="text-muted-foreground text-sm italic">{p.desc}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="relative hidden md:block">
                       <div className="w-full aspect-square rounded-full border border-dashed border-primary/30 animate-spin-slow p-20">
                          <div className="w-full h-full rounded-full border border-primary/20 p-12">
                             <div className="w-full h-full rounded-full bg-primary/5 flex items-center justify-center p-8">
                                <Users className="w-full h-full text-primary/30" />
                             </div>
                          </div>
                       </div>
                       <Sparkles className="absolute top-0 right-10 w-12 h-12 text-primary animate-pulse" />
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </PageTransition>
  );
};

import { ArrowRight } from "lucide-react";

export default Community;
