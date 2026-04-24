"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/exercises/AudioPlayer";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import type { ExerciseProps, RolePlayData } from "@/components/exercises/types";

export function RolePlay({
  id,
  metadata,
  data,
  onAnswerChange,
  showFeedback = false
}: ExerciseProps<RolePlayData>) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);

  function handleChange(value: string) {
    setAnswer(value);
    onAnswerChange?.({ [id]: value });
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">REHEARSE</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Role Play
        </span>
      </div>

      {metadata.instruction ? (
        <p className="mb-8 text-lg font-light text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-teal-500/30 pl-4">
          {metadata.instruction}
        </p>
      ) : null}

      {metadata.audio ? (
        <div className="mb-8 relative z-10">
          <AudioPlayer audio_track={metadata.audio_track} />
        </div>
      ) : null}

      <div className="mb-8 p-6 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-slate-200 font-light leading-relaxed italic relative z-10">
        {data.prompt}
      </div>

      <div className="relative z-10">
        <textarea
          value={answer}
          onChange={(event) => handleChange(event.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light"
          placeholder="Compose your dialogue here..."
        />
      </div>

      <div className="mt-8 flex items-center gap-4 relative z-10">
        <RevealAnswerButton revealed={revealed} onToggle={() => setRevealed((value) => !value)} />
      </div>

      {(showFeedback || revealed) && data.answer && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 relative z-10 animate-in fade-in slide-in-from-bottom-2">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Suggested Model:</p>
          <div className="text-sm font-light text-teal-400 leading-relaxed">
            {data.answer}
          </div>
        </div>
      )}
    </section>
  );
}
