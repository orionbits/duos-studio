"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/exercises/AudioPlayer";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import { joinClasses } from "@/components/exercises/helpers";
import type { ExerciseProps, MultipleChoiceData } from "@/components/exercises/types";
import { isMultipleChoiceWithArrayAnswer } from "@/lib/schemas";

export function MultipleChoice({
  id,
  metadata,
  data,
  onAnswerChange,
  showFeedback = false
}: ExerciseProps<MultipleChoiceData>) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [revealed, setRevealed] = useState(false);

  function handleSingleChange(questionKey: string, value: string) {
    const nextAnswers = { ...answers, [questionKey]: value };
    setAnswers(nextAnswers);
    onAnswerChange?.(nextAnswers);
  }

  function handleMultiChange(questionKey: string, value: string, checked: boolean) {
    const current = Array.isArray(answers[questionKey]) ? answers[questionKey] : [];
    const nextValue = checked
      ? [...current, value]
      : current.filter((entry) => entry !== value);
    const nextAnswers = { ...answers, [questionKey]: nextValue };
    setAnswers(nextAnswers);
    onAnswerChange?.(nextAnswers);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">CHOICE</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {metadata.type}
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

      <div className="space-y-8 relative z-10">
        {data.map((item, index) => {
          const questionKey = `${id}-${index + 1}`;
          const multiple = isMultipleChoiceWithArrayAnswer(item);
          const selected = answers[questionKey];
          const isCorrect = showFeedback
            ? multiple
              ? JSON.stringify([...(Array.isArray(selected) ? selected : [])].sort()) ===
                JSON.stringify([...(Array.isArray(item.answer) ? item.answer : [])].sort())
              : selected === item.answer
            : false;

          return (
            <div key={questionKey} className="group">
              <p className="mb-6 text-base font-medium text-slate-300 group-hover:text-white transition-colors">
                <span className="text-teal-500/50 mr-2">{String(index + 1).padStart(2, '0')}</span> {item.question}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {item.options.map((option) => {
                  const optionKey = `${questionKey}-${option}`;
                  const optionValue = option.split(")")[0]?.trim() ?? option;
                  const isOptionSelected = multiple
                    ? Array.isArray(selected) && selected.includes(optionValue)
                    : selected === optionValue;

                  return (
                    <label
                      key={optionKey}
                      className={joinClasses(
                        "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-300 group/label",
                        showFeedback
                          ? isCorrect && isOptionSelected
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                            : !isCorrect && isOptionSelected
                              ? "border-rose-500/50 bg-rose-500/10 text-rose-100"
                              : "border-white/5 bg-black/20 text-slate-400 opacity-50"
                          : isOptionSelected
                            ? "border-teal-500/50 bg-teal-500/10 text-teal-50 ring-1 ring-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                            : "border-white/10 bg-black/40 text-slate-400 hover:border-white/20 hover:bg-black/60"
                      )}
                    >
                      <div className={joinClasses(
                        "flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-300",
                        multiple ? "rounded-md" : "rounded-full",
                        isOptionSelected 
                          ? "border-teal-500 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
                          : "border-white/20 bg-transparent group-hover/label:border-white/40"
                      )}>
                        {isOptionSelected && (
                          <div className={joinClasses(
                            "bg-black",
                             multiple ? "h-2 w-2 rounded-sm" : "h-2 w-2 rounded-full"
                          )} />
                        )}
                      </div>
                      <input
                        type={multiple ? "checkbox" : "radio"}
                        name={questionKey}
                        value={optionValue}
                        checked={isOptionSelected}
                        onChange={(event) =>
                          multiple
                            ? handleMultiChange(questionKey, optionValue, event.target.checked)
                            : handleSingleChange(questionKey, optionValue)
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-light leading-tight">{option}</span>
                    </label>
                  );
                })}
              </div>
              {(showFeedback || revealed) && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Solution:</span>
                  <p className="text-xs font-mono text-teal-400">
                    {Array.isArray(item.answer) ? item.answer.join(", ") : item.answer}
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
