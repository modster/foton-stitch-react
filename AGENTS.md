# AGENTS.md — Foton

## Project

Cross-platform camera app (Android, iOS, Desktop, Web) applying real-time GPU shader effects to the camera feed. Long exposures + hardware-rendered effects. Early stage — no source code yet, design phase.

## Stitch Integration

- The Stitch MCP server is configured in `opencode.json`. All Stitch tool calls use the `stitch_` prefix (e.g., `stitch_list_projects`, `stitch_get_screen`, `stitch_generate_screen_from_text`).
- **Stitch Project ID:** `4117826763267720202` (title: "Pro Android Camera")
- Screen assets (screenshots + HTML) are saved under `screens/{n}-{name}/` with `screenshot.png` and `code.html`.

## Design System

- Full design system is documented in `DESIGN.md` — the source of truth for visual language, color palette, typography, and component patterns.
- When generating new Stitch screens, reference `DESIGN.md` for consistent design tokens and styling conventions.

## Key Conventions

- All Stitch screen HTML uses Tailwind CSS via CDN with a custom `tailwind.config` block defining the project's named color tokens (primary `#a78bfa`, tertiary `#34d399`, zinc surface scale).
- Font: **Geist** throughout (headline, body, label).
- Dark mode only — never use light backgrounds.
- Border-based separation (`border-zinc-800`) over shadows.
- Technical camera values always use `font-mono`; micro-labels always uppercase with wide tracking.
- `package.json` is ESM (`"type": "module"`).
- No tests, linter, or build pipeline yet (`npm test` is a placeholder that exits 1).

## Sensitive Files

- `.env` contains API keys — never commit.
