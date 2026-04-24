import type { ErrorBlock as ErrorBlockData } from "@/lib/schemas";
import { AlertCircle } from "lucide-react";

export function ErrorBlock(block: ErrorBlockData) {
  return (
    <section className="rounded-[2rem] border border-rose-500/10 bg-rose-500/[0.02] p-8 backdrop-blur-3xl shadow-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <AlertCircle size={80} />
      </div>

      <div className="mb-4 flex items-center gap-2 relative z-10">
        <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-400">
          Parser Error
        </span>
        {block.block_id ? (
          <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            ID: {block.block_id}
          </span>
        ) : null}
      </div>

      <p className="mb-6 text-base font-light text-rose-200 leading-relaxed italic relative z-10">
        {block.error}
      </p>

      {block.raw_input ? (
        <div className="relative z-10">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Raw Fragment:</p>
          <pre className="overflow-x-auto rounded-2xl bg-black/40 border border-white/5 p-5 text-xs text-rose-400/70 font-mono leading-relaxed">
            {block.raw_input.slice(0, 300)}
            {block.raw_input.length > 300 ? "..." : ""}
          </pre>
        </div>
      ) : null}
    </section>
  );
}
