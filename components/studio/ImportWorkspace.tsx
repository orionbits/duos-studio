"use client";

import { useRef, useState } from "react";
import { UploadCloud, Trash2, Copy, FileCode, Check, Loader2, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ImportWorkspaceProps {
  input: string;
  setInput: (value: string) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function ImportWorkspace({ input, setInput, onProcess, isProcessing }: ImportWorkspaceProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
      toast.error("Only .md or .txt files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      toast.success(`Loaded: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="grid gap-6">
      <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-light text-white">Source Input Layer</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Tagged Markdown Engine v2.0
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const res = await fetch("/sample.md");
                  const text = await res.text();
                  setInput(text);
                  toast.success("Sample content loaded.");
                } catch (e) {
                  toast.error("Failed to load sample content.");
                }
              }}
              className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-4"
            >
              Load Sample
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!input}
              className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-slate-400"
            >
              {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setInput("")}
              disabled={!input}
              className="rounded-xl border-white/5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div
          className={`relative rounded-3xl border-2 border-dashed transition-all duration-500 min-h-[500px] flex flex-col ${
            dragActive 
              ? "border-teal-500 bg-teal-500/5 shadow-[0_0_50px_rgba(20,184,166,0.1)]" 
              : "border-white/5 bg-black/40 hover:border-white/10"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none p-8 font-mono text-sm leading-relaxed text-teal-400/80 focus-visible:ring-0 resize-none min-h-[500px] relative z-10"
            placeholder="Paste your tagged textbook content here, or drag and drop a .md file..."
          />

          {!input && !isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-0 opacity-30 px-10 pointer-events-none">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6">
                <UploadCloud size={32} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">
                Awaiting Data Payload Extraction
              </p>
            </div>
          )}
          
          {!input && !isProcessing && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
              >
                Browse Local Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".md,.txt"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl">
              <Loader2 size={48} className="text-teal-500 animate-spin mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center text-teal-500">
                Executing Atomic Parser
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
           <Button
            onClick={onProcess}
            disabled={isProcessing || !input.trim()}
            className="h-14 px-12 rounded-2xl bg-teal-500 hover:bg-teal-400 text-black font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_50px_rgba(20,184,166,0.2)] transition-all active:scale-95 disabled:opacity-30"
           >
              Compile & Render
           </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: FileCode, label: "Structural Validation", desc: "Verifies block markers and metadata integrity." },
          { icon: Check, label: "Verbatim Matching", desc: "Ensures answer key alignment with original text." },
          { icon: Sparkles, label: "Interactive Preview", desc: "Generates high-fidelity interactive components." }
        ].map((feat, i) => (
          <Card key={i} className="bg-white/[0.01] border-white/5 rounded-2xl p-6 backdrop-blur-xl">
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-teal-500">
              <feat.icon size={18} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{feat.label}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">{feat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
