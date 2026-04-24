"use client";

import { motion, AnimatePresence } from "motion/react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ErrorBlock } from "@/components/ErrorBlock";
import { Classification } from "@/components/exercises/Classification";
import { FillBlankGrouped } from "@/components/exercises/FillBlankGrouped";
import { FillBlankSimple } from "@/components/exercises/FillBlankSimple";
import { LongForm } from "@/components/exercises/LongForm";
import { Matching } from "@/components/exercises/Matching";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { Ordering } from "@/components/exercises/Ordering";
import { RolePlay } from "@/components/exercises/RolePlay";
import { ShortAnswer } from "@/components/exercises/ShortAnswer";
import { TrueFalse } from "@/components/exercises/TrueFalse";
import { VerbConjugation } from "@/components/exercises/VerbConjugation";
import {
  isFillBlankGrouped,
  type ClassificationExercise,
  type ErrorBlock as ErrorBlockData,
  type FillBlankExercise,
  type LongFormExercise,
  type MatchingExercise,
  type MultipleChoiceExercise,
  type OrderingExercise,
  type ReadingBlock,
  type RolePlayExercise,
  type ShortAnswerExercise,
  type TrueFalseExercise,
  type ValidBlock,
  type VerbConjugationExercise
} from "@/lib/schemas";

export interface RendererProps {
  blocks: ValidBlock[];
  onAnswerChange?: (blockId: string, answers: unknown) => void;
}

type RendererBlock = ValidBlock | ErrorBlockData;

type InternalRendererProps = {
  blocks: RendererBlock[];
  onAnswerChange?: (blockId: string, answers: unknown) => void;
};

function ReadingPassage(block: ReadingBlock) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <span className="text-6xl font-black italic tracking-tighter text-white">READING</span>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-400">
          {block.metadata.id}
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {block.metadata.type}
        </span>
        {block.metadata.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {block.metadata.title ? (
        <h2 className="mb-6 text-3xl font-light text-white tracking-tight relative z-10">
          {block.metadata.title}
        </h2>
      ) : null}

      {block.metadata.audio ? (
        <div className="mb-8 relative z-10">
          <AudioPlayer
            audioTrack={block.metadata.audio_track}
            title={block.metadata.title}
          />
        </div>
      ) : null}

      <div className="rounded-2xl bg-black/40 border border-white/5 p-6 text-base leading-8 whitespace-pre-wrap text-slate-300 font-light relative z-10 selection:bg-teal-500/30">
        {block.raw_content}
      </div>
    </section>
  );
}

function isErrorBlock(block: RendererBlock): block is ErrorBlockData {
  return "error" in block;
}

function renderBlock(
  block: RendererBlock,
  onAnswerChange?: (blockId: string, answers: unknown) => void
) {
  if (isErrorBlock(block)) {
    return <ErrorBlock {...block} />;
  }

  if (block.category === "READING") {
    return <ReadingPassage {...block} />;
  }

  switch (block.metadata.type) {
    case "short_answer":
      {
        const exerciseBlock = block as ShortAnswerExercise;
      return (
        <ShortAnswer
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={exerciseBlock.items}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "fill_blank":
      if (isFillBlankGrouped(block as FillBlankExercise)) {
        const exerciseBlock = block as Extract<FillBlankExercise, { base_text: string }>;
        return (
          <FillBlankGrouped
            id={exerciseBlock.metadata.id}
            metadata={exerciseBlock.metadata}
            base_text={exerciseBlock.base_text}
            blanks={exerciseBlock.blanks}
            original_sentence={exerciseBlock.original_sentence}
            onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
          />
        );
      }

      {
        const exerciseBlock = block as Extract<FillBlankExercise, { items: unknown }>;
      return (
        <FillBlankSimple
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={exerciseBlock.items}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "multiple_choice":
      {
        const exerciseBlock = block as MultipleChoiceExercise;
      return (
        <MultipleChoice
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={exerciseBlock.items}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "matching":
      {
        const exerciseBlock = block as MatchingExercise;
      return (
        <Matching
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={exerciseBlock.items}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "true_false":
      {
        const exerciseBlock = block as TrueFalseExercise;
      return (
        <TrueFalse
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={exerciseBlock.items}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "verb_conjugation":
      {
        const exerciseBlock = block as VerbConjugationExercise;
      return (
        <VerbConjugation
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={exerciseBlock.items}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "ordering":
      {
        const exerciseBlock = block as OrderingExercise;
      return (
        <Ordering
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={{ items: exerciseBlock.items, correct_order: exerciseBlock.correct_order }}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "classification":
      {
        const exerciseBlock = block as ClassificationExercise;
      return (
        <Classification
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={exerciseBlock.items}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "long_form":
      {
        const exerciseBlock = block as LongFormExercise;
      return (
        <LongForm
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={{ prompt: exerciseBlock.prompt, answer: exerciseBlock.answer }}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    case "role_play":
      {
        const exerciseBlock = block as RolePlayExercise;
      return (
        <RolePlay
          id={exerciseBlock.metadata.id}
          metadata={exerciseBlock.metadata}
          data={{ prompt: exerciseBlock.prompt, answer: exerciseBlock.answer }}
          onAnswerChange={(answers) => onAnswerChange?.(exerciseBlock.metadata.id, answers)}
        />
      );
      }
    default:
      return (
        <ErrorBlock
          error="Unsupported block type"
          raw_input=""
        />
      );
  }
}

export function ExerciseRenderer({
  blocks,
  onAnswerChange
}: InternalRendererProps) {
  return (
    <div className="space-y-12">
      <AnimatePresence mode="popLayout">
        {blocks.map((block, index) => (
          <motion.div
            key={isErrorBlock(block) ? `${block.block_id ?? "error"}-${index}` : block.metadata.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {renderBlock(block, onAnswerChange)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
