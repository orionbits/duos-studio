# Duos Studio

Duos Studio is a local-first learning content studio that parses tagged Markdown into interactive reading/exercise blocks.

The app is fully offline:
- No Gemini
- No Firebase
- No remote APIs required
- Local browser storage is used for draft/history persistence

## Features

- Import tagged `.md` or `.txt` files
- Paste and edit content in a structured workspace
- Compile/parse into validated reading + exercise blocks
- Focused review view with tabs and pagination for reduced scrolling
- Local history snapshots for quick restore

## Quick Start

### Prerequisites

- Node.js 20+ recommended
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```

## How To Use

1. Open the home page.
2. In the import workspace, either:
   - Upload a `.md`/`.txt` file, or
   - Paste tagged content manually, or
   - Click `Load Sample` to load `sample.md`.
3. Click `Compile Data`.
4. Review output in the focused content view:
   - Use section tabs (`All`, `Reading`, `Exercises`, `Errors`)
   - Use pagination controls to navigate blocks
5. Save snapshots to local library when needed.

## Input Format

The parser expects tagged blocks such as:
- `[READING_START] ... [READING_END]`
- `[EXERCISE_START] ... [EXERCISE_END]`

See `sample.md` for a complete working example.

## Data Storage

All persisted data is local in browser `localStorage`:
- `duos-studio-buffer` for current draft
- `duos-studio-history` for saved snapshots

Clearing browser storage removes these records.

## Scripts

- `npm run dev` - run local dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm test` - run parser/unit tests

## Troubleshooting

- If the page shows no parsed content, ensure your markdown uses required tags and metadata fields.
- If UI appears stale, hard-refresh the browser after pulling new changes.
- If tests fail, run `npm install` again to ensure lockfile dependencies are synced.

## Contributing

See `CONTRIBUTING.md` for full contributor onboarding, architecture notes, and contribution workflow.
