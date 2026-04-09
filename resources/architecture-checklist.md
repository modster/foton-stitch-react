# Architecture Quality Gate

### Structural integrity
- [ ] Logic extracted to custom hooks in `src/hooks/`.
- [ ] No monolithic files; strictly Atomic/Composite modularity.
- [ ] All static text/URLs moved to `src/data/mockData.ts`.

### Type safety and syntax
- [ ] Props use `Readonly<T>` interfaces.
- [ ] File is syntactically valid TypeScript (no red squiggles).
- [ ] Placeholders from templates (e.g., `StitchComponent`) have been replaced with actual names.

### Styling and theming
- [ ] Dark-only UI — no light backgrounds used.
- [ ] No hardcoded hex values; use theme-mapped Tailwind classes.
- [ ] Camera values use `font-mono`.
- [ ] Micro-labels are uppercase with `tracking-widest`.