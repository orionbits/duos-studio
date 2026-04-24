import { z } from "zod";

export const baseMetadataSchema = z.object({
  id: z.string().min(1, "ID is required"),
  audio: z.boolean(),
  audio_track: z.string(),
  tags: z.array(z.string())
});

export const readingMetadataSchema = baseMetadataSchema.extend({
  type: z.enum([
    "dialogue",
    "monologue",
    "passage",
    "transcript",
    "cultural_note",
    "grammar_table",
    "vocabulary_list"
  ]),
  title: z.string().optional()
});

export const readingBlockSchema = z.object({
  category: z.literal("READING"),
  metadata: readingMetadataSchema,
  raw_content: z.string()
});

export const shortAnswerItemSchema = z.object({
  question: z.string(),
  answer: z.string()
});

export const shortAnswerExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("short_answer"),
    instruction: z.string().optional()
  }),
  items: z.array(shortAnswerItemSchema).min(1, "At least one Q/A pair required")
});

export const fillBlankItemSchema = z.object({
  question: z.string(),
  answer: z.union([z.string(), z.array(z.string())])
});

export const fillBlankBlankSchema = z.object({
  position: z.number(),
  answer: z.union([z.string(), z.array(z.string())])
});

export const fillBlankGroupedSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("fill_blank"),
    instruction: z.string().optional()
  }),
  base_text: z.string(),
  blanks: z.array(fillBlankBlankSchema).min(1),
  original_sentence: z.string().optional()
});

export const fillBlankExerciseSchema = z.union([
  z.object({
    category: z.literal("EXERCISE"),
    metadata: baseMetadataSchema.extend({
      type: z.literal("fill_blank"),
      instruction: z.string().optional()
    }),
    items: z.array(fillBlankItemSchema).min(1)
  }),
  fillBlankGroupedSchema
]);

export const matchingItemSchema = z.object({
  left: z.string(),
  right: z.string()
});

export const matchingExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("matching"),
    instruction: z.string().optional()
  }),
  items: z.array(matchingItemSchema).min(1)
});

export const classificationItemSchema = z.object({
  item: z.string(),
  answer: z.string()
});

export const classificationExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("classification"),
    instruction: z.string().optional()
  }),
  items: z.array(classificationItemSchema).min(1)
});

export const trueFalseItemSchema = z.object({
  question: z.string(),
  answer: z.enum(["richtig", "falsch"])
});

export const trueFalseExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("true_false"),
    instruction: z.string().optional()
  }),
  items: z.array(trueFalseItemSchema).min(1)
});

export const verbConjugationItemSchema = z.object({
  question: z.string(),
  answer: z.string()
});

export const verbConjugationExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("verb_conjugation"),
    instruction: z.string().optional()
  }),
  items: z.array(verbConjugationItemSchema).min(1)
});

export const longFormExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("long_form"),
    instruction: z.string().optional()
  }),
  prompt: z.string(),
  answer: z.string()
});

export const rolePlayExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("role_play"),
    instruction: z.string().optional()
  }),
  prompt: z.string(),
  answer: z.string().nullable()
});

export const orderingItemSchema = z.union([
  z.string(),
  z.object({ position: z.number(), text: z.string() })
]);

export const orderingExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("ordering"),
    instruction: z.string().optional()
  }),
  items: z.array(orderingItemSchema),
  correct_order: z.array(z.number())
});

export const multipleChoiceItemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  answer: z.union([z.string(), z.array(z.string())])
});

export const multipleChoiceExerciseSchema = z.object({
  category: z.literal("EXERCISE"),
  metadata: baseMetadataSchema.extend({
    type: z.literal("multiple_choice"),
    instruction: z.string().optional()
  }),
  items: z.array(multipleChoiceItemSchema).min(1)
});

export const validBlockSchema = z.union([
  readingBlockSchema,
  shortAnswerExerciseSchema,
  fillBlankExerciseSchema,
  matchingExerciseSchema,
  classificationExerciseSchema,
  trueFalseExerciseSchema,
  verbConjugationExerciseSchema,
  longFormExerciseSchema,
  rolePlayExerciseSchema,
  orderingExerciseSchema,
  multipleChoiceExerciseSchema
]);

export const errorBlockSchema = z.object({
  error: z.string(),
  block_id: z.string().optional(),
  raw_input: z.string().optional()
});

export type BaseMetadata = z.infer<typeof baseMetadataSchema>;
export type ReadingMetadata = z.infer<typeof readingMetadataSchema>;
export type ReadingBlock = z.infer<typeof readingBlockSchema>;
export type ShortAnswerItem = z.infer<typeof shortAnswerItemSchema>;
export type ShortAnswerExercise = z.infer<typeof shortAnswerExerciseSchema>;
export type FillBlankItem = z.infer<typeof fillBlankItemSchema>;
export type FillBlankBlank = z.infer<typeof fillBlankBlankSchema>;
export type FillBlankGrouped = z.infer<typeof fillBlankGroupedSchema>;
export type FillBlankExercise = z.infer<typeof fillBlankExerciseSchema>;
export type MatchingItem = z.infer<typeof matchingItemSchema>;
export type MatchingExercise = z.infer<typeof matchingExerciseSchema>;
export type ClassificationItem = z.infer<typeof classificationItemSchema>;
export type ClassificationExercise = z.infer<typeof classificationExerciseSchema>;
export type TrueFalseItem = z.infer<typeof trueFalseItemSchema>;
export type TrueFalseExercise = z.infer<typeof trueFalseExerciseSchema>;
export type VerbConjugationItem = z.infer<typeof verbConjugationItemSchema>;
export type VerbConjugationExercise = z.infer<typeof verbConjugationExerciseSchema>;
export type LongFormExercise = z.infer<typeof longFormExerciseSchema>;
export type RolePlayExercise = z.infer<typeof rolePlayExerciseSchema>;
export type OrderingItem = z.infer<typeof orderingItemSchema>;
export type OrderingExercise = z.infer<typeof orderingExerciseSchema>;
export type MultipleChoiceItem = z.infer<typeof multipleChoiceItemSchema>;
export type MultipleChoiceExercise = z.infer<typeof multipleChoiceExerciseSchema>;
export type ValidBlock = z.infer<typeof validBlockSchema>;
export type ErrorBlock = z.infer<typeof errorBlockSchema>;

export function validateAudioMetadata(metadata: {
  audio: boolean;
  audio_track: string;
}): boolean {
  if (metadata.audio && (!metadata.audio_track || metadata.audio_track === "")) {
    return false;
  }
  if (!metadata.audio && metadata.audio_track !== "") {
    return false;
  }
  return true;
}

export function validateBlock(block: unknown): ValidBlock {
  return validBlockSchema.parse(block);
}

export function isFillBlankGrouped(
  block: FillBlankExercise
): block is z.infer<typeof fillBlankGroupedSchema> {
  return "base_text" in block && "blanks" in block;
}

export function isMultipleChoiceWithArrayAnswer(
  item: z.infer<typeof multipleChoiceItemSchema>
): boolean {
  return Array.isArray(item.answer);
}
