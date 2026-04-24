"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Eye, Trash2, Calendar, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

interface HistoryViewProps {
  onRestore: (content: string) => void;
}

export function HistoryView({ onRestore }: HistoryViewProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("duos-studio-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("duos-studio-history");
    setHistory([]);
    toast.info("History cleared");
  };

  const deleteItem = (id: string) => {
    const next = history.filter(item => item.id !== id);
    setHistory(next);
    localStorage.setItem("duos-studio-history", JSON.stringify(next));
    toast.success("Item removed from library");
  };

  if (history.length === 0) {
    return (
      <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] p-12 min-h-[500px] backdrop-blur-3xl flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 opacity-40">
          <History size={32} />
        </div>
        <h3 className="text-xl font-light text-white mb-2">Library Empty</h3>
        <p className="text-xs uppercase tracking-widest text-slate-500 max-w-xs leading-relaxed">
          Processed imports will appear here for quick access and cross-document validation.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-xl font-light text-white tracking-tight">Project Library</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {history.length} Sessions Documented
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearHistory}
          className="rounded-xl border-white/5 bg-white/5 text-slate-400 hover:text-red-400 text-[10px] uppercase font-bold tracking-widest"
        >
          Flush All Records
        </Button>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <Card 
            key={item.id} 
            className="group relative bg-white/[0.02] border-white/5 hover:border-teal-500/30 rounded-3xl p-6 backdrop-blur-3xl transition-all duration-500"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-black transition-colors duration-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-white group-hover:text-teal-400 transition-colors uppercase tracking-tight">
                    {item.title || "Untitled Session"}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {format(item.timestamp, "MMM d, yyyy HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <ExternalLink size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {Math.round(item.content.length / 1024)} KB Source
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  onClick={() => onRestore(item.content)}
                  className="rounded-xl border-white/10 bg-white/5 text-teal-400 hover:bg-teal-500 hover:text-black font-bold uppercase tracking-[0.2em] text-[10px] px-6"
                >
                  Load Logic
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                  className="rounded-xl border-white/5 bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
