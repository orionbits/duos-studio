"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/exercises/AudioPlayer";
import { RevealAnswerButton } from "@/components/exercises/RevealAnswerButton";
import { joinClasses } from "@/components/exercises/helpers";
import type { ExerciseProps, OrderingData } from "@/components/exercises/types";

type OrderingEntry = {
  id: string;
  label: string;
  originalPosition: number;
};

function getOrderingLabel(
  item: OrderingData["items"][number],
  index: number
): OrderingEntry {
  if (typeof item === "string") {
    return {
      id: `${index + 1}`,
      label: item,
      originalPosition: index + 1
    };
  }

  return {
    id: `${item.position}`,
    label: item.text,
    originalPosition: item.position
  };
}

export function Ordering({
  id,
  metadata,
  data,
  onAnswerChange,
  showFeedback = false
}: ExerciseProps<OrderingData>) {
  const [items, setItems] = useState<OrderingEntry[]>(() =>
    data.items.map((item, index) => getOrderingLabel(item, index))
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  function publish(nextItems: OrderingEntry[]) {
    setItems(nextItems);
    onAnswerChange?.({
      [id]: nextItems.map((item) => item.originalPosition)
    });
  }

  function moveItem(fromIndex: number, toIndex: number) {
    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    publish(nextItems);
  }

  const isCorrect =
    showFeedback &&
    JSON.stringify(items.map((item) => item.originalPosition)) ===
      JSON.stringify(data.correct_order);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">ORDER</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Ordering
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
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable={!showFeedback}
            onDragStart={() => !showFeedback && setDraggedId(item.id)}
            onDragOver={(event) => !showFeedback && event.preventDefault()}
            onDrop={() => {
              if (showFeedback) return;
              const fromIndex = items.findIndex((entry) => entry.id === draggedId);
              if (fromIndex !== -1 && fromIndex !== index) {
                moveItem(fromIndex, index);
              }
              setDraggedId(null);
            }}
            className={joinClasses(
              "flex items-center justify-between rounded-xl border p-5 transition-all duration-300 cursor-grab active:cursor-grabbing group",
              showFeedback
                ? isCorrect
                  ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "border-rose-500/50 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/30 text-xs font-bold text-teal-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={joinClasses(
                "text-sm font-light transition-colors",
                showFeedback ? "text-white" : "text-slate-400 group-hover:text-white"
              )}>
                {item.label}
              </span>
            </div>
            {!showFeedback && (
              <div className="flex flex-col gap-0.5 opacity-20 group-hover:opacity-50 transition-opacity">
                <div className="h-0.5 w-4 bg-white rounded-full" />
                <div className="h-0.5 w-4 bg-white rounded-full" />
                <div className="h-0.5 w-4 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {(showFeedback || revealed) && (
        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-5">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Correct Order:</span>
           <div className="flex flex-wrap gap-2">
             {data.correct_order.map((pos) => (
               <span key={pos} className="px-2 py-1 rounded bg-teal-500/20 border border-teal-500/30 text-[10px] font-mono text-teal-400">
                 {pos}
               </span>
             ))}
           </div>
        </div>
      )}
    </section>
  );
}
