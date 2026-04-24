# GitHub Issues Backlog (Ready to Create)

This backlog contains detailed, repo-specific issues you can directly open on GitHub.

Recommended label groups:
- Type: `bug`, `enhancement`, `refactor`, `docs`, `test`
- Area: `area:parser`, `area:studio`, `area:ui`, `area:storage`, `area:tests`, `area:dx`
- Difficulty: `good first issue`, `difficulty:moderate`, `difficulty:hard`

---

## 1) Guard localStorage history parsing to prevent crashes

- **Difficulty:** Simple
- **Labels:** `bug`, `area:storage`, `good first issue`

### Problem
`components/studio/Studio.tsx` reads `duos-studio-history` using `JSON.parse` without error handling. Corrupted storage data can break snapshot save flow.

### Expected behavior
Saving a snapshot should never crash even when history data is malformed.

### Tasks
- Add safe parsing with fallback to `[]`.
- Handle `JSON.parse` exceptions.
- Keep existing behavior for valid history.

### Acceptance criteria
- Corrupted `duos-studio-history` does not throw at runtime.
- Snapshot save still succeeds and writes valid JSON.

---

## 2) Add max input size warning before compile

- **Difficulty:** Simple
- **Labels:** `enhancement`, `area:studio`, `good first issue`

### Problem
Very large pasted files can feel frozen during compile. Users get no early warning.

### Expected behavior
Before processing very large input, show a warning toast with approximate size and allow user to continue.

### Tasks
- Define input size threshold (for example 300 KB).
- Show non-blocking warning in `handleProcess`.
- Keep current processing flow unchanged.

### Acceptance criteria
- Large input surfaces warning once per compile action.
- No behavior change for normal inputs.

---

## 3) Improve parser error detail for duplicate block IDs

- **Difficulty:** Moderate
- **Labels:** `enhancement`, `area:parser`, `difficulty:moderate`

### Problem
Duplicate ID errors currently return only `Duplicate block ID: <id>`, without showing where duplicates occur.

### Expected behavior
Error output should include duplicate count and block positions to make fixing faster.

### Tasks
- Track duplicate IDs with indices/order.
- Return richer error message (id + count + positions).
- Add/extend parser tests for duplicates.

### Acceptance criteria
- Duplicate error includes actionable context.
- Tests cover two and three-duplicate cases.

---

## 4) Handle unparsed text segments outside tagged blocks

- **Difficulty:** Moderate
- **Labels:** `bug`, `area:parser`, `difficulty:moderate`

### Problem
`parseTaggedInput` extracts valid tagged blocks but silently ignores text outside block markers, which can hide authoring mistakes.

### Expected behavior
Unparsed non-whitespace segments should create explicit `ErrorBlock` entries.

### Tasks
- Detect gaps between regex matches.
- Emit warning/error blocks for stray content.
- Add tests for leading/trailing/interleaved untagged text.

### Acceptance criteria
- Stray content becomes visible in parser output.
- Existing valid sample parsing remains stable.

---

## 5) Add strict validation for ordering exercise indices

- **Difficulty:** Moderate
- **Labels:** `bug`, `area:parser`, `difficulty:moderate`

### Problem
`parseNumberArray` drops invalid values silently and accepts partial arrays, which may allow incorrect `correct_order`.

### Expected behavior
Ordering blocks should fail clearly when indices are invalid, duplicated, or out of range.

### Tasks
- Validate numeric parsing strictly.
- Ensure `correct_order` references valid item positions.
- Add test coverage for malformed ordering arrays.

### Acceptance criteria
- Invalid ordering metadata returns deterministic error.
- Valid ordering inputs remain unchanged.

---

## 6) Add parser tests for malformed metadata lines

- **Difficulty:** Simple
- **Labels:** `test`, `area:tests`, `good first issue`

### Problem
Current tests focus on valid structures and a few failures, but metadata edge cases are under-covered.

### Expected behavior
Parser tests should cover malformed metadata formatting and unknown keys behavior.

### Tasks
- Add tests for missing `:` separators.
- Add tests for empty key values and repeated keys.
- Add tests for unknown metadata keys being ignored safely.

### Acceptance criteria
- New test cases pass and increase confidence in metadata parsing.
- No runtime regressions introduced.

---

## 7) Add keyboard shortcuts for compile/save workflow

- **Difficulty:** Moderate
- **Labels:** `enhancement`, `area:ui`, `difficulty:moderate`

### Problem
Power users cannot quickly compile or snapshot from keyboard.

### Expected behavior
Provide shortcuts like `Ctrl/Cmd + Enter` for compile and `Ctrl/Cmd + S` for snapshot in Studio.

### Tasks
- Add scoped keyboard listeners in Studio.
- Prevent browser save default only within workspace context.
- Show shortcut hints near buttons.

### Acceptance criteria
- Shortcuts work on Windows/macOS.
- No global shortcut side effects outside Studio context.

---

## 8) Introduce parser benchmark test for large content

- **Difficulty:** Hard
- **Labels:** `enhancement`, `area:parser`, `area:tests`, `difficulty:hard`

### Problem
No visibility into parser performance regressions for large inputs.

### Expected behavior
Add repeatable benchmark script/test with performance budget tracking for large sample content.

### Tasks
- Create synthetic large tagged document fixture.
- Measure parse duration and memory trends.
- Document baseline numbers in repo docs.

### Acceptance criteria
- Benchmark runs locally with npm script.
- Baseline metrics are recorded and reproducible.

---

## 9) Add end-to-end smoke test for import -> compile -> focus view

- **Difficulty:** Hard
- **Labels:** `test`, `area:tests`, `area:studio`, `difficulty:hard`

### Problem
Core user journey is not protected by E2E tests; regressions can slip through despite unit tests.

### Expected behavior
Automated smoke test validates the main flow from input to rendered blocks.

### Tasks
- Add E2E framework (Playwright recommended).
- Cover sample import, compile action, and `/content` navigation.
- Assert valid + error block rendering behavior.

### Acceptance criteria
- E2E test runs in CI/local and passes reliably.
- Test catches at least one intentional regression in trial run.

---

## 10) Improve accessibility semantics in Studio controls

- **Difficulty:** Moderate
- **Labels:** `enhancement`, `area:ui`, `difficulty:moderate`

### Problem
Current tab and action controls may not expose ideal ARIA labels/instructions for assistive technologies.

### Expected behavior
Primary actions, tabs, and status messages should be screen-reader friendly.

### Tasks
- Audit controls in `Studio.tsx` and `ImportWorkspace.tsx`.
- Add meaningful `aria-label`/`aria-live` where needed.
- Ensure keyboard focus states are clear and consistent.

### Acceptance criteria
- Basic screen-reader pass for compile/save/tab navigation.
- No visual regressions in current design language.

---

## 11) Add issue templates and label documentation under .github

- **Difficulty:** Simple
- **Labels:** `docs`, `area:dx`, `good first issue`

### Problem
As an open-source project, issue intake is currently unstructured.

### Expected behavior
GitHub issue templates should guide bug reports and feature requests with required context.

### Tasks
- Add `bug_report.md` and `feature_request.md` templates.
- Add short label usage doc (`.github/LABELS.md`).
- Link templates in `README.md` or contributing docs.

### Acceptance criteria
- New issues opened from templates include reproducible information.
- Maintainers can triage faster with consistent label conventions.

---

## 12) Add parser diagnostics mode for author feedback

- **Difficulty:** Hard
- **Labels:** `enhancement`, `area:parser`, `area:studio`, `difficulty:hard`

### Problem
Errors are block-level only; content authors lack richer diagnostics like warnings, hints, and field-level context.

### Expected behavior
Optional diagnostics mode returns warnings and actionable hints (without failing valid blocks).

### Tasks
- Define diagnostics schema (`severity`, `code`, `message`, `context`).
- Extend parser to emit warnings for suspicious but parseable content.
- Display diagnostics in preview/focus views.

### Acceptance criteria
- Diagnostics mode can be toggled without changing default strict behavior.
- At least 5 warning scenarios are implemented and tested.
