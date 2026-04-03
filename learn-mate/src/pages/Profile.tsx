import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, Camera, ShieldCheck, ArrowRight, UserCircle, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SkillBadge } from "@/components/assessments/SkillBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import { currentUser } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [tab, setTab] = useState<"profile" | "password">("profile");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile saved successfully! 🎉");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security settings updated!");
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] relative">
        <div className="container-custom py-[2rem] md:py-[4rem]">
          <header className="flex flex-col items-center text-center mb-[3.5rem]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mb-[1.5rem]"
            >
              <div className="relative group">
                <Avatar className="h-[7rem] w-[7rem] border-[0.25rem] border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-[2rem]">{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse pointer-events-none" />
              </div>
              <button className="absolute bottom-[0.5rem] right-[0.5rem] p-[0.625rem] rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform border-[0.125rem] border-background">
                <Camera className="w-[0.875rem] h-[0.875rem]" />
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-[0.25rem]"
            >
              <h1 className="font-display font-bold text-[2.5rem] text-foreground tracking-tight m-0">
                {currentUser.name}
              </h1>
              <p className="text-muted-foreground flex items-center justify-center gap-[0.5rem] text-[0.875rem] font-medium m-0 italic">
                <Mail className="w-[1rem] h-[1rem] text-primary/60" /> {currentUser.email}
              </p>
            </motion.div>
          </header>

          <div className="flex flex-col md:flex-row gap-[2.5rem] max-w-[60rem] mx-auto">
             {/* Sidebar Navigation */}
             <div className="w-full md:w-[15rem] space-y-[0.5rem]">
                <button
                  onClick={() => setTab("profile")}
                  className={`w-full flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-[1.25rem] text-[0.875rem] font-bold transition-all border outline-none ${
                    tab === "profile" 
                      ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20" 
                      : "bg-background/40 text-muted-foreground border-border/40 hover:bg-primary/5 hover:border-primary/20"
                  }`}
                >
                  <UserCircle className="w-[1.25rem] h-[1.25rem]" /> Edit Profile
                </button>
                <button
                  onClick={() => setTab("password")}
                  className={`w-full flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-[1.25rem] text-[0.875rem] font-bold transition-all border outline-none ${
                    tab === "password" 
                      ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20" 
                      : "bg-background/40 text-muted-foreground border-border/40 hover:bg-primary/5 hover:border-primary/20"
                  }`}
                >
                  <ShieldCheck className="w-[1.25rem] h-[1.25rem]" /> Security
                </button>
                <button
                  onClick={() => (setTab as any)("badges")}
                  className={`w-full flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-[1.25rem] text-[0.875rem] font-bold transition-all border outline-none ${
                    (tab as any) === "badges" 
                      ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20" 
                      : "bg-background/40 text-muted-foreground border-border/40 hover:bg-primary/5 hover:border-primary/20"
                  }`}
                >
                  <Award className="w-[1.25rem] h-[1.25rem]" /> Assessed Skills
                </button>
             </div>

             {/* Main Form Content */}
             <div className="flex-1 min-w-0">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={tab}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                   className="glass-premium !p-[2rem] sm:!p-[3rem] shadow-xl border-border/30 h-full"
                 >
                    <div className="mb-[2.5rem] border-b border-border/40 pb-[1.5rem] relative">
                       <h2 className="font-display font-bold text-[1.5rem] text-foreground m-0">
                          {tab === "profile" ? "Account Details" : "Privacy & Security"}
                       </h2>
                       <p className="text-[0.875rem] text-muted-foreground mt-[0.5rem] m-0 italic">
                          {tab === "profile" 
                            ? "Manage your identity and learning preferences across the ecosystem." 
                            : "Keep your account safe with modern security standards."}
                       </p>
                    </div>

                    {tab === "profile" ? (
                      <form onSubmit={handleSaveProfile} className="space-y-[2rem]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5rem]">
                          <div className="space-y-[0.5rem]">
                            <Label className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-primary/70 ml-[0.25rem]">Full Name</Label>
                            <Input defaultValue={currentUser.name} className="rounded-[1rem] h-[3.5rem] bg-secondary/10 border-border/30 focus:bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                          </div>
                          <div className="space-y-[0.5rem]">
                            <Label className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-primary/70 ml-[0.25rem]">Email Address</Label>
                            <Input defaultValue={currentUser.email} type="email" disabled className="rounded-[1rem] h-[3.5rem] bg-secondary/5 border-border/20 text-muted-foreground cursor-not-allowed opacity-60 font-medium" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5rem]">
                          <div className="space-y-[0.5rem]">
                            <Label className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-primary/70 ml-[0.25rem]">Expertise Keywords</Label>
                            <Input defaultValue={currentUser.teaching.join(", ")} className="rounded-[1rem] h-[3.5rem] bg-secondary/10 border-border/30 focus:bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                            <p className="text-[0.625rem] text-muted-foreground italic ml-[0.25rem] font-bold">* Separated by commas</p>
                          </div>
                          <div className="space-y-[0.5rem]">
                            <Label className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-primary/70 ml-[0.25rem]">Core Interests</Label>
                            <Input defaultValue={currentUser.learning.join(", ")} className="rounded-[1rem] h-[3.5rem] bg-secondary/10 border-border/30 focus:bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                          </div>
                        </div>

                        <div className="pt-[1rem] flex flex-col sm:flex-row gap-[1rem]">
                          <Button type="submit" className="flex-1 rounded-[1.25rem] h-[4rem] gradient-primary text-primary-foreground font-black text-[0.875rem] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Save Changes
                          </Button>
                          <Button variant="outline" type="button" className="sm:w-auto px-[2rem] rounded-[1.25rem] h-[4rem] border-border/40 font-bold hover:bg-secondary/50 uppercase text-[0.75rem] tracking-wider">
                            Reset
                          </Button>
                        </div>
                      </form>
                    ) : tab === "password" ? (
                      <form onSubmit={handleUpdatePassword} className="space-y-[2rem]">
                        <div className="space-y-[0.5rem]">
                          <Label className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-primary/70 ml-[0.25rem]">Current Password</Label>
                          <Input placeholder="••••••••" type="password" className="rounded-[1rem] h-[3.5rem] bg-secondary/10 border-border/30 focus:bg-background/50 transition-all font-medium" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5rem]">
                          <div className="space-y-[0.5rem]">
                            <Label className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-primary/70 ml-[0.25rem]">New Strong Password</Label>
                            <Input placeholder="Min. 8 chars" type="password" className="rounded-[1rem] h-[3.5rem] bg-secondary/10 border-border/30 focus:bg-background/50 transition-all font-medium" />
                          </div>
                          <div className="space-y-[0.5rem]">
                            <Label className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-primary/70 ml-[0.25rem]">Verify Password</Label>
                            <Input placeholder="Repeat new password" type="password" className="rounded-[1rem] h-[3.5rem] bg-secondary/10 border-border/30 focus:bg-background/50 transition-all font-medium" />
                          </div>
                        </div>
                        
                        <div className="pt-[1rem]">
                           <Button type="submit" className="w-full sm:w-auto px-[2.5rem] rounded-[1.25rem] h-[4rem] gradient-primary text-primary-foreground font-black text-[0.875rem] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Update Password
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-[2rem]">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SkillBadge skill="React Architecture" variant="Expert" />
                            <SkillBadge skill="TypeScript Core" variant="Intermediate" />
                            <SkillBadge skill="Node.js Security" variant="Beginner" />
                         </div>
                      </div>
                    )}
                 </motion.div>
               </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
