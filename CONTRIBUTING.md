# Contributing to Duos Studio

Thanks for contributing to Duos Studio. This guide helps you understand the project quickly and contribute safely.

## Project Goals

Duos Studio is a local-first app that:
- Parses tagged educational Markdown
- Renders interactive exercise components
- Keeps workflow clean, fast, and scroll-friendly
- Runs without external APIs/services

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui components
- Vitest for parser/unit tests
- Zod for schema validation

## Core Architecture

### Main Flow

1. User imports/pastes tagged content in the Studio import workspace.
2. `parseTaggedInput` (in `lib/parser.ts`) converts markdown into typed blocks.
3. Blocks are validated against schemas in `lib/schemas.ts`.
4. `ExerciseRenderer` maps blocks to dedicated exercise components.
5. Focused content page provides section tabs + pagination for readability.

### Important Directories

- `app/`
  - `page.tsx` - home/studio shell
  - `content/page.tsx` - focused parsed-content view
  - `api/health/route.ts` - lightweight health endpoint
- `components/studio/`
  - `Studio.tsx` - main studio orchestration
  - `ImportWorkspace.tsx` - input/upload/editor workspace
  - `HistoryView.tsx` - local snapshot library
- `components/exercises/`
  - Individual exercise renderers (fill blank, matching, true/false, etc.)
- `components/ExerciseRenderer.tsx`
  - Block-to-component dispatch layer
- `lib/`
  - `parser.ts` - markdown parser
  - `schemas.ts` - block schemas/types
  - `parser.test.ts` - parser behavior tests
- `sample.md`
  - Full end-to-end sample content for manual validation

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing Requirements

Before opening a PR, run:

```bash
npm test
npm run build
```

At minimum, verify:
- Parser still handles `sample.md`
- Studio import -> compile -> content view works
- No obvious regressions in existing exercise types

## Contribution Workflow

1. Create a feature/fix branch from latest main.
2. Make focused changes (small PRs preferred).
3. Update docs/tests when behavior changes.
4. Run tests and build locally.
5. Open PR with:
   - What changed
   - Why it changed
   - How it was tested
   - Screenshots/GIF for UI changes

## Coding Guidelines

- Keep existing visual aesthetic consistent.
- Do not introduce external API dependencies.
- Preserve core parsing/rendering behavior unless explicitly changing spec.
- Prefer clear composition over large monolithic components.
- Remove dead code when touched.
- Keep TypeScript types accurate and narrow.

## UI/UX Guidelines

- Avoid long single-page dumps; prefer tabs, sections, pagination, and hierarchy.
- Keep primary actions near relevant content.
- Maintain existing color/typography/spacing tone.
- Ensure mobile and desktop layouts remain usable.

## Parser & Schema Changes

If you change parsing or schema behavior:
- Update `lib/parser.test.ts`
- Add/adjust representative test cases
- Validate with `sample.md`
- Confirm all affected exercise components still render safely

## Offline-Only Policy

This repository is intentionally offline/local-first.

Do not add:
- Gemini/OpenAI/etc. calls
- Firebase/Supabase integration
- Any mandatory remote dependency for core workflow

## Common Pitfalls

- Breaking block metadata assumptions (`id`, `type`, tags, etc.)
- Returning partially invalid block data without schema-safe fallback
- Reintroducing excessive vertical scrolling in content-heavy pages
- Forgetting to test with realistic long input (`sample.md`)

## Questions

If something is unclear, open a draft PR with notes on assumptions/tradeoffs so maintainers can guide direction early.
