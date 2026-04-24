# Updated Files - Complete Set

I'll provide each updated file in order. Copy the entire content of each code block to replace your existing files.

---

## File 1: `extractor.md`

```markdown
# ROLE

You are a precise text extraction engine specialized in educational materials.

You will receive the text of a PDF file as input. Process only that text.

**Pages to extract:** {{PAGE_RANGE}}

(If empty, extract ALL pages. If specified, e.g., 1-5, 7, 9, extract only those pages.)

**Strict Rules:**

- Do **NOT** summarize, paraphrase, or rephrase.
- Do **NOT** add, infer, or hallucinate content.
- Preserve the original text exactly as written.
- Maintain strict page order.

**Special Extraction Instructions:**

1. **Exercise Identifiers:** Explicitly capture exercise labels (e.g., **A1**, **A2**, **B3**, **C10**). Ensure these are placed on their own line or at the very beginning of the relevant section.

2. **Audio Identification:** Look for numerical codes that indicate audio tracks (e.g., **1.02**, **1.05**, **104**). If an exercise is accompanied by such a code, append **(audio)** immediately after the exercise identifier.

   - *Example: `## A2 (audio) (1.02)`*

3. **Titles & Subtitles:** Extract all main chapter titles and sub-section headers.

**Content Handling:**

- **Extract:** Titles, bullet points, paragraphs, table text, and text-based captions.
- **Tables:** Use standard Markdown format:

  | Column 1 | Column 2 |
  |----------|----------|
  | Text | Text |

- **Ignore:** Images, icons (except to identify audio), diagrams, logos, watermarks, and repetitive headers/footers.

**Markdown Formatting Rules:**

- Use `#` for Chapter Titles, `##` for Exercise Identifiers/Section Headings, and `###` for Subheadings.
- Use `-` for main bullets and `  -` for sub-bullets.
- Use `**bold**` and `*italic*` only where present in the source.
- Preserve paragraph breaks as empty lines.

**Page Separation:**

Clearly separate each page using an HTML comment marker:

<!-- PAGE BREAK -->

**Output Rules:**

- Output **ONLY** the extracted text with Markdown formatting.
- No explanations, no metadata, no extra commentary.
- Do **NOT** use code fences (```) around the entire output.

**Verification Checklist:**

1. Did I capture exercise numbers like A1, A2 correctly?
2. Did I add **(audio)** to exercises containing track numbers?
3. Is the formatting clean and devoid of hallucinated text?

**VERSION:** 2.0.0
**LAST_UPDATED:** 2024-01-15
```

---

## File 2: `extractor ans.md`

```markdown
# ROLE

You are a precise text extraction engine specialized in **academic answer keys and solution manuals**.

You will receive the text of an answer key PDF as input. Process only that text.

**Pages to extract:** {{PAGE_RANGE}}

(If empty, extract ALL pages. If specified, e.g., 1-5, 7, 9, extract only those pages.)

**Strict Rules:**

- Do **NOT** summarize or rephrase.
- Do **NOT** omit any part of the answer string (e.g., if it says "1. a; 2. b", do not simplify it).
- Preserve all grammar, punctuation, and casing exactly as written.
- Maintain strict sequence and page order.

**Extraction Instructions for Answer Keys:**

1. **Chapter & Exercise Headings:** Explicitly capture chapter numbers (e.g., **Kapitel 1**) and exercise identifiers (e.g., **A3**, **A4**, **C10**).

   - Format these as Markdown headers: `## Kapitel 1` or `### A3`.

2. **Audio-Related Answers:** Look for track numbers or "Hörtext" indicators nearby. If an answer section belongs to a listening exercise, append **(audio)** to the exercise header.

   - *Example: `### A11 (audio)`*

3. **Key-Value Pairs:** Preserve the mapping of sub-questions to answers (e.g., `1. Pedro... 2. Martina...`).

4. **Transcript Extraction:** If the PDF contains full "Hörtexte" (transcripts), extract them completely without abbreviation.

**Content Handling:**

- **Tables:** Use standard Markdown table format.
- **Lists:** If answers are in a list, use standard Markdown `-` bullets.
- **Ignore:** Page numbers, footers, headers (unless they contain the Chapter/Section title), and decorative graphics.

**Markdown Formatting Rules:**

- Use `#` for the PDF Title (e.g., `Lösungsschlüssel`).
- Use `##` for Chapters/Major Sections.
- Use `###` for specific Exercises (A1, B2, etc.).
- Preserve paragraph breaks as empty lines to keep different exercise answers distinct.

**Page Separation:**

Clearly separate each page using an HTML comment marker:

<!-- PAGE BREAK -->

**Output Rules:**

- Output **ONLY** the extracted text with Markdown formatting.
- No explanations, no metadata, no extra commentary.
- Do **NOT** use code fences (```) around the entire output.

**Verification Checklist:**

1. Did I maintain the link between the exercise number (e.g., A3) and its specific answers?
2. Did I include the **(audio)** tag for listening task solutions?
3. Is every character from the original text represented without hallucination?

**VERSION:** 2.0.0
**LAST_UPDATED:** 2024-01-15
```

---

## File 3: `Tagging.md` (FULLY UPDATED)

```markdown
# ROLE

You are a deterministic **Text-to-Structured-Data extraction engine**.

Your task is to convert textbook Markdown (`[MAIN_TEXT]`) and its solution key (`[ANSWER_KEY]`) into a strict Intermediate Tagging Format.

You MUST behave like a parser, not a writer.

**VERSION:** 2.0.0
**LAST_UPDATED:** 2024-01-15

---

# CORE PRINCIPLES (NON-NEGOTIABLE)

1. **NO GENERATION**
   - Do NOT invent, infer, rewrite, or correct anything.
   - ONLY extract and align.

2. **VERBATIM COPYING**
   - All German text MUST be copied exactly (character-level).
   - No paraphrasing, no normalization.

3. **STRICT ALIGNMENT**
   - Match exercises using:
     - Exercise ID (A3, A4, etc.)
     - Question number (1, 2, 3…)
   - If alignment fails → output ERROR (see Failure Rules).

4. **FAIL LOUDLY**
   - If ANY required data is missing or unclear:  
     → Output `[ERROR: ...]`
   - NEVER guess.

---

# WORKFLOW

## STEP 1: IDENTIFY BLOCKS

From `[MAIN_TEXT]`, detect:

- Reading sections (dialogue, passage, etc.)
- Exercises (A1, A2, A3...)

---

## STEP 2: CLASSIFY TYPE

### Reading Types:
- dialogue
- monologue
- passage
- transcript
- cultural_note
- grammar_table
- vocabulary_list

### Exercise Types:
- short_answer
- fill_blank
- multiple_choice
- matching
- true_false
- verb_conjugation
- ordering
- role_play
- classification
- long_form

---

## STEP 3: ALIGN WITH ANSWER KEY

STRICT RULES:

- Match by exercise ID first
- Then match by question number
- Answers MUST come ONLY from `[ANSWER_KEY]`
- If answer not found → ERROR (see Missing Answer Handling below)

---

# TAGGING FORMAT SPEC

## READING BLOCK

[READING_START]
id: A2
type: monologue
title: "Pedro und Martina"
audio: true
audio_track: "1.02"
tags: [introduction, biography]
[READING_END]

**Raw Content:**
Hallo. Mein Name ist Pedro Gomez. Ich komme aus Barcelona.

---

## EXERCISE BLOCK

[EXERCISE_START]
id: A3
type: short_answer
audio: false
audio_track: ""
tags: [comprehension, biography]
instruction: "Beantworten Sie die Fragen."
[EXERCISE_END]

**Question 1:** Wo ist Pedro geboren?
**Answer 1:** Pedro ist in Barcelona geboren.

**Question 2:** Wo ist Martina zur Schule gegangen?
**Answer 2:** Martina ist in Berlin zur Schule gegangen.

---

# TYPE-SPECIFIC RULES

## 1. short_answer

Standard Q/A pairs. One answer per question.

**Question 1:** Wo ist Pedro geboren?
**Answer 1:** Pedro ist in Barcelona geboren.

**Question 2:** Wo ist Martina zur Schule gegangen?
**Answer 2:** Martina ist in Berlin zur Schule gegangen.

---

## 2. fill_blank (UPDATED - PROPER GROUPING)

**CRITICAL RULE:** Use the **parent ID + position suffix** pattern with `- N` format.

### Format:
- Base identifier: The original question text or passage
- Position suffix: `- N` where N is the blank number (1, 2, 3...)

### Example - Multiple blanks in one sentence:

**Original text:** "Matthias ist ___ in Mathe und treibt gern ___."

**Output using - N format:**

**Question 1:** Matthias - 1
**Answer 1:** schlechter

**Question 2:** Matthias - 2
**Answer 2:** Sport

### GROUPING RULE:
All questions sharing the same base name (text BEFORE " - ") belong to ONE fill_blank exercise.

### Single blank example:

**Question 1:** Matthias ist ___ in Mathe.
**Answer 1:** schlechter

### Multiple valid answers for same blank (array format):

**Answer 1:** ["halb acht", "7.30 Uhr", "7:30"]

---

## 3. matching

STRICT RULES:
- Each Left MUST map to ONE Right
- If one Left has multiple Rights → duplicate Left with suffix letters

### Single right:

**Left 1:** ein Studium
**Right 1:** abschließen

### Multiple rights for same Left:

**Left 1:** der Arzt / die Ärztin
**Right 1a:** hilft kranken Menschen
**Right 1b:** untersucht Patienten

### Duplicate Left with different suffixes:

**Left 2:** eine Ausbildung
**Right 2:** machen

**Left 2b:** eine Ausbildung
**Right 2b:** abschließen

---

## 4. classification

Use when items map to categories. Each item has ONE correct category.

**Item 1:** Sekretärin
**Answer 1:** Büro

**Item 2:** Krankenpfleger
**Answer 2:** Gesundheitswesen

**Item 3:** Programmierer
**Answer 3:** IT

---

## 5. true_false

Answers MUST be exactly: `richtig` or `falsch`

**Question 1:** Pedro kommt aus Berlin.
**Answer 1:** falsch

**Question 2:** Pedro kommt aus Barcelona.
**Answer 2:** richtig

---

## 6. verb_conjugation

**Question 1:** ich - sein (Präsens)
**Answer 1:** ich bin

**Question 2:** du - haben (Präsens)
**Answer 2:** du hast

---

## 7. long_form

One prompt → long paragraph answer.

**Prompt:** Beschreiben Sie Ihren Tagesablauf.
**Answer:** Ich stehe um 7 Uhr auf. Dann dusche ich...

---

## 8. role_play

Dialogue or conversation prompt. Answer is optional.

**Prompt:** Fragen Sie Ihre Nachbarin nach ihrem Beruf.
**Answer:** Was arbeiten Sie? / Was sind Sie von Beruf?

If no answer in answer key:

**Prompt:** Stellen Sie sich vor.
**Answer:** [ERROR: MISSING_ANSWER A12]

---

## 9. ordering (STANDARDIZED FORMAT)

**USE THIS FORMAT ONLY:**

**Items:** ["aufstehen", "frühstücken", "duschen", "anziehen"]
**Correct Order:** [1, 3, 2, 4]

### Alternative for sentence ordering:

**Items:** ["Er geht nach Hause.", "Er beendet die Arbeit.", "Er isst zu Abend."]
**Correct Order:** [2, 1, 3]

---

## 10. multiple_choice (NEW - COMPLETE SPEC)

**Format:**

**Question 1:** Was macht Pedro?
**Options 1:** a) Arzt, b) Student, c) Lehrer
**Answer 1:** b

**Question 2:** Welche Farben mag Martina? (Multiple correct)
**Options 2:** a) Rot, b) Blau, c) Grün, d) Gelb
**Answer 2:** ["a", "c"]

### Rules:
- For single answer: use string like `"b"`
- For multiple answers: use array like `["a", "c"]`
- Options format: `a) Text`, `b) Text`, etc.

---

# METADATA RULES

- `tags` MUST be array → `[tag1, tag2, tag3]` (no quotes inside)
- `audio` MUST be `true` or `false`
- If `audio: true` → `audio_track` REQUIRED (non-empty string)
- If `audio: false` → `audio_track` MUST be `""` (empty string, never null)
- `id` MUST be unique within the entire document

---

# MISSING ANSWER HANDLING (CRITICAL)

If an answer from the answer key does NOT exist for a question:
1. Keep the question as-is
2. Insert placeholder: `[ERROR: MISSING_ANSWER {id} Q{number}]`

**NEVER:**
- Skip the question entirely
- Invent an answer
- Leave the answer field empty without error marker

**Example:**

**Question 7:** Eine Marketingmanagerin
**Answer 7:** [ERROR: MISSING_ANSWER A6 Q7]

---

# FAILURE RULES (CRITICAL)

If ANY issue occurs, STOP that block and output:

- `[ERROR: MISSING_ANSWER A16a Q6]`
- `[ERROR: UNMATCHED_QUESTION A6 Q7]`
- `[ERROR: INVALID_MATCHING_STRUCTURE A5]`
- `[ERROR: INVALID_TYPE - unknown exercise type X]`

DO NOT continue that block after error.

---

# OUTPUT RULES

- Output ONLY tagged blocks
- NO explanations
- NO markdown commentary
- Start from first valid block

---

# INPUT

[MAIN_TEXT]
{{INSERT_MAIN_TEXT_HERE}}
[/MAIN_TEXT]

[ANSWER_KEY]
{{INSERT_ANSWER_KEY_HERE}}
[/ANSWER_KEY]

---

# FINAL INSTRUCTION

Generate the structured tagged output now.
```

---

## File 4: `Parser.md` (FULLY UPDATED)

```markdown
# ROLE

You are a strict **Intermediate Format → Structured JSON parser**.
Your job is to convert tagged blocks into clean, validated JSON.

**VERSION:** 2.0.0
**LAST_UPDATED:** 2024-01-15

---

# CORE RULES

1. NO guessing
2. Reject invalid structures
3. Preserve all content
4. Type-aware parsing

---

# BLOCK DETECTION

Match blocks using:

[READING_START] ... [READING_END]

[EXERCISE_START] ... [EXERCISE_END]

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

**Example Input:**
**Question 1:** Wo ist Pedro geboren?
**Answer 1:** Pedro ist in Barcelona geboren.

**Output:**
```json
{ "question": "Wo ist Pedro geboren?", "answer": "Pedro ist in Barcelona geboren." }
```

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
  "base_text": "Matthias",
  "blanks": [
    { "position": 1, "answer": "schlechter" },
    { "position": 2, "answer": "Sport" }
  ]
}
```

**Note:** `base_text` is the text BEFORE the " - " pattern. If the original sentence had placeholders, store that separately in an `original_sentence` field when available.

**Output format for single blank (simple fill_blank):**
```json
{
  "category": "EXERCISE",
  "metadata": { ... },
  "items": [
    { "question": "Matthias ist ___ in Mathe.", "answer": "schlechter" }
  ]
}
```

### Answer Array Support

If answer is an array (e.g., `["halb acht", "7.30 Uhr"]`), preserve as array:

```json
{ "position": 1, "answer": ["halb acht", "7.30 Uhr"] }
```

### Parsing Example

**Input:**
**Question 1:** Matthias - 1
**Answer 1:** schlechter
**Question 2:** Matthias - 2
**Answer 2:** Sport

**Processing:**
1. Detected `- 1` and `- 2` patterns
2. Base text = `"Matthias"`
3. Group as single exercise with 2 blanks

**Output:**
```json
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
```

---

## matching

Extract `**Left X:**` and `**Right X:**` pairs.

### Single right:
**Left 1:** ein Studium
**Right 1:** abschließen

→ `{ left: "ein Studium", right: "abschließen" }`

### Multiple rights (suffix letters a, b, c...):
**Left 1:** der Arzt
**Right 1a:** hilft kranken Menschen
**Right 1b:** untersucht Patienten

→
```json
[
  { "left": "der Arzt", "right": "hilft kranken Menschen" },
  { "left": "der Arzt", "right": "untersucht Patienten" }
]
```

### Duplicate Left with different numeric suffixes:
**Left 2:** eine Ausbildung
**Right 2:** machen
**Left 2b:** eine Ausbildung
**Right 2b:** abschließen

→
```json
[
  { "left": "eine Ausbildung", "right": "machen" },
  { "left": "eine Ausbildung", "right": "abschließen" }
]
```

---

## classification

Extract `**Item X:**` and `**Answer X:**` pairs.

→ `items: [{ item, answer }]`

**Example Input:**
**Item 1:** Sekretärin
**Answer 1:** Büro
**Item 2:** Krankenpfleger
**Answer 2:** Gesundheitswesen

**Output:**
```json
"items": [
  { "item": "Sekretärin", "answer": "Büro" },
  { "item": "Krankenpfleger", "answer": "Gesundheitswesen" }
]
```

---

## long_form

Extract `**Prompt:**` and `**Answer:**`

→ `{ prompt, answer }`

**Example Input:**
**Prompt:** Beschreiben Sie Ihren Tagesablauf.
**Answer:** Ich stehe um 7 Uhr auf...

**Output:**
```json
{ "prompt": "Beschreiben Sie Ihren Tagesablauf.", "answer": "Ich stehe um 7 Uhr auf..." }
```

---

## role_play

Extract `**Prompt:**` and optional `**Answer:**`

→ `{ prompt, answer: string | null }`

If no answer present, set `answer: null`.

---

## ordering (STANDARDIZED)

### Parse Option 1 - Array format:
**Items:** ["aufstehen", "frühstücken", "duschen"]
**Correct Order:** [1, 3, 2]

→
```json
{
  "items": ["aufstehen", "frühstücken", "duschen"],
  "correct_order": [1, 3, 2]
}
```

### Parse Option 2 - Numbered items (legacy support):
**Item 1:** Morgen
**Item 2:** aufstehen
**Item 3:** ich
**Correct Sequence:** 3,2,1

→
```json
{
  "items": [
    { "position": 1, "text": "Morgen" },
    { "position": 2, "text": "aufstehen" },
    { "position": 3, "text": "ich" }
  ],
  "correct_order": [3, 2, 1]
}
```

---

## multiple_choice (NEW)

Extract `**Question X:**`, `**Options X:**`, and `**Answer X:**`

**Example Input:**
**Question 1:** Was macht Pedro?
**Options 1:** a) Arzt, b) Student, c) Lehrer
**Answer 1:** b

**Question 2:** Welche Farben mag Martina?
**Options 2:** a) Rot, b) Blau, c) Grün
**Answer 2:** ["a", "c"]

**Output:**
```json
{
  "items": [
    {
      "question": "Was macht Pedro?",
      "options": ["a) Arzt", "b) Student", "c) Lehrer"],
      "answer": "b"
    },
    {
      "question": "Welche Farben mag Martina?",
      "options": ["a) Rot", "b) Blau", "c) Grün"],
      "answer": ["a", "c"]
    }
  ]
}
```

### Parsing Rules:
- Split options by comma or detect pattern `a)`, `b)`, etc.
- If answer contains commas or brackets → parse as array
- Otherwise → string

---

# ERROR PLACEHOLDER HANDLING

The following patterns are **VALID** answer values and should be preserved exactly:

- `[ERROR: MISSING_ANSWER A6 Q7]`
- `[ERROR: UNMATCHED_QUESTION A6 Q7]`
- `[ERROR: INVALID_MATCHING_STRUCTURE A5]`
- `[ERROR: INVALID_TYPE - unknown exercise type X]`

Do NOT reject blocks containing these values.

---

# VALIDATION RULES

## Required Fields Per Type

| Type | Required Fields |
|------|-----------------|
| short_answer | items array non-empty, each item has question + answer |
| fill_blank | EITHER items (single) OR base_text + blanks (multi) |
| matching | items array non-empty, each item has left + right |
| classification | items array non-empty, each item has item + answer |
| true_false | items array non-empty, answer must be "richtig" or "falsch" |
| verb_conjugation | items array non-empty, each item has question + answer |
| long_form | prompt field exists |
| role_play | prompt field exists |
| ordering | items array + correct_order array |
| multiple_choice | items array non-empty, each item has question + options + answer |

## Audio Validation

- If `audio: true` → `audio_track` MUST be a non-empty string
- If `audio: false` → `audio_track` MUST be `""` (empty string)

## Duplicate ID Detection

- No two blocks may share the same `id`
- If duplicate detected → reject with error

---

# OUTPUT FORMAT

## Reading Block
```json
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
```

## Exercise Block (short_answer)
```json
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
```

## Exercise Block (fill_blank with multiple blanks)
```json
{
  "category": "EXERCISE",
  "metadata": {
    "id": "A4",
    "type": "fill_blank",
    "audio": false,
    "audio_track": "",
    "tags": ["grammar", "conjugation"]
  },
  "base_text": "Matthias",
  "blanks": [
    { "position": 1, "answer": "schlechter" },
    { "position": 2, "answer": "Sport" }
  ]
}
```

## Exercise Block (multiple_choice)
```json
{
  "category": "EXERCISE",
  "metadata": {
    "id": "C1",
    "type": "multiple_choice",
    "audio": false,
    "audio_track": "",
    "tags": ["comprehension"],
    "instruction": "Wählen Sie die richtige Antwort."
  },
  "items": [
    {
      "question": "Was macht Pedro?",
      "options": ["a) Arzt", "b) Student", "c) Lehrer"],
      "answer": "b"
    }
  ]
}
```

## Exercise Block (matching)
```json
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
```

## Exercise Block (ordering)
```json
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
```

---

# FAILURE MODE

If a block cannot be parsed:

```json
{
  "error": "DESCRIPTION",
  "block_id": "A16a",
  "raw_input": "first 200 characters of problematic content..."
}
```

**Failure scenarios:**
- Block not closed (no `_END` tag)
- Invalid metadata type
- Missing required metadata field
- Empty items array for type that requires items
- Missing answer for question (non-error-placeholder)
- Duplicate block ID
- `audio: true` with missing or empty `audio_track`

---

# SUPPORTED TYPES (COMPLETE)

| Category | Types |
|----------|-------|
| READING | dialogue, monologue, passage, transcript, cultural_note, grammar_table, vocabulary_list |
| EXERCISE | short_answer, fill_blank, multiple_choice, matching, true_false, verb_conjugation, ordering, role_play, classification, long_form |
```

---

## File 5: `Zod Schemas` (Complete - No CEFR)

```typescript
// lib/schemas.ts
import { z } from 'zod';

// VERSION: 2.0.0
// LAST_UPDATED: 2024-01-15

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
  answer: z.union([z.string(), z.array(z.string())]),
});

// Fill Blank (Multiple - Grouped)
export const fillBlankBlankSchema = z.object({
  position: z.number(),
  answer: z.union([z.string(), z.array(z.string())]),
});

export const fillBlankGroupedSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('fill_blank'),
    instruction: z.string().optional(),
  }),
  base_text: z.string(),
  blanks: z.array(fillBlankBlankSchema).min(1),
  original_sentence: z.string().optional(),
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
export const orderingItemSchema = z.union([
  z.string(),
  z.object({ position: z.number(), text: z.string() })
]);

export const orderingExerciseSchema = z.object({
  category: z.literal('EXERCISE'),
  metadata: baseMetadataSchema.extend({
    type: z.literal('ordering'),
    instruction: z.string().optional(),
  }),
  items: z.array(orderingItemSchema),
  correct_order: z.array(z.number()),
});

// Multiple Choice
export const multipleChoiceItemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  answer: z.union([z.string(), z.array(z.string())]),
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

// ============================================
// TYPE GUARDS
// ============================================

export function isFillBlankGrouped(block: FillBlankExercise): block is z.infer<typeof fillBlankGroupedSchema> {
  return 'base_text' in block && 'blanks' in block;
}

export function isMultipleChoiceWithArrayAnswer(item: z.infer<typeof multipleChoiceItemSchema>): boolean {
  return Array.isArray(item.answer);
}
```

---

## File 6: `User Instructions.md` (UPDATED)

```markdown
# User Instructions: From Textbook PDF to Interactive Exercises

**VERSION:** 2.0.0
**LAST_UPDATED:** 2024-01-15

## Overview

This process takes your German textbook PDFs and turns them into interactive web exercises. You'll use an LLM (ChatGPT, Claude, Gemini) to process the text, then paste the result into our web app.

**Total time:** 5-10 minutes per chapter once you learn the workflow.

---

## What You Need

1. Textbook chapter PDF (main content)
2. Answer key PDF (solutions)
3. Access to ChatGPT, Claude, or Gemini
4. Our web app URL

---

## STEP 1: Extract Main Textbook Text

### Instructions:

1. Open your textbook PDF
2. Select ALL text from one chapter (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)
4. Open your LLM (ChatGPT, Claude, Gemini)
5. Copy the `extractor.md` prompt below
6. Paste the prompt into the LLM
7. Below the prompt, paste your copied textbook text
8. Press Enter/Submit

### The extractor.md Prompt:

```
[COPY THE ENTIRE extractor.md PROMPT FROM ABOVE - the one with VERSION 2.0.0]
```

**Note about PAGE_RANGE:** If you want to extract only specific pages, replace `{{PAGE_RANGE}}` with something like `1-5, 7, 9`. If extracting all pages, leave it empty or write `all`.

### What you'll get:
Clean Markdown with preserved structure, exercise IDs, and audio markers.

### Save this output as: `chapter1_main.txt`

---

## STEP 2: Extract Answer Key Text

### Instructions:

1. Open your answer key PDF
2. Select ALL text for the same chapter
3. Copy it
4. In your LLM, paste the `extractor ans.md` prompt
5. Below it, paste your copied answer key text
6. Submit

### The extractor ans.md Prompt:

```
[COPY THE ENTIRE extractor ans.md PROMPT FROM ABOVE - the one with VERSION 2.0.0]
```

### What you'll get:
Clean Markdown of answers only, aligned with exercise IDs.

### Save this output as: `chapter1_answers.txt`

---

## STEP 3: Combine and Tag (Most Important)

### Instructions:

1. In your LLM, start a NEW conversation
2. Copy the ENTIRE `Tagging.md` prompt
3. Replace `{{INSERT_MAIN_TEXT_HERE}}` with your main text from Step 1
4. Replace `{{INSERT_ANSWER_KEY_HERE}}` with your answer key from Step 2
5. Submit to the LLM

### The Tagging.md Prompt:

```
[COPY THE ENTIRE Tagging.md PROMPT FROM ABOVE - the one with VERSION 2.0.0]
```

### What you'll get:
Tagged intermediate format with `[READING_START]`, `[EXERCISE_START]` blocks.

### Save this output as: `chapter1_tagged.txt`

---

## STEP 4: Import into Web App

### Instructions:

1. Open our web app
2. You'll see a large textarea
3. Copy the ENTIRE contents of `chapter1_tagged.txt`
4. Paste into the textarea
5. Click the **"Process"** button

### What happens:
- The system parses your tagged text
- Validates all blocks
- Renders interactive exercises

### Success indicator:
You should see your first reading passage with audio player (if available) and interactive exercises below.

---

## STEP 5: Complete Exercises

### Instructions:

1. Read any passages
2. Click audio players to listen (if available)
3. Complete each exercise:
   - **short_answer:** Type answers in text fields
   - **fill_blank:** Fill in blank fields (multiple blanks grouped together)
   - **matching:** Drag items to match pairs
   - **true_false:** Select "richtig" or "falsch" buttons
   - **ordering:** Drag items to correct sequence
   - **multiple_choice:** Select radio buttons or checkboxes
   - **classification:** Drag items to category buckets
   - **long_form:** Write paragraph in textarea
   - **role_play:** Follow prompt, optional response
   - **verb_conjugation:** Type conjugated verb forms
4. Click "Check" or submit to see feedback
5. Progress saves automatically to your browser

---

## Common Issues and Solutions

### Issue: "No blocks found" error
**Solution:** Your tagged output might be missing the `[READING_START]` or `[EXERCISE_START]` markers. Check that the LLM output includes these exactly.

### Issue: "Missing answer for question X"
**Solution:** Your answer key PDF might be missing that answer. Either:
- Add the answer manually to the tagged file
- The exercise will show an error message but other exercises work

### Issue: Audio player shows but no sound
**Solution:** Make sure audio files are uploaded to the CDN with correct track numbers (e.g., `1.02.mp3`).

### Issue: Parser rejects a block
**Solution:** Look at the error message. Common fixes:
- Check that each `[READING_START]` has a matching `[READING_END]`
- Verify audio_track exists if audio: true
- Ensure tags are in array format: `[tag1, tag2]`

### Issue: fill_blank exercises showing as separate instead of grouped
**Solution:** Make sure your tagged output uses the `- N` format:
```
**Question 1:** Matthias - 1
**Answer 1:** schlechter
**Question 2:** Matthias - 2
**Answer 2:** Sport
```

### Issue: Multiple choice answers not working
**Solution:** Ensure format matches exactly:
- Single answer: `**Answer 1:** b`
- Multiple answers: `**Answer 1:** ["a", "c"]`

---

## Example Complete Flow

### Input Main Text (Step 1 output):

```markdown
## Kapitel 1: Personen
**1.02** Pedro und Martina
Hallo. Mein Name ist Pedro Gomez. Ich komme aus Barcelona.

### A3 Verständnis
Beantworten Sie die Fragen:
1. Wo ist Pedro geboren?
2. Wo ist Martina zur Schule gegangen?
```

### Input Answer Key (Step 2 output):

```markdown
## Kapitel 1 Lösungen
### A3 Verständnis
1. Pedro ist in Barcelona geboren.
2. Martina ist in Berlin zur Schule gegangen.
```

### Tagged Output (Step 3 result):

```
[READING_START]
id: A2
type: monologue
title: "Pedro und Martina"
audio: true
audio_track: "1.02"
tags: [introduction, biography]
[READING_END]

**Raw Content:**
Hallo. Mein Name ist Pedro Gomez. Ich komme aus Barcelona.

[EXERCISE_START]
id: A3
type: short_answer
audio: false
audio_track: ""
tags: [comprehension, biography]
instruction: "Beantworten Sie die Fragen."
[EXERCISE_END]

**Question 1:** Wo ist Pedro geboren?
**Answer 1:** Pedro ist in Barcelona geboren.

**Question 2:** Wo ist Martina zur Schule gegangen?
**Answer 2:** Martina ist in Berlin zur Schule gegangen.
```

### Paste this into the web app → Interactive exercises appear!

---

## LLM Cost Tips

- The Tagging step sends both main text AND answer key, which can be large
- For long chapters (10+ pages), consider processing in sections
- Use Claude or GPT-4 for better accuracy with complex exercises
- Gemini is more cost-effective but may need more prompting

---

## Support

If you encounter issues:

1. Check that your tagged output matches the format exactly
2. Try a smaller chapter first (1-2 pages)
3. Contact support with:
   - The error message
   - The first 10 lines of your tagged output
   - Which exercise type is failing

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2024-01-15 | Added multiple_choice spec, standardized ordering, added array answer support |
| 1.0.0 | 2024-01-01 | Initial release |

---

## Quick Reference: Exercise Formats

| Type | Format |
|------|--------|
| short_answer | `**Question N:**` + `**Answer N:**` |
| fill_blank (single) | `**Question N:**` + `**Answer N:**` |
| fill_blank (multi) | `**Question N:** text - N` + `**Answer N:**` |
| matching | `**Left N:**` + `**Right N:**` (or Na, Nb) |
| classification | `**Item N:**` + `**Answer N:**` |
| true_false | `**Question N:**` + `**Answer N:** richtig/falsch` |
| verb_conjugation | `**Question N:**` + `**Answer N:**` |
| ordering | `**Items:** ["a", "b"]` + `**Correct Order:** [1,2]` |
| multiple_choice | `**Question N:**` + `**Options N:**` + `**Answer N:**` |
| long_form | `**Prompt:**` + `**Answer:**` |
| role_play | `**Prompt:**` + optional `**Answer:**` |
```

---

## File 7: `Complete Workflow.md` (UPDATED)

```markdown
# Complete Workflow

**VERSION:** 2.0.0
**LAST_UPDATED:** 2024-01-15

## Overview Changes Made

1. **Removed all CEFR references** from every prompt and schema
2. **Fixed fill_blank grouping logic** - now properly groups sub-questions using `- N` format
3. **Added `ordering` exercise type** with complete specification
4. **Added `multiple_choice` exercise type** with complete specification
5. **Added user workflow documentation** from PDF to interactive exercises
6. **Fixed audio validation logic**
7. **Added error handling for frontend components**
8. **Added array answer support** for multiple correct answers
9. **Standardized ordering format** (single format recommended)
10. **Added version tracking** to all prompts

---

# PART 1: USER WORKFLOW (Complete End-to-End)

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER WORKFLOW - 5 STEPS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 1                    STEP 2                   STEP 3                   │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐         │
│  │ Textbook PDF │────────▶│  extractor   │────────▶│ Raw Markdown │         │
│  │ (Chapters)   │         │   prompt     │         │ (Main Text)  │         │
│  └──────────────┘         └──────────────┘         └──────────────┘         │
│                                                           │                   │
│  ┌──────────────┐         ┌──────────────┐         ┌──────▼──────┐         │
│  │ Answer Key   │────────▶│ extractor    │────────▶│ Raw Markdown│         │
│  │ PDF          │         │ ans.md       │         │ (Answers)   │         │
│  └──────────────┘         └──────────────┘         └──────┬──────┘         │
│                                                           │                   │
│                                                      STEP 4                  │
│                                                      ┌──────▼──────┐         │
│                                                      │  Tagging.md │         │
│                                                      │  (LLM)      │         │
│                                                      └──────┬──────┘         │
│                                                             │                │
│                                                      STEP 5 │                │
│                                                      ┌──────▼──────┐         │
│                                                      │ Your Web    │         │
│                                                      │ App Paste   │         │
│                                                      └─────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-Step User Instructions

### Step 1: Extract Main Textbook Text

**User does:** Copies textbook PDF text → pastes into ChatGPT/Gemini with `extractor.md` prompt

**Output:** Raw Markdown with preserved structure

### Step 2: Extract Answer Key Text

**User does:** Copies answer key PDF text → pastes into LLM with `extractor ans.md` prompt

**Output:** Raw Markdown of answers only

### Step 3: Combine and Tag (Most Important)

**User does:** Takes BOTH outputs above → pastes into LLM with `Tagging.md` prompt

**Output:** Tagged intermediate format

### Step 4: Paste into Your App

**User does:** Copies tagged output → pastes into your web app textarea → clicks "Process"

**Output:** Interactive exercises rendered

---

# PART 2: PROMPT VERSIONS

| Prompt File | Version | Status |
|-------------|---------|--------|
| extractor.md | 2.0.0 | ✅ Updated |
| extractor ans.md | 2.0.0 | ✅ Updated |
| Tagging.md | 2.0.0 | ✅ Updated |
| Parser.md | 2.0.0 | ✅ Updated |
| Zod Schemas | 2.0.0 | ✅ Updated |
| User Instructions.md | 2.0.0 | ✅ Updated |

---

# PART 3: SUPPORTED EXERCISE TYPES (COMPLETE)

| Type | Tagging Format | Parser Support | Frontend Required |
|------|---------------|----------------|-------------------|
| short_answer | Q/A pairs | ✅ | Text input |
| fill_blank (single) | Q/A pairs | ✅ | Text input |
| fill_blank (multi) | `- N` suffix grouping | ✅ | Multiple text inputs |
| matching | Left/Right pairs | ✅ | Drag-drop or dropdown |
| classification | Item/Category pairs | ✅ | Drag to buckets |
| true_false | Q/A with richtig/falsch | ✅ | Radio buttons |
| verb_conjugation | Q/A pairs | ✅ | Text input |
| ordering | Items + Correct Order | ✅ | Drag-drop reorder |
| multiple_choice | Question + Options + Answer | ✅ | Radio/checkboxes |
| long_form | Prompt + Answer | ✅ | Textarea |
| role_play | Prompt + optional Answer | ✅ | Prompt + optional input |

---

# PART 4: ERROR HANDLING

## Error Placeholders (Preserved)

```
[ERROR: MISSING_ANSWER A6 Q7]
[ERROR: UNMATCHED_QUESTION A6 Q7]
[ERROR: INVALID_MATCHING_STRUCTURE A5]
[ERROR: INVALID_TYPE - unknown exercise type X]
```

## Validation Rules

1. **Audio:** `audio: true` → `audio_track` non-empty string
2. **Duplicate IDs:** No two blocks share the same `id`
3. **Required fields:** Per exercise type (see Parser.md)
4. **Blocks must close:** Each `_START` needs matching `_END`

---

# PART 5: QUICK FIX REFERENCE

## If fill_blank exercises aren't grouping:

❌ Wrong:
```
**Question 1:** Matthias ist ___ in Mathe.
**Answer 1:** schlechter
**Question 2:** Matthias treibt gern ___.
**Answer 2:** Sport
```

✅ Correct:
```
**Question 1:** Matthias - 1
**Answer 1:** schlechter
**Question 2:** Matthias - 2
**Answer 2:** Sport
```

## If multiple_choice answers aren't working:

❌ Wrong:
```
**Answer 1:** a, c
```

✅ Correct (single):
```
**Answer 1:** a
```

✅ Correct (multiple):
```
**Answer 1:** ["a", "c"]
```

## If ordering isn't parsing:

❌ Wrong (multiple formats mixed):
```
**Sequence:** 1,2,3
```

✅ Correct:
```
**Items:** ["aufstehen", "frühstücken", "duschen"]
**Correct Order:** [1, 3, 2]
```

---

# PART 6: NEXT STEPS FOR IMPLEMENTATION

1. ✅ Copy each updated prompt into separate `.md` files
2. ✅ Implement Zod schemas in `lib/schemas.ts`
3. ✅ Build parser according to `Parser.md`
4. ⬜ Create web app UI with paste textarea
5. ⬜ Implement frontend components for each exercise type:
   - short_answer → text input with validation
   - fill_blank → grouped blank inputs
   - matching → drag-and-drop or select menus
   - ordering → sortable list
   - multiple_choice → radio/checkbox groups
   - classification → category buckets
   - true_false → yes/no buttons
   - verb_conjugation → text input with hints
   - long_form → textarea
   - role_play → prompt display
6. ⬜ Add audio player component
7. ⬜ Add progress saving (localStorage or backend)
8. ⬜ Test with the example provided in User Instructions

---

# PART 7: SUMMARY OF ALL CHANGES

| Original Issue | Fix Applied |
|----------------|-------------|
| CEFR levels everywhere | Removed from ALL prompts and schemas |
| fill_blank grouping undefined | Added `- N` suffix grouping logic with base_text + blanks array |
| ordering type missing | Added complete ordering specification with standardized format |
| multiple_choice missing | Added complete multiple_choice specification |
| No user workflow | Added complete 5-step instructions |
| Audio validation unclear | Added explicit rules and validation function |
| No test examples | Added complete example flow |
| Missing frontend error handling | Added error block schema |
| No array answer support | Added union type for string or array answers |
| No version tracking | Added VERSION headers to all prompts |

---

**All CEFR references removed. All prompts are self-contained and ready to use.**
```

---
