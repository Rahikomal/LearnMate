import { motion } from "framer-motion";
import { Book, FileText, Video, Link as LinkIcon, Download, Search, Lightbulb, PlayCircle, BookOpen } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const resourceCategories = [
  { id: "guides", label: "Learning Guides", icon: BookOpen },
  { id: "docs", label: "Documentation", icon: FileText },
  { id: "videos", label: "Video Tutorials", icon: Video },
  { id: "tools", label: "Tools & Apps", icon: Lightbulb },
];

const resources = [
  {
    title: "The Art of Peer-to-Peer Mentoring",
    type: "Guide",
    description: "Learn how to effectively share your knowledge and receive feedback from peers.",
    category: "guides",
    icon: Book,
    color: "text-blue-500"
  },
  {
    title: "React Performance Optimization",
    type: "Technical",
    description: "A comprehensive guide to making your React applications blazingly fast.",
    category: "guides",
    icon: Zap,
    color: "text-purple-500"
  },
  {
    title: "Mastering TypeScript Generics",
    type: "Tutorial",
    description: "Deep dive into one of TypeScript's most powerful features.",
    category: "videos",
    icon: PlayCircle,
    color: "text-pink-500"
  },
  {
    title: "UI Design Principles for Developers",
    type: "Design",
    description: "Essential design rules that every developer should know.",
    category: "docs",
    icon: FileText,
    color: "text-orange-500"
  },
  {
    title: "Community Guidelines & Safety",
    type: "Resource",
    description: "How we maintain a safe and productive learning environment.",
    category: "docs",
    icon: Shield,
    color: "text-green-500"
  },
  {
    title: "Effective Communication in Swaps",
    type: "Soft Skill",
    description: "Tips for clear and concise communication during skill exchanges.",
    category: "guides",
    icon: MessageCircle,
    color: "text-cyan-500"
  }
];

import { Zap, Shield, MessageCircle } from "lucide-react";

const Resources = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background/50">
        {/* Header Section */}
        <section className="pt-20 pb-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[80px]" />
          </div>

          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-[0.75rem] font-black uppercase tracking-[0.25em] text-primary mb-8"
            >
              <Book className="w-4 h-4" /> Knowledge Hub
            </motion.div>
            <h1 className="text-[3rem] sm:text-[4rem] md:text-[5rem] font-display font-black text-foreground tracking-tight leading-none italic mb-8">
              Learning <span className="text-primary not-italic">Resources</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-[42rem] mx-auto font-medium italic mb-12">
              Fuel your growth with curated materials, guides, and tools designed for high-performance peer learning.
            </p>

            <div className="max-w-[36rem] mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search resources, topics, or skills..." 
                className="h-16 pl-14 pr-10 rounded-2xl bg-background/50 backdrop-blur-xl border-border/50 focus:ring-primary/20 text-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Categories & List */}
        <section className="pb-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {resourceCategories.map((cat) => (
                <Button 
                  key={cat.id}
                  variant="outline" 
                  className="h-12 px-8 rounded-full border-border/50 bg-background/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold gap-3"
                >
                  <cat.icon className="w-4 h-4" /> {cat.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((res, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-premium !p-8 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer border border-white/5"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-secondary/30 group-hover:scale-110 transition-transform ${res.color}`}>
                      <res.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-1 bg-secondary/50 rounded-full">
                      {res.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-black mb-4 italic group-hover:text-primary transition-colors">{res.title}</h3>
                  <p className="text-muted-foreground/70 text-sm leading-relaxed mb-8 italic">
                    {res.description}
                  </p>
                  <div className="pt-6 border-t border-border/30 flex items-center justify-between">
                    <button className="text-[0.75rem] font-black uppercase tracking-wider text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </button>
                    <Download className="w-4 h-4 text-muted-foreground/40 hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

import { ArrowRight } from "lucide-react";

export default Resources;
