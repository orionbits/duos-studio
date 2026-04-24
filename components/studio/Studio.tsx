"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Play, History, Settings, Sparkles, AlertTriangle } from "lucide-react";
import { parseTaggedInput } from "@/lib/parser";
import { ExerciseRenderer } from "@/components/ExerciseRenderer";
import {
  errorBlockSchema,
  validBlockSchema,
  type ErrorBlock,
  type ValidBlock
} from "@/lib/schemas";
import { ImportWorkspace } from "./ImportWorkspace";
import { HistoryView } from "./HistoryView";

export type ParsedState = Array<ValidBlock | ErrorBlock>;

export function Studio() {
  const [input, setInput] = useState("");
  const [parsedBlocks, setParsedBlocks] = useState<ParsedState>([]);
  const [activeTab, setActiveTab] = useState("import");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("duos-studio-buffer");
    if (saved) {
      setInput(saved);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("duos-studio-buffer", input);
  }, [input]);

  function validateBlocks(result: ParsedState, rawSource: string) {
    return result.map((block) => {
      if ("error" in block) {
        const parsedError = errorBlockSchema.safeParse(block);
        return parsedError.success
          ? parsedError.data
          : {
              error: parsedError.error.issues[0]?.message ?? "Invalid error block",
              raw_input: rawSource.slice(0, 500)
            };
      }

      const parsedValidBlock = validBlockSchema.safeParse(block);
      return parsedValidBlock.success
        ? parsedValidBlock.data
        : {
            error: parsedValidBlock.error.issues[0]?.message ?? "Invalid block",
            raw_input: JSON.stringify(block).slice(0, 500)
          };
    });
  }

  const handleProcess = () => {
    if (!input.trim()) {
      toast.error("Please provide some input first.");
      return;
    }

    setIsProcessing(true);
    // Small timeout to show animation
    setTimeout(() => {
      try {
        const result = parseTaggedInput(input);
        const validatedBlocks = validateBlocks(result, input);

        setParsedBlocks(validatedBlocks);
        const errorCount = validatedBlocks.filter((b) => "error" in b).length;
        const validCount = validatedBlocks.length - errorCount;

        if (errorCount > 0) {
          toast.warning(`Processed with ${errorCount} errors. Check the preview for details.`);
        } else {
          toast.success(`Successfully processed ${validCount} blocks.`);
        }
        
        setActiveTab("preview");
      } catch (err) {
        console.error("Parsing failed:", err);
        toast.error("A critical error occurred during parsing. Check console for details.");
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleSave = () => {
    if (!input.trim() || parsedBlocks.length === 0) {
      toast.error("Process your content first before saving to library.");
      return;
    }

    const firstValidBlock = parsedBlocks.find((b): b is ValidBlock => !("error" in b));
    const title = firstValidBlock 
      ? (firstValidBlock.category === "READING" && firstValidBlock.metadata.title 
          ? firstValidBlock.metadata.title 
          : firstValidBlock.metadata.id)
      : "Tagged import";

    const newItem = {
      id: crypto.randomUUID(),
      title,
      content: input,
      timestamp: Date.now()
    };

    const saved = localStorage.getItem("duos-studio-history");
    const history = saved ? JSON.parse(saved) : [];
    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    
    localStorage.setItem("duos-studio-history", JSON.stringify(updatedHistory));
    toast.success("Document successfully saved to project library.");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <TabsList className="bg-white/5 border border-white/10 rounded-2xl p-1 h-auto flex-wrap">
          <TabsTrigger 
            value="import" 
            className="data-active:bg-teal-500 data-active:text-black rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all"
          >
            <div className="flex items-center gap-2">
              <FileText size={14} />
              Importer
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            className="data-active:bg-teal-500 data-active:text-black rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all"
          >
            <div className="flex items-center gap-2">
              <Play size={14} />
              Renderer
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-active:bg-teal-500 data-active:text-black rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all"
          >
            <div className="flex items-center gap-2">
              <History size={14} />
              Library
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3">
           <Button
            variant="outline"
            onClick={handleSave}
            disabled={parsedBlocks.length === 0}
            className="h-12 px-6 rounded-xl border-white/5 bg-white/5 text-slate-400 hover:text-white uppercase tracking-widest text-[10px] font-bold"
           >
             Snapshot
           </Button>
           <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="h-12 px-8 bg-teal-500 hover:bg-teal-400 text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(20,184,166,0.2)] active:scale-95 flex items-center gap-2"
           >
             {isProcessing ? "Processing..." : "Compile Data"}
             <Sparkles size={16} />
           </Button>
        </div>
      </div>

      <TabsContent value="import" className="mt-0 focus-visible:outline-none">
        <ImportWorkspace 
          input={input} 
          setInput={setInput} 
          onProcess={handleProcess} 
          isProcessing={isProcessing}
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-0 focus-visible:outline-none">
        <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] p-8 min-h-[600px] backdrop-blur-3xl">
          {parsedBlocks.length === 0 ? (
            <div className="h-[500px] flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 mb-6 flex items-center justify-center animate-spin-slow">
                <Play size={32} />
              </div>
              <h3 className="text-xl font-light text-white mb-2">Awaiting Source Logic</h3>
              <p className="text-xs uppercase tracking-widest text-slate-500 max-w-xs">
                Compile your tagged content in the importer tab to see real-time interaction previews.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
               <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                <div>
                  <h2 className="text-xl font-light text-white">Execution Result</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {parsedBlocks.filter(b => !("error" in b)).length} Atomic Blocks Validated
                  </p>
                </div>
                {parsedBlocks.some(b => "error" in b) && (
                   <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
                     <AlertTriangle size={14} className="text-rose-400" />
                     <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                       {parsedBlocks.filter(b => "error" in b).length} Parsing Failures
                     </span>
                   </div>
                )}
              </div>
              <ExerciseRenderer blocks={parsedBlocks} />
            </div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="history" className="mt-0 focus-visible:outline-none">
        <HistoryView onRestore={(content) => {
          setInput(content);
          setActiveTab("import");
          toast.success("Content restored from library.");
        }} />
      </TabsContent>
    </Tabs>
  );
}
