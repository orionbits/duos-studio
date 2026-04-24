"use client";

import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/exercises/AudioPlayer";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import { joinClasses, normalizeText } from "@/components/exercises/helpers";
import type { ExerciseProps, MatchingData } from "@/components/exercises/types";

export function Matching({
  id,
  metadata,
  data,
  onAnswerChange,
  showFeedback = false
}: ExerciseProps<MatchingData>) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const rightOptions = useMemo(
    () => Array.from(new Set(data.map((item) => item.right))),
    [data]
  );

  function handleChange(itemKey: string, value: string) {
    const nextAnswers = { ...answers, [itemKey]: value };
    setAnswers(nextAnswers);
    onAnswerChange?.(nextAnswers);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">MATCH</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Matching
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

      <div className="mb-8 relative z-10">
        <RevealAnswerButton revealed={revealed} onToggle={() => setRevealed((value) => !value)} />
      </div>

      <div className="space-y-4 relative z-10">
        {data.map((item, index) => {
          const itemKey = `${id}-${index + 1}`;
          const selected = answers[itemKey] ?? "";
          const isCorrect =
            showFeedback && normalizeText(selected) === normalizeText(item.right);

          return (
            <div key={itemKey} className="group grid gap-4 rounded-2xl border border-white/5 bg-black/20 p-6 transition-all hover:border-white/10 md:grid-cols-[1fr_auto_1.2fr] items-center">
              <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.left}</div>
              <div className="hidden md:block">
                <div className="h-px w-8 bg-white/10 group-hover:bg-teal-500/30 transition-colors" />
              </div>
              <div>
                <select
                  value={selected}
                  onChange={(event) => handleChange(itemKey, event.target.value)}
                  className={joinClasses(
                    "w-full rounded-xl border px-5 py-4 text-sm outline-none transition-all duration-300 appearance-none bg-black/40 cursor-pointer",
                    showFeedback
                      ? isCorrect
                        ? "border-emerald-500/50 text-emerald-100 bg-emerald-500/10"
                        : "border-rose-500/50 text-rose-100 bg-rose-500/10"
                      : "border-white/10 text-slate-300 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  )}
                >
                  <option value="" className="bg-slate-900">Choose response...</option>
                  {rightOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-900 text-white">
                      {option}
                    </option>
                  ))}
                </select>
                {(showFeedback || revealed) && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-teal-400 opacity-80">
                    <span className="uppercase tracking-tighter text-slate-500">Match:</span> {item.right}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
