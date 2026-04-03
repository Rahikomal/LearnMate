import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  ArrowLeft, Users, MessageSquare, Send, Tag, 
  ChevronRight, Heart, Share2, MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageTransition from "@/components/PageTransition";
import { PostCard } from "@/components/groups/PostCard";
import { groupsApi } from "@/lib/api";

const GroupFeed = () => {
  const { id } = useParams<{ id: string }>();
  const groupId = parseInt(id!);
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupsApi.listGroups(),
  });
  const currentGroup = groups.find(g => g.id === groupId);

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ["group-posts", groupId],
    queryFn: () => groupsApi.getPosts(groupId),
    enabled: !!groupId,
  });

  const postMutation = useMutation({
    mutationFn: () => groupsApi.createPost(groupId, content),
    onSuccess: () => {
      toast.success("Post shared with community! ✨");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["group-posts", groupId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const joinMutation = useMutation({
    mutationFn: () => groupsApi.joinGroup(groupId),
    onSuccess: () => {
      toast.success("Welcome to the community! 🎉");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!currentGroup && !loadingPosts) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center italic text-muted-foreground">
      <Users className="w-[1rem] h-[1rem] mr-[0.5rem]" /> Community not found
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] relative">
        <div className="container-custom py-[2rem] md:py-[4rem]">
          {/* Navigation / Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-[1.5rem] mb-[2rem]">
            <Link to="/groups" className="flex items-center gap-[0.75rem] text-[0.875rem] text-muted-foreground hover:text-primary transition-all group font-bold">
              <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-primary-foreground border border-border/50">
                <ArrowLeft className="w-[1.125rem] h-[1.125rem]" />
              </div>
              <span className="uppercase tracking-[0.05em]">Back to Hub</span>
            </Link>
            <div className="flex items-center gap-[0.75rem]">
              <Button variant="outline" size="icon" className="rounded-full w-[2.75rem] h-[2.75rem] border-primary/20 hover:bg-primary/5 hover:text-primary">
                <Share2 className="w-[1.125rem] h-[1.125rem]" />
              </Button>
              <Button 
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isPending}
                className="rounded-[1.25rem] gradient-primary text-primary-foreground px-[1.5rem] h-[2.75rem] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Users className="w-[1.25rem] h-[1.25rem] mr-[0.5rem]" />
                Join Community
              </Button>
            </div>
          </div>

          {/* Hero Banner Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-premium !p-[2.5rem] sm:!p-[4rem] mb-[2.5rem] overflow-hidden relative border-primary/20 shadow-2xl"
          >
            {/* Abstract Decorations */}
            <div className="absolute -top-[5rem] -right-[5rem] w-[20rem] h-[20rem] bg-primary/10 rounded-full blur-[5rem] pointer-events-none" />
            <div className="absolute -bottom-[4rem] -left-[4rem] w-[15rem] h-[15rem] bg-accent/20 rounded-full blur-[4rem] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-[45rem] mx-auto">
              <div className="w-[5rem] h-[5rem] rounded-[1.5rem] gradient-primary flex items-center justify-center text-white font-black text-[2.5rem] shadow-glow mb-[2rem] transform rotate-3 ring-[0.25rem] ring-background">
                {currentGroup?.name[0].toUpperCase()}
              </div>
              <h1 className="font-display font-bold text-[2.5rem] sm:text-[3.5rem] text-foreground mb-[1rem] tracking-tight leading-tight m-0">
                {currentGroup?.name}
              </h1>
              <div className="flex flex-wrap justify-center gap-[0.75rem] mb-[2rem]">
                <span className="text-[0.75rem] px-[1rem] py-[0.375rem] rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-[0.1em] flex items-center gap-[0.25rem]">
                  <Tag className="w-[0.875rem] h-[0.875rem]" />
                  {currentGroup?.skill_tag}
                </span>
                <span className="text-[0.75rem] px-[1rem] py-[0.375rem] rounded-full bg-secondary/50 text-muted-foreground border border-border/50 font-black uppercase tracking-[0.1em] flex items-center gap-[0.25rem]">
                  <Users className="w-[0.875rem] h-[0.875rem]" />
                  {currentGroup?.member_count} Members
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[1rem] sm:text-[1.125rem] italic m-0">
                {currentGroup?.description}
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-[2rem]">
            {/* Feed Column */}
            <div className="flex-1 space-y-[1.5rem]">
              {/* Post Composer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-premium !p-[1.5rem] border-primary/10 shadow-lg"
              >
                <div className="flex items-center gap-[0.5rem] text-primary font-black uppercase tracking-[0.1em] mb-[1.25rem] text-[0.75rem]">
                  <MessageSquare className="w-[1rem] h-[1rem]" />
                  Share with community
                </div>
                <Textarea 
                  placeholder="What's on your mind? Inspire the community..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="rounded-[1.25rem] bg-secondary/20 border-border/40 min-h-[8rem] resize-none focus-visible:ring-primary/20 transition-all p-[1.25rem] font-medium leading-relaxed"
                />
                <div className="flex items-center justify-between mt-[1rem]">
                  <div className="text-[0.625rem] text-muted-foreground font-bold uppercase tracking-widest italic leading-none">Markdown supported</div>
                  <Button 
                    onClick={() => postMutation.mutate()}
                    disabled={!content.trim() || postMutation.isPending}
                    className="rounded-full gradient-primary text-primary-foreground px-[1.5rem] h-[2.5rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/10"
                  >
                    Post <Send className="w-[0.875rem] h-[0.875rem] ml-[0.375rem]" />
                  </Button>
                </div>
              </motion.div>

              {/* Posts List */}
              <div className="space-y-[1.25rem]">
                {loadingPosts ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="glass-premium rounded-[1.5rem] h-[8rem] animate-pulse" />
                  ))
                ) : posts.length === 0 ? (
                  <div className="text-center py-[4rem] glass-premium rounded-[2.5rem] border-dashed border-muted-foreground/30 flex flex-col items-center">
                    <div className="w-[4rem] h-[4rem] bg-secondary/30 rounded-full flex items-center justify-center mb-[1rem]">
                       <MessageSquare className="w-[2rem] h-[2rem] text-muted-foreground/20" />
                    </div>
                    <p className="text-muted-foreground font-bold italic text-[0.875rem]">No voices yet. Start the conversation!</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {posts.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Members Sidebar */}
            <aside className="w-full md:w-[20rem] space-y-[1.5rem]">
              <div className="glass-premium !p-[1.5rem] !rounded-[2rem] sticky top-[6rem] shadow-xl">
                <h3 className="font-display font-black uppercase tracking-widest text-[0.875rem] text-foreground flex items-center justify-between mb-[1.5rem] m-0">
                  Top Contributors
                  <Button variant="ghost" size="sm" className="text-[0.625rem] text-primary hover:text-primary/80 h-auto p-0 font-black tracking-widest uppercase">
                    Hub <ChevronRight className="w-[0.75rem] h-[0.75rem] ml-[0.125rem]" />
                  </Button>
                </h3>
                <div className="space-y-[1.25rem]">
                  {[...Array(5)].map((_, i) => {
                     const initials = ["H", "K", "N", "D", "R"][i % 5];
                     const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500"];
                     return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-center gap-[0.75rem] p-[0.375rem] hover:bg-primary/5 rounded-[1.25rem] transition-all cursor-pointer border border-transparent hover:border-primary/10"
                      >
                        <div className={`w-[2.5rem] h-[2.5rem] rounded-[1rem] ${colors[i]} flex items-center justify-center text-white font-black text-[0.875rem] shadow-sm transform-gpu group-hover:scale-105`}>
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.875rem] font-black text-foreground truncate m-0">Member Name {i+1}</p>
                          <p className="text-[0.625rem] text-muted-foreground font-black uppercase tracking-[0.1em] m-0 italic bg-clip-text text-transparent bg-gradient-to-r from-muted-foreground to-muted-foreground/40">Expert Mentor</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2.5rem] p-[1.5rem] bg-primary/5 border border-primary/20 relative overflow-hidden">
                <div className="absolute -top-[1.5rem] -right-[1.5rem] w-[5rem] h-[5rem] bg-primary/10 rounded-full blur-[2rem]" />
                <h4 className="text-[0.75rem] font-black tracking-[0.2em] text-primary mb-[1rem] uppercase m-0">Guidelines</h4>
                <ol className="space-y-[0.75rem] text-[0.75rem] text-muted-foreground list-decimal pl-[1rem] font-medium italic m-0">
                  <li className="pl-[0.25rem]">Be respectful and kind to others</li>
                  <li className="pl-[0.25rem]">Stay on topic (skill: {currentGroup?.skill_tag})</li>
                  <li className="pl-[0.25rem]">Sharing is caring - help others!</li>
                  <li className="pl-[0.25rem]">No spam or self-promotion</li>
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GroupFeed;
