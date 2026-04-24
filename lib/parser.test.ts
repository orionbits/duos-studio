import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseBlock, parseTaggedInput } from "./parser";

describe("parseBlock", () => {
  it("parses a valid reading block into a READING ValidBlock", () => {
    const result = parseBlock(`

[READING_START]
id: A2
type: monologue
title: "Pedro und Martina"
audio: true
audio_track: "1.02"
tags: [introduction, biography]
[READING_END]

**Raw Content:**
Hallo. Mein Name ist Pedro Gomez.

`);

    expect("error" in result).toBe(false);

    if (!("error" in result)) {
      expect(result.category).toBe("READING");
      expect(result.metadata.id).toBe("A2");
      expect(result.metadata.audio).toBe(true);
      expect(result.metadata.audio_track).toBe("1.02");
      expect(result.raw_content).toBe("Hallo. Mein Name ist Pedro Gomez.");
    }
  });

  it("parses a valid short_answer exercise with an items array", () => {
    const result = parseBlock(`
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
`);

    expect("error" in result).toBe(false);

    if (!("error" in result)) {
      expect(result.metadata.type).toBe("short_answer");
      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual({
        question: "Wo ist Pedro geboren?",
        answer: "Pedro ist in Barcelona geboren."
      });
    }
  });

  it("parses fill_blank grouping into base_text plus blanks array", () => {
    const result = parseBlock(`
[EXERCISE_START]
id: A4
type: fill_blank
audio: false
audio_track: ""
tags: [grammar, vocabulary]
[EXERCISE_END]

**Question 1:** Matthias - 1
**Answer 1:** schlechter

**Question 2:** Matthias - 2
**Answer 2:** Sport
`);

    expect("error" in result).toBe(false);

    if (!("error" in result)) {
      expect(result.metadata.type).toBe("fill_blank");
      expect("base_text" in result).toBe(true);

      if ("base_text" in result) {
        expect(result.base_text).toBe("Matthias");
        expect(result.blanks).toEqual([
          { position: 1, answer: "schlechter" },
          { position: 2, answer: "Sport" }
        ]);
      }
    }
  });

  it("parses multiple_choice answers as string and array formats", () => {
    const result = parseBlock(`
[EXERCISE_START]
id: B1
type: multiple_choice
audio: false
audio_track: ""
tags: [comprehension]
[EXERCISE_END]

**Question 1:** Was macht Pedro?
**Options 1:** a) Arzt, b) Student, c) Lehrer
**Answer 1:** b

**Question 2:** Welche Farben mag Martina?
**Options 2:** a) Rot, b) Blau, c) Grün
**Answer 2:** ["a", "c"]
`);

    expect("error" in result).toBe(false);

    if (!("error" in result)) {
      expect(result.metadata.type).toBe("multiple_choice");
      expect(result.items[0]?.answer).toBe("b");
      expect(result.items[1]?.answer).toEqual(["a", "c"]);
      expect(result.items[0]?.options).toEqual(["a) Arzt", "b) Student", "c) Lehrer"]);
    }
  });

  it("parses ordering with items array and correct_order array", () => {
    const result = parseBlock(`
[EXERCISE_START]
id: C1
type: ordering
audio: false
audio_track: ""
tags: [sequence]
[EXERCISE_END]

**Items:** ["a", "b"]
**Correct Order:** [2, 1]
`);

    expect("error" in result).toBe(false);

    if (!("error" in result)) {
      expect(result.metadata.type).toBe("ordering");
      expect(result.items).toEqual(["a", "b"]);
      expect(result.correct_order).toEqual([2, 1]);
    }
  });

  it("returns an ErrorBlock for a malformed block missing the end tag", () => {
    const result = parseBlock(`
[READING_START]
id: A2
type: monologue
title: "Pedro und Martina"
audio: false
audio_track: ""
tags: [intro]

**Raw Content:**
Hallo.
`);

    expect("error" in result).toBe(true);

    if ("error" in result) {
      expect(result.error).toContain("Block not closed");
    }
  });

  it("returns an ErrorBlock when required metadata is missing", () => {
    const result = parseBlock(`
[EXERCISE_START]
type: short_answer
audio: false
audio_track: ""
tags: [comprehension]
[EXERCISE_END]

**Question 1:** Wo ist Pedro geboren?
**Answer 1:** Pedro ist in Barcelona geboren.
`);

    expect("error" in result).toBe(true);

    if ("error" in result) {
      expect(result.error).toContain("Missing required metadata field: id");
    }
  });

  it("returns an ErrorBlock when audio is true but audio_track is empty", () => {
    const result = parseBlock(`
[READING_START]
id: A2
type: monologue
title: "Pedro und Martina"
audio: true
audio_track: ""
tags: [intro]
[READING_END]

**Raw Content:**
Hallo.
`);

    expect("error" in result).toBe(true);

    if ("error" in result) {
      expect(result.error).toContain("Invalid audio metadata");
    }
  });

  it("preserves error placeholders exactly in answer fields", () => {
    const result = parseBlock(`
[EXERCISE_START]
id: A6
type: short_answer
audio: false
audio_track: ""
tags: [missing_answers]
[EXERCISE_END]

**Question 1:** Eine Marketingmanagerin
**Answer 1:** [ERROR: MISSING_ANSWER A6 Q7]
`);

    expect("error" in result).toBe(false);

    if (!("error" in result)) {
      expect(result.items[0]?.answer).toBe("[ERROR: MISSING_ANSWER A6 Q7]");
    }
  });

  it("returns a no-blocks error for empty or whitespace-only input", () => {
    const result = parseTaggedInput("   \n   ");

    expect(result).toHaveLength(1);
    expect("error" in result[0]).toBe(true);

    if ("error" in result[0]) {
      expect(result[0].error).toContain("No blocks found");
    }
  });
});

describe("parseTaggedInput", () => {
  it("separates multiple valid blocks in one input", () => {
    const result = parseTaggedInput(`
[READING_START]
id: A2
type: monologue
title: "Pedro und Martina"
audio: false
audio_track: ""
tags: [introduction]
[READING_END]

**Raw Content:**
Hallo. Mein Name ist Pedro Gomez.

[EXERCISE_START]
id: A3
type: short_answer
audio: false
audio_track: ""
tags: [comprehension]
[EXERCISE_END]

**Question 1:** Wo ist Pedro geboren?
**Answer 1:** Pedro ist in Barcelona geboren.

[EXERCISE_START]
id: B1
type: ordering
audio: false
audio_track: ""
tags: [sequence]
[EXERCISE_END]

**Items:** ["a", "b"]
**Correct Order:** [2,1]
`);

    expect(result).toHaveLength(3);
    expect(result.every((block) => !("error" in block))).toBe(true);

    if (!("error" in result[0]) && !("error" in result[1]) && !("error" in result[2])) {
      expect(result[0].category).toBe("READING");
      expect(result[1].metadata.type).toBe("short_answer");
      expect(result[2].metadata.type).toBe("ordering");
    }
  });

  it("parses sample.md without runtime failures", () => {
    const samplePath = resolve(process.cwd(), "sample.md");
    const sampleContent = readFileSync(samplePath, "utf8");
    const result = parseTaggedInput(sampleContent);

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((block) => !("error" in block) && block.category === "READING")).toBe(true);
    expect(result.some((block) => !("error" in block) && block.category === "EXERCISE")).toBe(true);
  });
});
