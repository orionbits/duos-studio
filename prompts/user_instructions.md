# User Instructions: Textbook-to-Exercise Workflow

This guide explains how to use the "Duos" application to convert physical textbook pages into interactive web exercises using AI.

---

## The Workflow

### Phase 1: Extraction
1. **Target PDF:** Open your textbook PDF.
2. **LLM Prompt:** Copy the `extractor.md` prompt.
3. **Execution:** Paste the prompt into an LLM (Gemini, ChatGPT) along with the textbook text for the desired pages.
4. **Result:** You will get a clean Markdown version of the textbook content.

### Phase 2: Answer Key Extraction
1. **Target PDF:** Open the solution manual/answer key PDF.
2. **LLM Prompt:** Copy the `extractor_ans.md` prompt.
3. **Execution:** Paste the prompt and the answer key text into the LLM.
4. **Result:** You will get a clean Markdown version of the solution key.

### Phase 3: Tagging & Alignment
1. **Inputs:** Gather the outputs from Phase 1 (`[MAIN_TEXT]`) and Phase 2 (`[ANSWER_KEY]`).
2. **LLM Prompt:** Copy the `Tagging.md` prompt.
3. **Execution:** Paste the prompt and both inputs into the LLM.
4. **Result:** The LLM will generate the **Intermediate Tagging Format** (blocks starting with `[READING_START]` or `[EXERCISE_START]`).

### Phase 4: Import & Review
1. **Copy:** Copy the entire output from Phase 3.
2. **Duos App:** Navigate to the main page of the Duos app.
3. **Paste:** Paste the text into the **Tagged Input** field.
4. **Process:** Click **Process**.
5. **Review:** Individual interactive components will appear on the right. 
   - Check for any `[ERROR]` blocks.
   - Test the exercises to ensure they work as expected.
6. **Save:** Once satisfied, click **Save** to persist the data to Supabase.

---

## Troubleshooting

- **Missing Answers:** If you see `[ERROR: MISSING_ANSWER]`, it means the tagger couldn't find a matching entry in the answer key. Double-check your `[ANSWER_KEY]` input.
- **Invalid Type:** Ensure the `type:` field in the metadata block matches one of the supported types (see `Tagging.md`).
- **Audio Tracks:** If the exercise is a listening task, ensure `audio: true` and the `audio_track` field contains the track number (e.g., `"1.05"`).
