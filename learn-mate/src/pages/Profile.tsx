import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Camera, ShieldCheck, UserCircle, Award } from "lucide-react";
import { SkillBadge } from "@/components/assessments/SkillBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import { currentUser } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Avatar Uploader Sub-Component ─────────────────────────────────────────────
const AvatarUploader = ({ name }: { name: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const defaultSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, GIF, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 28 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsUploading(false);
        toast.success("Profile photo updated! ✨");
      }
      setUploadProgress(Math.min(progress, 100));
    }, 110);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setUploadProgress(0);
    toast("Photo removed.", { description: "Your default avatar has been restored." });
  };

  const openPicker = () => document.getElementById("avatar-upload")?.click();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mb-[1.5rem] flex flex-col items-center"
    >
      {/* Hidden file input */}
      <input
        id="avatar-upload"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Clickable + draggable avatar area */}
      <div
        className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? "scale-110" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={openPicker}
        title="Click or drag an image to update your photo"
      >
        <Avatar
          className={`h-[7rem] w-[7rem] border-[0.25rem] shadow-2xl transition-all duration-500 group-hover:scale-105 ${
            isDragging ? "border-primary" : "border-background"
          }`}
        >
          <AvatarImage src={preview ?? defaultSrc} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary font-black text-[2rem]">
            {name[0]}
          </AvatarFallback>
        </Avatar>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary pointer-events-none"
            >
              <Camera className="w-7 h-7 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover overlay */}
        {!isDragging && (
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Animated pulse ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse pointer-events-none" />

        {/* Camera badge — stopPropagation so it doesn't double-fire the click */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openPicker(); }}
          className="absolute bottom-[0.25rem] right-[0.25rem] p-[0.625rem] rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform border-[0.125rem] border-background z-10"
          title="Upload photo"
        >
          <Camera className="w-[0.875rem] h-[0.875rem]" />
        </button>
      </div>

      {/* Animated progress bar during upload */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 w-[8rem] space-y-1"
          >
            <div className="h-1 w-full bg-border/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <p className="text-[0.625rem] font-black text-primary uppercase tracking-widest text-center">
              Uploading {Math.round(uploadProgress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint / remove button */}
      <AnimatePresence>
        {!isUploading && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex flex-col items-center gap-1"
          >
            <p className="text-[0.625rem] font-bold text-muted-foreground/60 uppercase tracking-wider">
              {preview ? "Photo updated ✓" : "Click or drag · max 5 MB"}
            </p>
            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-[0.625rem] font-black text-rose-400 hover:text-rose-600 uppercase tracking-wider transition-colors hover:underline"
              >
                Remove photo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Profile Page ──────────────────────────────────────────────────────────
const Profile = () => {
  const [tab, setTab] = useState<"profile" | "password" | "badges">("profile");

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
            <AvatarUploader name={currentUser.name} />

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
            {/* Sidebar */}
            <div className="w-full md:w-[15rem] space-y-[0.5rem]">
              {(["profile", "password", "badges"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`w-full flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-[1.25rem] text-[0.875rem] font-bold transition-all border outline-none ${
                    tab === t
                      ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20"
                      : "bg-background/40 text-muted-foreground border-border/40 hover:bg-primary/5 hover:border-primary/20"
                  }`}
                >
                  {t === "profile" && <UserCircle className="w-[1.25rem] h-[1.25rem]" />}
                  {t === "password" && <ShieldCheck className="w-[1.25rem] h-[1.25rem]" />}
                  {t === "badges" && <Award className="w-[1.25rem] h-[1.25rem]" />}
                  {t === "profile" ? "Edit Profile" : t === "password" ? "Security" : "Assessed Skills"}
                </button>
              ))}
            </div>

            {/* Content */}
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
                  <div className="mb-[2.5rem] border-b border-border/40 pb-[1.5rem]">
                    <h2 className="font-display font-bold text-[1.5rem] text-foreground m-0">
                      {tab === "profile" ? "Account Details" : tab === "password" ? "Privacy & Security" : "Your Badges"}
                    </h2>
                    <p className="text-[0.875rem] text-muted-foreground mt-[0.5rem] m-0 italic">
                      {tab === "profile"
                        ? "Manage your identity and learning preferences across the ecosystem."
                        : tab === "password"
                        ? "Keep your account safe with modern security standards."
                        : "Skills you've been assessed on and certified for."}
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
