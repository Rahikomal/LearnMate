import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Sparkles, 
  TrendingUp, 
  Handshake, 
  Shield, 
  Zap, 
  Globe, 
  ChevronRight, 
  RefreshCcw, 
  Timer, 
  Trophy 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { QUIZ_DATA } from "@/data/quizData";

const features = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with experts from around the world without physical boundaries.",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: Handshake,
    title: "Mutual Growth",
    description: "A pure peer-to-peer exchange where knowledge is the only currency.",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    icon: Shield,
    title: "Verified Skills",
    description: "Our assessment system ensures you learn from proven experts.",
    color: "bg-pink-500/10 text-pink-500"
  },
];

const Index = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  }

  const featuredSkills = Object.keys(QUIZ_DATA).slice(0, 4);

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-x-hidden w-full bg-background/50">
        {/* Modern Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-full pointer-events-none -z-10">
          <div className="relative w-full h-full">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" />
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="relative w-full pt-16 md:pt-24 lg:pt-32 pb-20 overflow-hidden">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/80 backdrop-blur-xl text-foreground text-[0.625rem] md:text-[0.75rem] font-black uppercase tracking-[0.3em] border border-border/50 mb-10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-white/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" /> The Future of Learning is Peer-to-Peer
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display font-black text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] xl:text-[9rem] tracking-tight text-foreground w-full leading-[0.9] mb-12"
            >
              Master <span className="italic">Any</span> <br className="hidden md:block" />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#a855f7] to-[#ec4899] selection:bg-primary/20 py-4">
                 Skill. For Free.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground/80 w-full max-w-[50rem] mx-auto mb-16 leading-relaxed font-medium italic"
            >
              Join the world's most elite circle of knowledge swappers. 
              Trade what you know for what you need. No hidden costs, just human intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Button asChild size="lg" className="h-16 md:h-20 px-10 md:px-14 rounded-2xl text-lg md:text-xl font-black uppercase tracking-widest gradient-primary text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-[0.98] transition-all group w-full sm:w-auto">
                <Link to="/discover">
                  Explore Network <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 md:h-20 px-10 md:px-14 rounded-2xl text-lg md:text-xl font-black uppercase tracking-widest border-border/50 bg-background/50 hover:bg-secondary/80 backdrop-blur-md transition-all w-full sm:w-auto">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-24 md:mt-32 flex flex-col items-center gap-6"
            >
              <p className="text-[0.625rem] md:text-[0.75rem] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Elite Network of 25,000+ Verified Mentors</p>
              <div className="flex -space-x-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-[3px] border-background bg-secondary flex items-center justify-center overflow-hidden shadow-xl hover:translate-y-[-4px] hover:z-10 transition-all cursor-pointer">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=learnmate-${i * 123}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-[3px] border-background bg-primary flex items-center justify-center text-[0.75rem] font-bold text-white shadow-xl">
                  +2k
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Skills Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-[32rem]">
                <h2 className="font-display font-black text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] text-foreground leading-[1.1] mb-6">Trending <span className="text-primary italic">Expertise</span></h2>
                <p className="text-muted-foreground text-lg font-medium italic">Master these high-demand skills through direct peer exchange.</p>
              </div>
              <Button asChild variant="ghost" className="text-primary font-black uppercase tracking-widest gap-2 hover:bg-primary/5">
                <Link to="/assessments">View All Assessments <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-premium !p-8 md:!p-10 text-center cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group border-primary/5 flex flex-col items-center relative overflow-hidden h-full"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-secondary/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-inner group-hover:bg-primary/10 z-10">
                    <Zap className="w-8 h-8 md:w-10 md:h-10 text-primary transition-colors" />
                  </div>
                  <h3 className="text-[1.35rem] md:text-[1.5rem] font-display font-black text-foreground italic m-0 z-10 flex-1 flex items-end pb-2">{skill}</h3>
                  <p className="text-muted-foreground/70 text-sm mt-1 font-medium z-10 italic">
                    Validated skill path
                  </p>

                  <Link to="/assessments" className="mt-8 pt-8 border-t border-border/40 w-full flex items-center justify-center gap-2 text-[0.75rem] font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all z-10">
                    Test Skill <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features SECTION */}
        <section className="w-full py-24 md:py-32 bg-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30">
             <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] animate-float" />
             <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-accent/10 rounded-full blur-[100px]" />
          </div>

          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-[45rem] mx-auto mb-20">
              <h2 className="font-display font-black text-[3rem] md:text-[4.5rem] text-foreground mb-8 leading-tight">The Ecosystem</h2>
              <p className="text-muted-foreground text-xl font-medium italic leading-relaxed">We've built more than a platform — we've built a self-sustaining economy of human intelligence.</p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-premium !p-10 text-center hover:shadow-[0_32px_64px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-700 group relative flex flex-col items-center border border-white/10"
                >
                  <div className={`w-20 h-20 rounded-[2rem] ${f.color} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl ring-1 ring-white/20`}>
                    <f.icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-foreground mb-6 italic group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground/80 text-lg leading-relaxed italic mb-10 flex-1">
                    {f.description}
                  </p>
                  <div className="w-full pt-8 border-t border-border/30">
                    <button className="text-[0.75rem] font-black uppercase tracking-[0.25em] text-primary flex items-center gap-2 hover:gap-4 transition-all mx-auto">
                      Learn More <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
           <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
             <motion.div 
               initial={{ opacity:0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="glass-strong rounded-[4rem] p-12 md:p-20 lg:p-24 text-center relative overflow-hidden group shadow-2xl border-white/10"
             >
                <div className="absolute inset-0 bg-primary/5 opacity-40 -z-10 group-hover:bg-primary/10 transition-colors" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
                   {[
                     { label: "Elite Mentors", value: "2.4k+", icon: Users },
                     { label: "Skills Swapped", value: "15k+", icon: RefreshCcw },
                     { label: "Learning Hours", value: "40k+", icon: Timer },
                     { label: "Global Rating", value: "4.9/5", icon: Trophy }
                   ].map((stat, i) => (
                     <div key={i} className="flex flex-col items-center">
                        <div className="text-[2.5rem] md:text-[3.5rem] font-display font-black text-foreground mb-2 leading-none">{stat.value}</div>
                        <p className="text-[0.75rem] uppercase font-black tracking-[0.3em] text-muted-foreground/60">{stat.label}</p>
                     </div>
                   ))}
                </div>
             </motion.div>
           </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Index;


