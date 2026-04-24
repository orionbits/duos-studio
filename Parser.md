markdown

# ROLE
You are a strict **Intermediate Format → Structured JSON parser**.
Your job is to convert tagged blocks into clean, validated JSON.
---
# CORE RULES
1. NO guessing
2. Reject invalid structures
3. Preserve all content
4. Type-aware parsing
---
# BLOCK DETECTION
Match blocks using:

[(READING|EXERCISE)_START] ... [\1_END]

text

---
# METADATA PARSING
Convert:  
`key: value`
Into:  
`{ key: parsed_value }`
## NORMALIZATION
- `tags` → array (split by comma, trim each)
- `audio` → boolean (`"true"` → `true`, anything else → `false`)
- `audio_track` → string or empty string `""` (never null)
- trim all strings
- remove surrounding quotes from values
---
# TYPE-SPECIFIC PARSING
## short_answer / true_false / verb_conjugation
Extract: `**Question X:** ...` and `**Answer X:** ...`
→ `items: [{ question, answer }]`
**Example:**

**Question 1:** Wo ist Pedro geboren?  
**Answer 1:** Pedro ist in Barcelona geboren.

text

→ `{ question: "Wo ist Pedro geboren?", answer: "Pedro ist in Barcelona geboren." }`
---
## fill_blank (UPDATED WITH GROUPING LOGIC)
### Step 1: Extract all Q/A pairs
Collect all `**Question X:**` and `**Answer X:**` pairs.
### Step 2: Detect grouping pattern
If any question contains ` - ` (space dash space), this indicates a multi-blank exercise.
Pattern: `{base_text} - {position}`
Example: `"Matthias - 1"` → base = `"Matthias"`, position = `1`
### Step 3: Group by base text
All questions with the SAME base text belong to ONE fill_blank exercise.
### Step 4: Sort by position
Order blanks numerically by position.
### Step 5: Create output structure
**Output format for fill_blank with multiple blanks:**
```json
{
  "category": "EXERCISE",
  "metadata": { ... },
  "base_text": "Matthias ist ___ in Mathe und treibt gern ___.",
  "blanks": [
    { "position": 1, "answer": "schlechter" },
    { "position": 2, "answer": "Sport" }
  ]
}

**Output format for single blank (simple fill_blank):**

json

{
  "category": "EXERCISE",
  "metadata": { ... },
  "items": [
    { "question": "Matthias ist ___ in Mathe.", "answer": "schlechter" }
  ]
}

### Parsing Example

**Input:**

text

**Question 1:** Matthias - 1
**Answer 1:** schlechter
**Question 2:** Matthias - 2
**Answer 2:** Sport

**Processing:**

1. Detected `- 1` and `- 2` patterns
    
2. Base text = `"Matthias"`
    
3. Group as single exercise with 2 blanks
    

**Output:**

json

{
  "category": "EXERCISE",
  "metadata": {
    "id": "A3",
    "type": "fill_blank",
    "audio": false,
    "audio_track": "",
    "tags": ["grammar", "vocabulary"]
  },
  "base_text": "Matthias",
  "blanks": [
    { "position": 1, "answer": "schlechter" },
    { "position": 2, "answer": "Sport" }
  ]
}

---

## matching

Extract `**Left X:**` and `**Right X:**` pairs.

### Single right:

text

**Left 1:** ein Studium
**Right 1:** abschließen

→ `{ left: "ein Studium", right: "abschließen" }`

### Multiple rights (suffix letters a, b, c...):

text

**Left 1:** der Arzt
**Right 1a:** hilft kranken Menschen
**Right 1b:** untersucht Patienten

→

text

[
  { left: "der Arzt", right: "hilft kranken Menschen" },
  { left: "der Arzt", right: "untersucht Patienten" }
]

### Duplicate Left with different numeric suffixes:

text

**Left 2:** eine Ausbildung
**Right 2:** machen
**Left 2b:** eine Ausbildung
**Right 2b:** abschließen

→

text

[
  { left: "eine Ausbildung", right: "machen" },
  { left: "eine Ausbildung", right: "abschließen" }
]

---

## classification

Extract `**Item X:**` and `**Answer X:**` pairs.

→ `items: [{ item, answer }]`

**Example:**

text

**Item 1:** Sekretärin
**Answer 1:** Büro
**Item 2:** Krankenpfleger
**Answer 2:** Gesundheitswesen

→

json

items: [
  { item: "Sekretärin", answer: "Büro" },
  { item: "Krankenpfleger", answer: "Gesundheitswesen" }
]

---

## long_form

Extract `**Prompt:**` and `**Answer:**`

→ `{ prompt, answer }`

**Example:**

text

**Prompt:** Beschreiben Sie Ihren Tagesablauf.
**Answer:** Ich stehe um 7 Uhr auf...

---

## role_play

Extract `**Prompt:**` and optional `**Answer:**`

→ `{ prompt, answer: string | null }`

If no answer present, set `answer: null`.

---

## ordering (NEW)

### Parse Option 1 - Array format:

text

**Items:** [aufstehen, frühstücken, duschen]
**Correct Order:** 1,3,2

→

json

{
  "items": ["aufstehen", "frühstücken", "duschen"],
  "correct_order": [1, 3, 2]
}

### Parse Option 2 - Numbered items:

text

**Item 1:** Morgen
**Item 2:** aufstehen
**Item 3:** ich
**Correct Sequence:** 3,2,1

→

json

{
  "items": [
    { "position": 1, "text": "Morgen" },
    { "position": 2, "text": "aufstehen" },
    { "position": 3, "text": "ich" }
  ],
  "correct_order": [3, 2, 1]
}

---

# ERROR PLACEHOLDER HANDLING

The following patterns are **VALID** answer values and should be preserved exactly:

- `[ERROR: MISSING_ANSWER A6 Q7]`
    
- `[ERROR: UNMATCHED_QUESTION A6 Q7]`
    
- `[ERROR: INVALID_MATCHING_STRUCTURE A5]`
    
- `[ERROR: INVALID_TYPE - unknown exercise type X]`
    

Do NOT reject blocks containing these values.

---

# VALIDATION RULES

## Required Fields Per Type

|Type|Required Fields|
|---|---|
|short_answer|items array non-empty, each item has question + answer|
|fill_blank|EITHER items (single) OR base_text + blanks (multi)|
|matching|items array non-empty, each item has left + right|
|classification|items array non-empty, each item has item + answer|
|true_false|items array non-empty, answer must be "richtig" or "falsch"|
|verb_conjugation|items array non-empty, each item has question + answer|
|long_form|prompt field exists|
|role_play|prompt field exists|
|ordering|items array + correct_order array|

## Audio Validation

- If `audio: true` → `audio_track` MUST be a non-empty string
    
- If `audio: false` → `audio_track` MUST be `""` (empty string)
    

## Duplicate ID Detection

- No two blocks may share the same `id`
    
- If duplicate detected → reject with error
    

---

# OUTPUT FORMAT

## Reading Block

json

{
  "category": "READING",
  "metadata": {
    "id": "A2",
    "type": "monologue",
    "title": "Pedro und Martina",
    "audio": true,
    "audio_track": "1.02",
    "tags": ["introduction", "biography"]
  },
  "raw_content": "Hallo. Mein Name ist Pedro Gomez."
}

## Exercise Block (short_answer)

json

{
  "category": "EXERCISE",
  "metadata": {
    "id": "A3",
    "type": "short_answer",
    "audio": false,
    "audio_track": "",
    "tags": ["comprehension", "biography"],
    "instruction": "Beantworten Sie die Fragen."
  },
  "items": [
    { "question": "Wo ist Pedro geboren?", "answer": "Pedro ist in Barcelona geboren." },
    { "question": "Wo ist Martina zur Schule gegangen?", "answer": "Martina ist in Berlin zur Schule gegangen." }
  ]
}

## Exercise Block (fill_blank with multiple blanks)

json

{
  "category": "EXERCISE",
  "metadata": {
    "id": "A4",
    "type": "fill_blank",
    "audio": false,
    "audio_track": "",
    "tags": ["grammar", "conjugation"]
  },
  "base_text": "Matthias ist ___ in Mathe und treibt gern ___.",
  "blanks": [
    { "position": 1, "answer": "schlechter" },
    { "position": 2, "answer": "Sport" }
  ]
}

## Exercise Block (matching)

json

{
  "category": "EXERCISE",
  "metadata": {
    "id": "B5",
    "type": "matching",
    "audio": false,
    "audio_track": "",
    "tags": ["professions", "tasks"]
  },
  "items": [
    { "left": "der Arzt / die Ärztin", "right": "hilft kranken Menschen" },
    { "left": "der Arzt / die Ärztin", "right": "untersucht Patienten" }
  ]
}

## Exercise Block (ordering)

json

{
  "category": "EXERCISE",
  "metadata": {
    "id": "C1",
    "type": "ordering",
    "audio": false,
    "audio_track": "",
    "tags": ["sentence_structure", "word_order"]
  },
  "items": ["aufstehen", "frühstücken", "duschen"],
  "correct_order": [1, 3, 2]
}

---

# FAILURE MODE

If a block cannot be parsed:

json

{
  "error": "DESCRIPTION",
  "block_id": "A16a",
  "raw_input": "first 200 characters of problematic content..."
}

**Failure scenarios:**

- Block not closed (no `_END` tag)
    
- Invalid metadata type
    
- Missing required metadata field
    
- Empty items array for type that requires items
    
- Missing answer for question (non-error-placeholder)
    
- Duplicate block ID
    
- `audio: true` with missing or empty `audio_track`
    

---

# SUPPORTED TYPES (COMPLETE)

|Category|Types|
|---|---|
|READING|dialogue, monologue, passage, transcript, cultural_note, grammar_table, vocabulary_list|
|EXERCISE|short_answer, fill_blank, multiple_choice, matching, true_false, verb_conjugation, ordering, role_play, classification, long_form|

text

---
## FILE: `Zod Schemas` (UPDATED - No CEFR)
```typescript
// lib/schemas.ts
import { z } from 'zod';
// ============================================
// BASE SCHEMAS (CEFR REMOVED)
// ============================================
export const baseMetadataSchema = z.object({
  id: z.string().min(1, "ID is required"),
  audio: z.boolean(),
  audio_track: z.string(),
  tags: z.array(z.string()),
});
// ============================================
// READING SCHEMAS
// ============================================
export const readingMetadataSchema = baseMetadataSchema.extend({
  type: z.enum([
    'dialogue', 'monologue', 'passage', 'transcript', 
    'cultural_note', 'grammar_table', 'vocabulary_list'
  ]),
  title: z.string().optional(),
});
export const readingBlockSchema = z.object({
  category: z.literal('READING'),
  metadata: readingMetadataSchema,
  raw_content: z.string(),
});
// ============================================
// EXERCISE TYPE SCHEMAS
// ============================================
// Short Answer
export const shortAnswerItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export const shortAnswerExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('short_answer'),
    instruction: z.string().optional(),
  }),
  items: z.array(shortAnswerItemSchema).min(1, "At least one Q/A pair required"),
});
// Fill Blank (Single)
export const fillBlankItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
// Fill Blank (Multiple - Grouped)
export const fillBlankBlankSchema = z.object({
  position: z.number(),
  answer: z.string(),
});
export const fillBlankGroupedSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('fill_blank'),
    instruction: z.string().optional(),
  }),
  base_text: z.string(),
  blanks: z.array(fillBlankBlankSchema).min(1),
});
// Union type for fill_blank (supports both patterns)
export const fillBlankExerciseSchema = z.union([
  z.object({
    category: z.literal('EXERCISE'),
    metadata: baseMetadataSchema.extend({
      type: z.literal('fill_blank'),
      instruction: z.string().optional(),
    }),
    items: z.array(fillBlankItemSchema).min(1),
  }),
  fillBlankGroupedSchema,
]);
// Matching
export const matchingItemSchema = z.object({
  left: z.string(),
  right: z.string(),
});
export const matchingExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('matching'),
    instruction: z.string().optional(),
  }),
  items: z.array(matchingItemSchema).min(1),
});
// Classification
export const classificationItemSchema = z.object({
  item: z.string(),
  answer: z.string(),
});
export const classificationExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('classification'),
    instruction: z.string().optional(),
  }),
  items: z.array(classificationItemSchema).min(1),
});
// True/False
export const trueFalseItemSchema = z.object({
  question: z.string(),
  answer: z.enum(['richtig', 'falsch']),
});
export const trueFalseExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('true_false'),
    instruction: z.string().optional(),
  }),
  items: z.array(trueFalseItemSchema).min(1),
});
// Verb Conjugation
export const verbConjugationItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export const verbConjugationExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('verb_conjugation'),
    instruction: z.string().optional(),
  }),
  items: z.array(verbConjugationItemSchema).min(1),
});
// Long Form
export const longFormExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('long_form'),
    instruction: z.string().optional(),
  }),
  prompt: z.string(),
  answer: z.string(),
});
// Role Play
export const rolePlayExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('role_play'),
    instruction: z.string().optional(),
  }),
  prompt: z.string(),
  answer: z.string().nullable(),
});
// Ordering
export const orderingExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('ordering'),
    instruction: z.string().optional(),
  }),
  items: z.array(z.union([z.string(), z.object({ position: z.number(), text: z.string() })])),
  correct_order: z.array(z.number()),
});
// Multiple Choice
export const multipleChoiceItemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  answer: z.union([z.string(), z.array(z.string())]), // single or multiple
});
export const multipleChoiceExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('multiple_choice'),
    instruction: z.string().optional(),
  }),
  items: z.array(multipleChoiceItemSchema).min(1),
});
// ============================================
// UNION TYPE FOR ALL VALID BLOCKS
// ============================================
export const validBlockSchema = z.discriminatedUnion('category', [
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
  multipleChoiceExerciseSchema,
]);
// ============================================
// ERROR BLOCK SCHEMA
// ============================================
export const errorBlockSchema = z.object({
  error: z.string(),
  block_id: z.string().optional(),
  raw_input: z.string().optional(),
});
// ============================================
// TYPE INFERENCES
// ============================================
export type ReadingBlock = z.infer<typeof readingBlockSchema>;
export type ShortAnswerExercise = z.infer<typeof shortAnswerExerciseSchema>;
export type FillBlankExercise = z.infer<typeof fillBlankExerciseSchema>;
export type MatchingExercise = z.infer<typeof matchingExerciseSchema>;
export type ClassificationExercise = z.infer<typeof classificationExerciseSchema>;
export type TrueFalseExercise = z.infer<typeof trueFalseExerciseSchema>;
export type VerbConjugationExercise = z.infer<typeof verbConjugationExerciseSchema>;
export type LongFormExercise = z.infer<typeof longFormExerciseSchema>;
export type RolePlayExercise = z.infer<typeof rolePlayExerciseSchema>;
export type OrderingExercise = z.infer<typeof orderingExerciseSchema>;
export type MultipleChoiceExercise = z.infer<typeof multipleChoiceExerciseSchema>;
export type ValidBlock = z.infer<typeof validBlockSchema>;
export type ErrorBlock = z.infer<typeof errorBlockSchema>;
// ============================================
// HELPER VALIDATION FUNCTIONS
// ============================================
export function validateAudioMetadata(metadata: { audio: boolean; audio_track: string }): boolean {
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
