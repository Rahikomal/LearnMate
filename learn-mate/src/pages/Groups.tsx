import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Plus, LayoutGrid, Flame, Tag, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { groupsApi } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

const SKILL_TAGS = [
  "All", "React JS", "TypeScript", "Python", "Node.js", "Tailwind CSS",
  "Azure", "Machine Learning", "C#", "Java", "Go", "DevOps", "UI/UX",
];

const GroupsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups", selectedSkill],
    queryFn: () => groupsApi.listGroups(selectedSkill === "All" ? undefined : selectedSkill),
  });

  const { data: popular = [] } = useQuery({
    queryKey: ["popular-groups"],
    queryFn: () => groupsApi.getPopularGroups(),
  });

  const filtered = groups.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] relative">
        <div className="container-custom py-[1.5rem] md:py-[3.25rem]">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-[1.5rem] mb-[1.75rem]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-[0.5rem]"
            >
              <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-primary/10 text-primary text-[0.75rem] font-bold border border-primary/20 mb-[0.5rem]">
                <Users className="w-[0.875rem] h-[0.875rem]" /> Community Ecosystem
              </div>
              <h1 className="font-display font-bold text-[2.5rem] tracking-tight leading-tight m-0">
                Community Groups
              </h1>
              <p className="text-muted-foreground text-[0.875rem] sm:text-[1rem] max-w-[30rem] m-0">
                Join skill-based communities to collaborate, share projects, and learn together.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="self-start md:self-end"
            >
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="rounded-[1rem] gradient-primary text-primary-foreground h-[3rem] px-[1.5rem] font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Plus className="w-[1.25rem] h-[1.25rem] mr-[0.5rem]" />
                Create Group
              </Button>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-[2rem]">
            {/* Main Content Area - min-w-0 captures its flex context */}
            <div className="flex-1 min-w-0 space-y-[1.5rem]">
              {/* Filter Bar */}
              <div className="glass-premium !p-[1.25rem] flex flex-col lg:flex-row items-center gap-[1rem]">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-[1rem] top-1/2 -translate-y-1/2 w-[1rem] h-[1rem] text-muted-foreground" />
                  <Input 
                    placeholder="Search groups..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-[2.75rem] h-[3rem] rounded-[0.75rem] bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 w-full"
                  />
                </div>
                <div className="nav-scroll flex items-center gap-[0.5rem] w-full lg:w-auto pb-[0.5rem] lg:pb-0 scroll-smooth">
                  {SKILL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedSkill(tag)}
                      className={`text-[0.75rem] px-[1rem] py-[0.5rem] rounded-full transition-all whitespace-nowrap border font-bold shrink-0 ${
                        selectedSkill === tag 
                          ? "gradient-primary text-primary-foreground border-transparent shadow-md" 
                          : "bg-background/50 border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Groups Grid */}
              {isLoading ? (
                <div className="glass-premium rounded-[3rem] p-[6rem] text-center flex flex-col items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse" />
                  <div className="w-[3rem] h-[3rem] border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-[1.5rem] relative z-10" />
                  <p className="text-muted-foreground font-medium animate-pulse relative z-10 italic">Syncing with communities...</p>
                </div>
              ) : filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-premium p-[6rem] text-center flex flex-col items-center"
                >
                  <div className="w-[5rem] h-[5rem] rounded-full bg-secondary/50 flex items-center justify-center mb-[1.5rem]">
                    <LayoutGrid className="w-[2.5rem] h-[2.5rem] text-muted-foreground/30" />
                  </div>
                  <h3 className="font-display font-bold text-[1.5rem] text-foreground mb-[0.75rem]">No groups found</h3>
                  <p className="text-muted-foreground max-w-[20rem] mb-[2rem] leading-relaxed italic">
                    We couldn't find any community groups matching your criteria. Be the visionary and start the first one!
                  </p>
                  <div className="flex gap-[0.75rem]">
                    <Button variant="outline" onClick={() => {setSearch(""); setSelectedSkill("All")}} className="rounded-[1rem] px-[1.5rem] h-[2.75rem]">
                      Clear Filters
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} className="rounded-[1rem] px-[1.5rem] h-[2.75rem] gradient-primary text-primary-foreground font-bold">
                      Create Group
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid-adaptive">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((group, i) => (
                      <GroupCard key={group.id} group={group} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <Sidebar>
              <div className="glass-premium !p-[1.5rem] !rounded-[2rem]">
                <h3 className="font-display font-bold text-[1.125rem] mb-[1.5rem] flex items-center gap-[0.5rem] text-foreground">
                  <Flame className="w-[1.25rem] h-[1.25rem] text-orange-500 fill-orange-500/10" />
                  Trending Now
                </h3>
                <div className="space-y-[1rem]">
                  {popular.length > 0 ? (
                    popular.map((group, i) => (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-[0.75rem] group cursor-pointer p-[0.5rem] hover:bg-primary/5 rounded-[1rem] transition-all border border-transparent hover:border-primary/10"
                      >
                        <div className="w-[2.5rem] h-[2.5rem] rounded-[0.75rem] gradient-primary flex-shrink-0 flex items-center justify-center text-white font-black text-[0.75rem] shadow-sm">
                          {group.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.875rem] font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {group.name}
                          </p>
                          <div className="flex items-center gap-[0.5rem] text-[0.625rem] font-bold text-muted-foreground/70 uppercase tracking-tight">
                            <span className="flex items-center gap-[0.125rem]"><Users className="w-[0.75rem] h-[0.75rem]" /> {group.member_count}</span>
                            <span className="flex items-center gap-[0.125rem]"><Tag className="w-[0.75rem] h-[0.75rem]" /> {group.skill_tag}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-[2rem] text-center px-[0.75rem]">
                      <p className="text-[0.625rem] font-black uppercase tracking-[0.1em] text-muted-foreground/40 leading-relaxed italic">
                        Top active groups will appear here soon
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-premium !p-[2rem] relative overflow-hidden group border-primary/20">
                <div className="absolute top-0 right-0 p-[2rem] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <Sparkles className="w-[8rem] h-[8rem] -rotate-12" />
                </div>
                <h4 className="text-[0.625rem] font-black uppercase tracking-[0.25em] text-primary mb-[1.5rem] flex items-center gap-[0.5rem] relative z-10">
                  <Sparkles className="w-[0.875rem] h-[0.875rem] animate-pulse" /> Platform Benefits
                </h4>
                <ul className="space-y-[1.25rem] relative z-10">
                   {[
                     { icon: "✨", text: "Collaborative learning", color: "bg-blue-500/10 text-blue-500" },
                     { icon: "💼", text: "Project opportunities", color: "bg-purple-500/10 text-purple-500" },
                     { icon: "👥", text: "Networking with experts", color: "bg-indigo-500/10 text-indigo-500" }
                   ].map((item, idx) => (
                     <li key={idx} className="flex items-center gap-[1rem] p-[0.75rem] rounded-[1rem] bg-background/40 hover:bg-background/60 transition-all border border-border/50 group/item hover:-translate-y-[0.125rem]">
                        <div className={`w-[2.25rem] h-[2.25rem] rounded-[0.75rem] ${item.color.split(' ')[0]} flex items-center justify-center shrink-0 shadow-sm border border-white/10 group-hover/item:scale-110 transition-transform`}>
                           <span className="text-[1.125rem] rotate-0 group-hover/item:rotate-12 transition-transform">{item.icon}</span>
                        </div>
                        <span className="text-[0.875rem] text-foreground font-bold tracking-tight">{item.text}</span>
                     </li>
                   ))}
                </ul>
              </div>
            </Sidebar>
          </div>

          <CreateGroupModal 
            open={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default GroupsPage;
