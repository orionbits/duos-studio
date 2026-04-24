"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/exercises/AudioPlayer";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import { joinClasses } from "@/components/exercises/helpers";
import type { ExerciseProps, TrueFalseData } from "@/components/exercises/types";

export function TrueFalse({
  id,
  metadata,
  data,
  onAnswerChange,
  showFeedback = false
}: ExerciseProps<TrueFalseData>) {
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
        <span className="text-6xl font-black italic tracking-tighter text-white">TRUTH</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          True/False
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
          const selected = answers[questionKey] ?? "";
          const isCorrect = showFeedback && selected === item.answer;

          return (
            <div key={questionKey} className="group rounded-2xl border border-white/5 bg-black/20 p-6 transition-all hover:border-white/10">
              <p className="mb-5 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                <span className="text-teal-500/50 mr-2">{String(index + 1).padStart(2, '0')}</span> {item.question}
              </p>
              <div className="flex gap-4">
                {["richtig", "falsch"].map((option) => {
                  const isOptionSelected = selected === option;
                  return (
                    <label
                      key={option}
                      className={joinClasses(
                        "flex cursor-pointer items-center gap-3 rounded-xl border px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                        showFeedback
                          ? isOptionSelected
                            ? isCorrect
                              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                              : "border-rose-500/50 bg-rose-500/10 text-rose-100"
                            : "border-white/5 bg-black/20 text-slate-500 opacity-50"
                          : isOptionSelected
                            ? "border-teal-500/50 bg-teal-500/10 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                            : "border-white/10 bg-black/40 text-slate-400 hover:border-white/20 hover:text-white"
                      )}
                    >
                      <input
                        type="radio"
                        name={questionKey}
                        value={option}
                        checked={isOptionSelected}
                        onChange={() => handleChange(questionKey, option)}
                        className="sr-only"
                      />
                      <div className={joinClasses(
                        "h-4 w-4 rounded-full border transition-all duration-300",
                        isOptionSelected 
                          ? "border-teal-500 bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]" 
                          : "border-white/20"
                      )} />
                      {option}
                    </label>
                  );
                })}
              </div>
              {(showFeedback || revealed) && (
                <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-teal-400 opacity-80">
                  <span className="uppercase tracking-tighter text-slate-500">Correct:</span> {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
