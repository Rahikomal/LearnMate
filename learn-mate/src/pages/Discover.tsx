import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BrainCircuit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { users } from "@/lib/mockData";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { MentorCard } from "@/components/MentorCard";
import { AIMatchCard } from "@/components/ai/AIMatchCard";
import { Switch } from "@/components/ui/switch";

type ConnectionStatus = "none" | "requested" | "connected";

const Discover = () => {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Record<string, ConnectionStatus>>({});
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSmartMatch, setIsSmartMatch] = useState(false);

  const [searchParams] = useSearchParams();
  const skillFromPath = searchParams.get("skill");

  useEffect(() => {
    if (skillFromPath) {
      setQuery(skillFromPath);
      setIsSmartMatch(true);
    }
  }, [skillFromPath]);

  const filters = ["All", "React JS", "Tailwind CSS", "TypeScript", "Python", "AI"];

  const { data: recommendations = [], isLoading: loadingRecommendations } = useQuery({
    queryKey: ["match-recommendations", skillFromPath],
    queryFn: async () => {
      const res = await fetch(
        `/api/match/recommendations?skill=${encodeURIComponent(skillFromPath || "")}`
      );
      if (!res.ok) {
        // Fallback mock data for UI demo
        return users.slice(0, 3).map((u, i) => ({
          mentor_id: u.id,
          score: 95 - i * 5,
          matched_skills: [u.skill, "Logic", "Strategy"],
        }));
      }
      return res.json();
    },
    enabled: isSmartMatch,
  });

  const filtered = users.filter(
    (u) =>
      (activeFilter === "All" || u.skill === activeFilter) &&
      (u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.skill.toLowerCase().includes(query.toLowerCase()))
  );

  const smartMatchedUsers = recommendations.map((rec: any) => {
    const user = users.find(u => u.id === rec.mentor_id);
    return user ? { ...user, matchData: rec } : null;
  }).filter(Boolean);

  const handleConnect = (id: string, name: string) => {
    const current = statuses[id] || "none";
    if (current === "none") {
      setStatuses((prev) => ({ ...prev, [id]: "requested" }));
      toast.info(`Connection request sent to ${name}`);
    } else if (current === "requested") {
      setStatuses((prev) => ({ ...prev, [id]: "connected" }));
      toast.success(`Connected with ${name}!`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] relative">
        <div className="container-custom py-[1.5rem] md:py-[3rem]">
          <div className="flex flex-col items-center text-center mb-[3rem]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-[0.875rem] py-[0.3rem] rounded-full bg-primary/10 text-primary text-[0.625rem] font-black uppercase tracking-[0.25em] border border-primary/20 mb-[1.25rem]"
            >
              <Sparkles className="w-[0.7rem] h-[0.7rem] inline-block mr-[0.3rem] mb-[0.1rem]" />
              Mentors Community
            </motion.div>
            <h1 className="font-display font-black text-[2.25rem] sm:text-[3rem] text-foreground tracking-tight leading-none m-0">
              Discover Your Next <span className="text-primary italic">Mentor</span>
            </h1>

            <div className="mt-8 flex items-center gap-4 py-3 px-6 glass-premium !rounded-full group hover:shadow-primary/10 transition-all border-primary/20">
              <Switch
                checked={isSmartMatch}
                onCheckedChange={setIsSmartMatch}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-[0.875rem] font-black uppercase tracking-[0.1em] transition-colors duration-300 ${isSmartMatch ? "text-primary" : "text-muted-foreground"}`}>
                <BrainCircuit className="w-5 h-5 inline-block mr-2 -mt-1" />
                AI Smart Match
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-[0.875rem] mb-[2.5rem] w-full"
          >
            <div className="relative flex-1">
              <Search className="absolute left-[0.875rem] top-1/2 -translate-y-1/2 w-[0.875rem] h-[0.875rem] text-muted-foreground/60" />
              <Input
                placeholder="Search by name or skill..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-[2.5rem] h-[3rem] rounded-[0.875rem] bg-card/50 backdrop-blur-sm shadow-sm border-border/50 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            {!isSmartMatch && (
              <div className="nav-scroll flex gap-[0.5rem] pb-[0.5rem] lg:pb-0 scroll-smooth">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-[1.25rem] h-[3rem] rounded-[0.875rem] text-[0.8125rem] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${activeFilter === f
                        ? "gradient-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20"
                        : "bg-background/50 border-border/50 text-muted-foreground hover:bg-secondary/50 font-bold"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {isSmartMatch ? (
              <motion.div
                key="smart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid-adaptive"
              >
                {loadingRecommendations ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="h-[25rem] bg-secondary/30 animate-pulse rounded-[2rem]" />
                  ))
                ) : smartMatchedUsers.map((user: any, i: number) => (
                  <AIMatchCard
                    key={user.id}
                    user={user}
                    index={i}
                    matchData={user.matchData}
                    onConnect={handleConnect}
                    status={statuses[user.id] || "none"}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid-adaptive"
              >
                {filtered.length === 0 ? (
                  <div className="col-span-full text-center py-[6rem] glass-premium rounded-[3rem]">
                    <div className="w-[4rem] h-[4rem] bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-[1.5rem]">
                      <Search className="w-[2rem] h-[2rem] text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground font-bold italic text-[1.125rem]">No results found for your search.</p>
                  </div>
                ) : (
                  filtered.map((user, i) => (
                    <MentorCard
                      key={user.id}
                      user={user}
                      index={i}
                      onConnect={handleConnect}
                      status={statuses[user.id] || "none"}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default Discover;