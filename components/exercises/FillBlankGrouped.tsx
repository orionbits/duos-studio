"use client";

import { Fragment, useMemo, useState } from "react";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import { getAnswerPreview, joinClasses } from "@/components/exercises/helpers";

export interface FillBlankGroupedProps {
  id: string;
  metadata: {
    audio: boolean;
    audio_track: string;
    tags: string[];
    instruction?: string;
  };
  base_text: string;
  blanks: Array<{
    position: number;
    answer: string | string[];
  }>;
  original_sentence?: string;
  onAnswerChange?: (answers: Record<number, string>) => void;
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function matchesAnswer(userAnswer: string, correctAnswer: string | string[]) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);

  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some(
      (candidate) => normalizeAnswer(candidate) === normalizedUserAnswer
    );
  }

  return normalizeAnswer(correctAnswer) === normalizedUserAnswer;
}

function renderAnswerHint(answer: string | string[]) {
  if (!Array.isArray(answer)) {
    return null;
  }

  return `Valid answers: ${answer.join(", ")}`;
}

export function FillBlankGrouped({
  id,
  metadata,
  base_text,
  blanks,
  original_sentence,
  onAnswerChange
}: FillBlankGroupedProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sentenceTemplate = original_sentence || base_text;

  const sortedBlanks = useMemo(
    () => [...blanks].sort((left, right) => left.position - right.position),
    [blanks]
  );

  function handleChange(position: number, value: string) {
    const nextAnswers = {
      ...answers,
      [position]: value
    };

    setAnswers(nextAnswers);
    onAnswerChange?.(nextAnswers);
  }

  function renderInlineSentence() {
    const segments = sentenceTemplate.split("___");

    if (segments.length <= 1) {
      return null;
    }

    return (
      <p className="text-base leading-relaxed text-slate-300 font-light">
        {segments.map((segment, index) => {
          const blank = sortedBlanks[index];

          return (
            <Fragment key={`${id}-segment-${index}`}>
              {segment}
              {blank ? renderInput(blank.position, blank.answer) : null}
            </Fragment>
          );
        })}
      </p>
    );
  }

  function renderInput(position: number, answer: string | string[]) {
    const value = answers[position] ?? "";
    const isCorrect = hasSubmitted && matchesAnswer(value, answer);
    const isIncorrect = (hasSubmitted || revealed) && value.trim() !== "" && !isCorrect;

    return (
      <span className="mx-1 inline-flex flex-col items-center align-middle group/input relative">
        <input
          id={`${id}-blank-${position}`}
          value={value}
          onChange={(event) => handleChange(position, event.target.value)}
          className={joinClasses(
            "min-w-[100px] border-b-2 bg-transparent px-2 py-0.5 text-sm font-medium outline-none transition-all duration-300",
            hasSubmitted
              ? isCorrect
                ? "border-emerald-500/50 text-emerald-400"
                : "border-rose-500/50 text-rose-400"
              : "border-white/20 text-teal-50 focus:border-teal-500/50"
          )}
          aria-label={`Blank ${position}`}
          placeholder="..."
        />
        {(hasSubmitted || revealed) && (
          <div className="absolute top-full left-0 mt-1 whitespace-nowrap z-20">
             {revealed ? (
               <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded shadow-xl backdrop-blur-md">
                 {getAnswerPreview(answer)}
               </span>
             ) : hasSubmitted && !isCorrect ? (
               <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded shadow-xl backdrop-blur-md">
                 Incorrect
               </span>
             ) : null}
          </div>
        )}
      </span>
    );
  }

  const inlineSentence = renderInlineSentence();

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">BLANKS</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Grouped
        </span>
      </div>

      {metadata.instruction ? (
        <p className="mb-8 text-lg font-light text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-teal-500/30 pl-4">
          {metadata.instruction}
        </p>
      ) : null}

      <div className="rounded-3xl bg-black/40 border border-white/5 p-8 relative z-10 shadow-inner">
        {inlineSentence ? (
          inlineSentence
        ) : (
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-slate-300 font-light">{sentenceTemplate}</p>
            <div className="grid gap-4">
              {sortedBlanks.map((blank, index) => (
                <div key={`${id}-blank-${blank.position}-${index}`} className="flex flex-wrap items-center gap-4">
                  <label
                    htmlFor={`${id}-blank-${blank.position}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500"
                  >
                    Blank {String(blank.position).padStart(2, '0')}
                  </label>
                  {renderInput(blank.position, blank.answer)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 relative z-10">
        <button
          type="button"
          onClick={() => setHasSubmitted(true)}
          className="rounded-full bg-indigo-600 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-indigo-500 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          Check answers
        </button>
        <RevealAnswerButton revealed={revealed} onToggle={() => setRevealed((value) => !value)} />
        {metadata.audio && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Track: {metadata.audio_track}</span>
          </div>
        )}
      </div>
    </section>
  );
}
