# AGENTS.md

## Project

Cross-platform camera app (Android/iOS/Desktop/Web) with real-time GPU shader effects, long exposures, and modular extension ecosystem. Currently in design phase — no source code yet.

## Stack

- **React 19** + **TypeScript** + **Vite 6** (ESM: `"type": "module"`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (not PostCSS — v4 style config)
- **Zustand v5** for state
- **react-router-dom v7** for routing
- TypeScript ~5.7

## Build & Run

```sh
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build (typecheck then build)
npm run preview      # Vite production preview
```

No test command is configured yet (`npm test` exits with error).

## Design

The full design system is in `DESIGN.md`. It defines color palette (obsidian-dark theme), typography (Geist font), component stylings, and layout rules for the camera UI. Any UI work must follow `DESIGN.md`.

The project uses the **Stitch MCP** (configured in `opencode.json`) for design generation.

## Conventions

- Dark-only UI — never use light backgrounds
- Camera values (ISO, shutter speed, etc.) always use `font-mono`
- Micro-labels are uppercase with wide tracking (signature pattern)
- Borders (`border-zinc-800`) for separation, not shadows
- Accent colors are functional only: violet = interactive, emerald = active/success, red = danger/recording
- no background on header and footer - they should float above the camera preview (which is the main content) — use borders to separate, not backgrounds

## Gotchas

- Tailwind v4 uses CSS-based config (`@theme` in CSS), not `tailwind.config.js` — don't create one
- `opencode.json` is gitignored (contains MCP keys)
- `npm run build` runs `tsc -b` first — type errors will block the build