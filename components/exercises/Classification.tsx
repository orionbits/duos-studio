"use client";

import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/exercises/AudioPlayer";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import { joinClasses, normalizeText } from "@/components/exercises/helpers";
import type { ExerciseProps, ClassificationData } from "@/components/exercises/types";

export function Classification({
  id,
  metadata,
  data,
  onAnswerChange,
  showFeedback = false
}: ExerciseProps<ClassificationData>) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [draggedItemKey, setDraggedItemKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const categories = useMemo(
    () => Array.from(new Set(data.map((item) => item.answer))),
    [data]
  );

  function assignItem(itemKey: string, category: string) {
    const nextAssignments = { ...assignments, [itemKey]: category };
    setAssignments(nextAssignments);
    onAnswerChange?.(nextAssignments);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">GROUP</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Classification
        </span>
      </div>

      {metadata.instruction ? (
        <p className="mb-8 text-lg font-light text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-teal-500/30 pl-4">
          {metadata.instruction}
        </p>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-3 relative z-10 p-6 rounded-2xl bg-black/40 border border-white/5">
        {data.map((item, index) => {
          const itemKey = `${id}-${index + 1}`;
          const isAssigned = !!assignments[itemKey];

          if (isAssigned) return null;

          return (
            <button
              key={itemKey}
              type="button"
              draggable
              onDragStart={() => setDraggedItemKey(itemKey)}
              className="rounded-xl border border-white/10 bg-black/40 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-300 transition hover:border-teal-500/50 hover:text-white hover:bg-black/60 shadow-lg cursor-grab active:cursor-grabbing"
            >
              {item.item}
            </button>
          );
        })}
        {data.every((item, i) => assignments[`${id}-${i + 1}`]) && data.length > 0 && (
           <p className="text-[10px] text-slate-500 uppercase tracking-widest italic">All items assigned</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 relative z-10">
        {categories.map((category) => (
          <div
            key={category}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedItemKey) {
                assignItem(draggedItemKey, category);
                setDraggedItemKey(null);
              }
            }}
            className="rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20"
          >
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-widest text-teal-500/70">{category}</h3>
            <div className="space-y-3">
              {data.map((item, index) => {
                const itemKey = `${id}-${index + 1}`;
                const assignedCategory = assignments[itemKey];

                if (assignedCategory !== category) {
                  return null;
                }

                const isCorrect =
                  showFeedback && normalizeText(item.answer) === normalizeText(category);

                return (
                  <div
                    key={itemKey}
                    draggable
                    onDragStart={() => setDraggedItemKey(itemKey)}
                    className={joinClasses(
                      "rounded-xl border p-4 text-sm font-light transition-all duration-300 cursor-grab active:cursor-grabbing",
                      showFeedback
                        ? isCorrect
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                          : "border-rose-500/50 bg-rose-500/10 text-rose-100"
                        : "border-white/10 bg-black/60 text-white"
                    )}
                  >
                    {item.item}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4 relative z-10">
        <RevealAnswerButton revealed={revealed} onToggle={() => setRevealed((value) => !value)} />
      </div>

      {revealed && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 relative z-10">
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Correct Classification:</p>
          <div className="grid gap-2 text-xs font-mono">
            {data.map((item, index) => (
              <div key={`${id}-answer-${index}`} className="flex items-center gap-2 text-slate-400">
                <span className="text-teal-500">→</span>
                <span className="text-white">{item.item}</span>
                <span className="opacity-50">:</span>
                <span className="text-teal-400">{item.answer}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
