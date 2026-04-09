# AGENTS.md

## Project

Cross-platform camera app (Android/iOS/Desktop/Web) with real-time GPU shader effects, long exposures, and modular extension ecosystem.

The repository now contains:

- A React + Vite prototype in the repository root
- A native Android Jetpack Compose port in `android/`

The React app remains the reference implementation for feature intent and UI behavior. The Android app is a native port, not a shared-code setup.

## Stack

### Web Prototype

- **React 19** + **TypeScript** + **Vite 6** (ESM: `"type": "module"`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (not PostCSS — v4 style config)
- **Zustand v5** for state
- **react-router-dom v7** for routing
- TypeScript ~5.7

### Android App

- **Kotlin** + **Jetpack Compose** + **Material 3**
- **Navigation Compose** for routing
- **ViewModel** state holder replacing Zustand stores
- **CameraX** for preview, image capture, and video capture
- **Coil** for image loading in the gallery

## Build & Run

### Web

```sh
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build (typecheck then build)
npm run preview      # Vite production preview
```

No test command is configured yet (`npm test` exits with error).

### Android

- Open `android/` in Android Studio and run the `app` configuration
- The Android project currently has Gradle build files but no committed Gradle wrapper yet
- If shell `gradle` is unavailable, use Android Studio to generate/sync the project first

## Design

The full design system is in `DESIGN.md`. It defines color palette (obsidian-dark theme), typography (Geist font), component stylings, and layout rules for the camera UI. Any UI work in either the web prototype or the Android app must follow `DESIGN.md`.

The project uses the **Stitch MCP** (configured in `opencode.json`) for design generation.

## Conventions

- Dark-only UI — never use light backgrounds
- Camera values (ISO, shutter speed, etc.) always use a monospace presentation
- Micro-labels are uppercase with wide tracking (signature pattern)
- Borders (`border-zinc-800`) for separation, not shadows
- Accent colors are functional only: violet = interactive, emerald = active/success, red = danger/recording
- no background on header and footer - they should float above the camera preview (which is the main content) — use borders to separate, not backgrounds
- Keep React and Android feature behavior aligned where practical; if parity is not implemented natively yet, document the gap instead of faking it
- For Android camera work, prefer CameraX/Android-native APIs rather than recreating browser media patterns

## Gotchas

- Tailwind v4 uses CSS-based config (`@theme` in CSS), not `tailwind.config.js` — don't create one
- `opencode.json` is gitignored (contains MCP keys)
- `npm run build` runs `tsc -b` first — type errors will block the build
- The Android app lives in `android/` and is independent from the Vite app in the repo root
- The Android port currently covers app shell, navigation, theme, gallery/settings screens, and CameraX-backed preview/capture flow
- Advanced web-only behaviors are not fully ported yet: manual focus distance, long-exposure compositing, video thumbnails, and MediaStore export
- Do not assume `gradle` is installed on the shell path in this environment