# Contributing to Duos Studio

Thanks for helping improve Duos Studio. This guide explains how to contribute safely and get PRs merged faster.

## Project Overview

Duos Studio is a local-first learning content studio that:
- Parses tagged educational Markdown into structured blocks
- Renders reading and interactive exercises
- Stores user data in browser storage only
- Runs fully offline (no required cloud services)

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Zod schemas for runtime validation
- Vitest for parser/unit testing

## Repository Map

- `app/` - routes and page shells
- `components/studio/` - import, review, and snapshot workflow
- `components/exercises/` - exercise-type renderers
- `components/ExerciseRenderer.tsx` - block-to-renderer dispatcher
- `lib/parser.ts` - tagged content parser
- `lib/schemas.ts` - schema definitions + validation helpers
- `lib/parser.test.ts` - parser tests
- `sample.md` - real sample input for manual validation

## Local Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Branch Naming

Use descriptive branch names:
- `feat/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `test/<short-description>`

Examples:
- `feat/parser-metadata-warning`
- `fix/history-json-parse-guard`

## Pull Request Checklist

Before creating a PR:
1. Keep changes focused (one purpose per PR).
2. Add/update tests for behavior changes.
3. Update docs when required.
4. Run:

```bash
npm test
npm run build
```

5. Verify manually:
- Import -> Compile -> Focus view flow
- Existing exercise types still render
- `sample.md` parses without regressions

## PR Description Template

Please include:
- **What changed**
- **Why it changed**
- **How it was tested**
- **Screenshots/GIF** (for UI changes)

## Issue Reporting Guide

When opening issues, include:
- Clear title (actionable and specific)
- Expected behavior vs actual behavior
- Repro steps
- Example input (if parser-related)
- Environment details (OS/browser/node)

Use labels whenever possible:
- Area: `area:parser`, `area:ui`, `area:docs`, `area:tests`, `area:storage`
- Type: `bug`, `enhancement`, `refactor`, `docs`, `test`
- Difficulty: `good first issue`, `difficulty:moderate`, `difficulty:hard`

## Coding Guidelines

- Keep TypeScript types explicit and narrow.
- Prefer small composable functions/components.
- Preserve existing UX style and information hierarchy.
- Avoid introducing external API dependencies.
- Remove dead code while touching nearby code paths.

## Parser/Schema Change Requirements

If parser or schema behavior changes:
- Update `lib/parser.test.ts`
- Add at least one failing-case test and one success-case test
- Validate with `sample.md`
- Confirm affected exercise components still render safely

## Offline-Only Policy

This project must stay local-first and usable without remote services.

Do not add mandatory dependencies on:
- LLM APIs or remote inference providers
- Firebase/Supabase or other hosted backends
- Remote persistence required for core functionality

## Code of Conduct

Be respectful, constructive, and kind in all discussions and reviews.

## Need Help?

If requirements are unclear, open a draft PR early and document your assumptions/tradeoffs.
