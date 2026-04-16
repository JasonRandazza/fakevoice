"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic2, 
  Play, 
  RotateCcw, 
  Volume2, 
  Wand2, 
  Sparkles,
  AudioLines,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Languages,
  ArrowRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Interfaces
interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  labels?: Record<string, string>;
}

export default function Home() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load voices on mount
  useEffect(() => {
    async function fetchVoices() {
      try {
        const res = await fetch("/api");
        const data = await res.json();
        if (Array.isArray(data)) {
          setVoices(data);
          if (data.length > 0) setSelectedVoiceId(data[0].voice_id);
        } else {
          setError("Failed to load voices. Please check your ElevenLabs API key.");
        }
      } catch (err) {
        console.error("Failed to fetch voices", err);
        setError("Could not connect to the server.");
      }
    }
    fetchVoices();
  }, []);

  const handleGenerate = async () => {
    if (!text || !selectedVoiceId) return;

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: selectedVoiceId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Generation failed. Check your credits.");
      }

      // Handle the streaming response by converting to a blob for the player
      // (Simplified for this UI, but backend is streaming)
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      // Auto-play the generated audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 150);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden font-sans selection:bg-blue-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-emerald-600/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24">
        {/* Navigation / Brand */}
        <nav className="flex items-center justify-between mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white italic">FakeVoice</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-400"
          >
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">API Reference</a>
            <button className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Try Pro
            </button>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>Powered by ElevenLabs Flash v2.5</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            The Voice of AI,<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Rendered in Real-Time.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed"
          >
            Clone your identity or create something entirely new. Fast, lifelike, 
            and ready for any multilingual project.
          </motion.p>
        </div>

        {/* Main Interface Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar: Voice Selection */}
          <section className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Available Voices</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYNCED
              </div>
            </div>

            <div className="space-y-3 h-[480px] overflow-y-auto pr-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {voices.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
                  ))
                ) : (
                  voices.map((voice, idx) => (
                    <motion.button
                      key={voice.voice_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedVoiceId(voice.voice_id)}
                      className={cn(
                        "group w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                        selectedVoiceId === voice.voice_id 
                          ? "bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5" 
                          : "bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all",
                        selectedVoiceId === voice.voice_id 
                          ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" 
                          : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                      )}>
                        {voice.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-white truncate">{voice.name}</h3>
                          {voice.category === "cloned" && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate italic">
                          {voice.description || "Synthesized identity"}
                        </p>
                      </div>
                      <div className={cn(
                        "transition-all duration-500",
                        selectedVoiceId === voice.voice_id ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
                      )}>
                        <ArrowRight className="w-5 h-5 text-blue-500" />
                      </div>
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Main Logic: Editor & Player */}
          <section className="lg:col-span-8 space-y-6">
            <div className="relative group bg-white/[0.04] border border-white/10 rounded-[2rem] p-8 backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:border-white/20">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl">
                    <AudioLines className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold">Input Content</h2>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                    onClick={copyToClipboard}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors",
                    text.length > 450 ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-white/5 border-white/10 text-slate-500"
                  )}>
                    {text.length} / 500
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 500))}
                  placeholder="Type your message here... and watch the magic happen."
                  className="w-full h-56 bg-transparent text-2xl font-medium text-white placeholder-slate-700 resize-none border-none focus:ring-0 p-0 leading-relaxed custom-scrollbar"
                />
                
                {text.length === 0 && (
                   <div className="absolute top-1 left-0 pointer-events-none opacity-50 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                    Start typing
                   </div>
                )}
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  disabled={isGenerating || !text || !selectedVoiceId}
                  onClick={handleGenerate}
                  className={cn(
                    "flex-1 h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-500",
                    "disabled:opacity-40 disabled:grayscale",
                    !isGenerating 
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/30 active:scale-[0.98]" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="tracking-tighter uppercase">Analyzing & Rendering...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6" />
                      <span className="tracking-tight">GENERATE PERFORMANCE</span>
                    </>
                  )}
                </button>
                
                <button 
                  disabled={isGenerating}
                  onClick={() => setText("")}
                  className="w-16 h-16 rounded-2xl border border-white/10 hover:bg-white/5 flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
                >
                  <RotateCcw className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Progress Indicator */}
              {isGenerating && (
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden rounded-b-[2rem]">
                    <motion.div 
                      className="h-full bg-blue-500"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                 </div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl flex items-center gap-4 overflow-hidden"
                >
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold tracking-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Output Player Card */}
            <AnimatePresence>
              {audioUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="relative group bg-gradient-to-br from-blue-900/60 to-indigo-950/60 border border-blue-500/40 rounded-[2rem] p-8 backdrop-blur-3xl overflow-hidden shadow-2xl shadow-blue-500/10"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Volume2 className="w-24 h-24 text-white" />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-white/20">
                        <Play className="w-8 h-8 text-blue-600 fill-blue-600 translate-x-1" />
                      </div>
                      <div className="absolute -inset-4 bg-white/10 rounded-full animate-ping scale-75 opacity-20" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">High Resolution</span>
                           <div className="flex gap-0.5">
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="w-1 h-3 bg-blue-500 opacity-30 rounded-full animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                              ))}
                           </div>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-none">Audio Master Output</h3>
                      </div>
                      
                      <div className="w-full">
                        <audio 
                          ref={audioRef}
                          controls 
                          src={audioUrl}
                          className="w-full h-12 invert brightness-[2] opacity-80 hover:opacity-100 transition-all rounded-full"
                        >
                          Your browser does not support audio playback.
                        </audio>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Features */}
            {!audioUrl && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl space-y-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                      <Languages className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-widest">Global</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Multilingual support across 70+ languages with consistent accent accuracy.</p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl space-y-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Mic2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-widest">Clone</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Instant voice cloning technology allows for personalized vocal identities.</p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl space-y-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-widest">Flash</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Powered by Flash v2.5 for sub-200ms latency synthesis.</p>
                  </div>
               </div>
            )}
          </section>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </main>
  );
}