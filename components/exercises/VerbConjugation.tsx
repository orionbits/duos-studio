"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/exercises/AudioPlayer";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import { isCorrectStringAnswer, joinClasses } from "@/components/exercises/helpers";
import type { ExerciseProps, VerbConjugationData } from "@/components/exercises/types";

export function VerbConjugation({
  id,
  metadata,
  data,
  onAnswerChange,
  showFeedback = false
}: ExerciseProps<VerbConjugationData>) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  function handleChange(questionKey: string, value: string) {
    const nextAnswers = { ...answers, [questionKey]: value };
    setAnswers(nextAnswers);
    onAnswerChange?.(nextAnswers);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">VERBS</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Conjugation
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

      <div className="space-y-6 relative z-10">
        {data.map((item, index) => {
          const questionKey = `${id}-${index + 1}`;
          const value = answers[questionKey] ?? "";
          const isCorrect = showFeedback && isCorrectStringAnswer(value, item.answer);

          return (
            <div key={questionKey} className="group rounded-2xl border border-white/5 bg-black/20 p-6 transition-all hover:border-white/10">
              <p className="mb-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                <span className="text-teal-500/50 mr-2">{String(index + 1).padStart(2, '0')}</span> {item.question}
              </p>
              <input
                value={value}
                onChange={(event) => handleChange(questionKey, event.target.value)}
                className={joinClasses(
                  "w-full rounded-xl border px-5 py-4 text-sm outline-none transition-all duration-300 font-mono",
                  showFeedback
                    ? isCorrect
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border-rose-500/50 bg-rose-500/10 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                    : "border-white/10 bg-black/40 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                )}
                placeholder="Type the conjugated form..."
              />
              {(showFeedback || revealed) && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expected:</span>
                  <p className="text-xs font-mono text-teal-400">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
