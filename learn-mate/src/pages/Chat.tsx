import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Paperclip, ArrowLeft, FileIcon, Image as ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatUsers } from "@/lib/mockData";
import PageTransition from "@/components/PageTransition";

interface Attachment {
  name: string;
  type: string;
  url: string;
}

interface ChatMessage {
  text: string;
  fromMe: boolean;
  attachment?: Attachment;
}

const Chat = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [input, setInput] = useState("");
  const [pendingFile, setPendingFile] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = chatUsers.find((u) => u.id === selectedId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingFile({ name: file.name, type: file.type, url });
    e.target.value = "";
  };

  const sendMessage = () => {
    if ((!input.trim() && !pendingFile) || !selectedId) return;
    const newMsg: ChatMessage = {
      text: input,
      fromMe: true,
      attachment: pendingFile || undefined,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    setInput("");
    setPendingFile(null);
  };

  const isImage = (type: string) => type.startsWith("image/");

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] relative">
        <div className="container-custom py-[1.5rem] md:py-[4rem]">
          <div className="glass-premium !p-0 overflow-hidden flex flex-col md:flex-row min-h-[calc(100vh-12rem)] shadow-2xl border-border/30 w-full">
            {/* Sidebar */}
            <div
              className={`${
                selectedId ? "hidden md:flex" : "flex"
              } w-full md:w-[20rem] border-r border-border/40 flex-col shrink-0 bg-secondary/10`}
            >
              <div className="p-[1.25rem] border-b border-border/40 bg-background/20">
                <h2 className="font-display font-bold text-[1.25rem] text-foreground m-0 flex items-center gap-[0.5rem]">
                  <MessageCircle className="w-[1.25rem] h-[1.25rem] text-primary" /> Conversations
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chatUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedId(user.id)}
                    className={`w-full text-left px-[1.25rem] py-[1rem] flex items-center gap-[1rem] transition-all border-b border-border/10 ${
                      selectedId === user.id
                        ? "bg-primary/10 border-l-[0.25rem] border-l-primary"
                        : "hover:bg-primary/5"
                    }`}
                  >
                    <div className="w-[2.5rem] h-[2.5rem] rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-black text-[0.875rem] shrink-0 shadow-sm">
                      {user.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-bold text-[0.875rem] truncate m-0 ${selectedId === user.id ? "text-primary" : "text-foreground"}`}>
                        {user.name}
                      </p>
                      <p className="text-[0.625rem] text-muted-foreground truncate uppercase font-black tracking-widest mt-[0.125rem]">
                        {user.skill}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat area */}
            <div className={`flex-1 flex flex-col bg-background/20 backdrop-blur-sm ${!selectedId ? "hidden md:flex" : "flex"}`}>
              {selected ? (
                <>
                  <div className="p-[1.25rem] border-b border-border/40 flex items-center gap-[1rem] bg-background/40">
                    <button
                      className="md:hidden p-[0.5rem] rounded-xl hover:bg-primary/10 transition-colors"
                      onClick={() => setSelectedId(null)}
                    >
                      <ArrowLeft className="w-[1.25rem] h-[1.25rem]" />
                    </button>
                    <div className="w-[2rem] h-[2rem] rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-black text-[0.75rem] shrink-0 md:hidden shadow-sm">
                      {selected.name[0]}
                    </div>
                    <div>
                      <span className="font-display font-bold text-[1.125rem] text-foreground block">
                        {selected.name}
                      </span>
                      <span className="text-[0.625rem] font-black uppercase text-primary/60 tracking-widest leading-none">
                        Active Now
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-[1.5rem] overflow-y-auto space-y-[1.25rem] custom-scrollbar">
                    {(messages[selectedId!] || []).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-[0.875rem] italic gap-[1rem]">
                        <div className="w-[4rem] h-[4rem] bg-primary/5 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-[2rem] h-[2rem] text-primary/20" />
                        </div>
                        👋 Start your conversation with {selected.name}
                      </div>
                    ) : (
                      (messages[selectedId!] || []).map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[20rem] px-[1.25rem] py-[0.875rem] rounded-[1.5rem] text-[0.875rem] shadow-sm ${
                              msg.fromMe
                                ? "gradient-primary text-primary-foreground rounded-br-[0.25rem] shadow-primary/20"
                                : "bg-card border border-border/50 text-foreground rounded-bl-[0.25rem]"
                            }`}
                          >
                            {msg.attachment && (
                              <div className="mb-[0.75rem]">
                                {isImage(msg.attachment.type) ? (
                                  <img
                                    src={msg.attachment.url}
                                    alt={msg.attachment.name}
                                    className="rounded-[1rem] max-w-full max-h-[12rem] object-cover ring-1 ring-white/20"
                                  />
                                ) : (
                                  <a
                                    href={msg.attachment.url}
                                    download={msg.attachment.name}
                                    className="flex items-center gap-[0.5rem] p-[0.75rem] rounded-[1rem] bg-black/5 hover:bg-black/10 transition-colors border border-white/5"
                                  >
                                    <FileIcon className="w-[1rem] h-[1rem] shrink-0" />
                                    <span className="truncate text-[0.75rem] font-bold">{msg.attachment.name}</span>
                                  </a>
                                )}
                              </div>
                            )}
                            {msg.text && <span className="leading-relaxed">{msg.text}</span>}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Pending file preview */}
                  <AnimatePresence>
                    {pendingFile && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-[1.25rem] py-[0.75rem] border-t border-border/30 bg-background/40 backdrop-blur-md"
                      >
                        <div className="flex items-center gap-[0.75rem] p-[0.75rem] rounded-[1rem] bg-primary/5 text-[0.875rem] border border-primary/20">
                          {isImage(pendingFile.type) ? (
                            <ImageIcon className="w-[1rem] h-[1rem] text-primary shrink-0" />
                          ) : (
                            <FileIcon className="w-[1rem] h-[1rem] text-primary shrink-0" />
                          )}
                          <span className="truncate text-foreground flex-1 font-bold italic">{pendingFile.name}</span>
                          <button
                            onClick={() => setPendingFile(null)}
                            className="p-[0.25rem] rounded-full hover:bg-primary/10 transition-colors"
                          >
                            <X className="w-[0.875rem] h-[0.875rem]" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-[1.25rem] border-t border-border/40 flex gap-[0.75rem] bg-background/30 backdrop-blur-md">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="icon"
                      variant="outline"
                      className="rounded-[1rem] shrink-0 w-[3rem] h-[3rem] border-border/50 hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <Paperclip className="w-[1.25rem] h-[1.25rem]" />
                    </Button>
                    <div className="relative flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="rounded-[1rem] h-[3rem] border-none bg-background/50 focus:ring-2 focus:ring-primary/20 pr-[3.5rem] font-medium"
                      />
                      <Button
                        onClick={sendMessage}
                        size="icon"
                        className="absolute right-[0.375rem] top-1/2 -translate-y-1/2 w-[2.25rem] h-[2.25rem] rounded-[0.75rem] gradient-primary text-primary-foreground hover:scale-105 transition-transform shrink-0"
                      >
                        <Send className="w-[1rem] h-[1rem]" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-[1.5rem] italic bg-secondary/5">
                  <div className="w-[6rem] h-[6rem] bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
                    <MessageCircle className="w-[3rem] h-[3rem] text-primary/20" />
                  </div>
                  <p className="font-bold text-[1.125rem]">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;
