# Design System: Pro Android Camera (Obsidian)

**Project ID:** 4117826763267720202

---

## 1. Visual Theme & Atmosphere

**Northern Lights: "Dark Mode by Default"**

A developer-grade, high-contrast dark UI built for a professional Android, IOS, Desktop camera application. The aesthetic is surgical and utilitarian — every pixel earns its place. Near-black surfaces absorb the periphery while high-contrast text and deliberate accent colors cut through with clarity. The mood is _stealthy competence_: the interface recedes to let the viewfinder dominate, surfacing controls only when needed through frosted-glass overlays that feel like looking through a lens.

The design language draws from cinematic viewfinder HUDs — think of a photographer's heads-up display at night, where information floats over the scene with minimal visual friction. Surfaces are flat and shadowless, using razor-thin borders for separation instead of elevation. The result is an interface that feels fast, precise, and purpose-built — never decorative, always functional.

**Descriptive keywords:** Obsidian-dark, Cinematic HUD, Surgical precision, Frosted-glass overlays, Developer-grade, Flat-and-fast, Stealth-utility

---

## 2. Color Palette & Roles

### Primary Accent — Soft Violet

- **Dreamlike Lavender-Violet** (`#a78bfa`) — The primary interactive accent. Used for focus rings, icon tints on interactive buttons, active toggle fills, and all primary actions. A deliberately non-default violet that feels ethereal against the dark surfaces, guiding the eye without shouting.
- **Deep Electric Amethyst** (`#7c3aed`) — Primary container. A deeper, more saturated violet used for filled containers and emphasis backgrounds.
- **Pale Lavender Mist** (`#ede9fe`) — On primary container. Light lavender for text placed on primary container backgrounds.
- **Iced Lilac** (`#c4b5fd`) — Primary fixed dim. A lighter, pastel violet for subtle highlights and dimmed interactive states.
- **Midnight Grape** (`#5b21b6`) — Inverse primary / On primary fixed variant. A deep purple used for inverse surfaces and variant states.
- **Cosmic Indigo** (`#2e1065`) — On primary fixed. Darkest violet, used for text on fixed primary backgrounds.

### Tertiary Accent — Emerald Green

- **Crisp Digital Emerald** (`#34d399`) — The tertiary accent. Used for success states, positive indicators, active mode indicators (e.g., "Pro" mode dot), RAW badge accents, and confirmation feedback. Signals "active and ready."
- **Deep Forest Teal** (`#065f46`) — Tertiary container. A dark, muted green for container backgrounds housing tertiary content.
- **Soft Mint Glow** (`#bbf7d0`) — On tertiary container. Light mint for text on tertiary containers.
- **Phosphor Mint** (`#6ee7b7`) — Tertiary fixed dim. A lighter mint-emerald for slider tracks, progress indicators, and active control highlights.
- **Verdant Shadow** (`#047857`) — On tertiary fixed variant. A mid-tone green for variant states.

### Surface Hierarchy — Zinc Scale

The surface system uses an ultra-subtle zinc-gray staircase. Each tier is barely distinguishable from its neighbor, creating depth through imperceptible shifts rather than dramatic contrast:

- **True Void Black** (`#09090b`) — Background / Surface container lowest. The absolute base layer, a near-perfect black with the faintest warm undertone.
- **Obsidian Slate** (`#0c0c0f`) — Surface / Surface dim. The default surface for primary content areas, one shade above true black.
- **Whisper Carbon** (`#0f0f12`) — Surface container low. Used for slightly elevated containers.
- **Deep Charcoal** (`#121215`) — Surface container. The workhorse container background for cards, panels, and grouped settings.
- **Gunmetal Zinc** (`#18181b`) — Surface container high / Surface variant / Surface bright. The highest commonly-used surface, for elevated cards and hover states.
- **Dark Iron** (`#1e1e22`) — Surface container highest. The topmost surface tier, used sparingly for the most elevated elements.

### Text & Content

- **Brilliant Arctic White** (`#fafafa`) — On surface / On background. Primary text color. Near-white with a hair of warmth, never clinical pure white.
- **Cool Muted Steel** (`#a1a1aa`) — On surface variant / On secondary container. Secondary text, descriptions, and less-prominent labels.
- **Warm Ash** (`#71717a`) — Secondary. Tertiary-level text and disabled states.
- **Dim Graphite** (`#52525b`) — Outline. Used for dividers, borders on less-interactive elements.
- **Charcoal Mist** (`#3f3f46`) — On secondary fixed variant. Deepest text variant for subtle labels.

### Borders & Separation

- **Slate Edge** (`#27272a`) — Outline variant. The primary border color used for all card outlines, dividers, and container separation. The linchpin of the flat, border-based separation strategy.
- **Dim Graphite** (`#52525b`) — Outline. A slightly brighter border for interactive outlines and focus states.

### Error & Danger

- **Alarm Red** (`#ef4444`) — Error. Used exclusively for error states, recording indicators, and the video record button. Never used decoratively.
- **Blood Crimson** (`#3b1111`) — Error container. Deep red background for error containers.
- **Blush Warning** (`#fca5a5`) — On error container. Light coral for text on error backgrounds.

### Inverse Mode

- **Inverted Snow** (`#fafafa`) — Inverse surface. White background for inverse-mode surfaces.
- **Inverted Obsidian** (`#09090b`) — Inverse on surface. Dark text on inverse surfaces.

---

## 3. Typography Rules

### Font Family

**Geist** — Used exclusively across headline, body, and label roles. A modern, geometric sans-serif with a developer sensibility: clean counters, uniform stroke width, and exceptional legibility at small sizes. The typeface reinforces the "precision instrument" character of the app.

### Weight Strategy

- **Black (900):** Screen titles in the TopAppBar (e.g., "Camera," "Exposure," "Settings"). Commands immediate visual authority.
- **Bold (700):** Section headers, category labels, badge text, and mode selector active states. Carries structural weight.
- **Semibold (600):** Navigation labels and secondary headings.
- **Medium (500):** Body text in control panels, active navigation items.
- **Regular (400):** Description text, secondary content, icon labels.

### Special Typographic Treatments

- **Monospace (font-mono):** All technical camera values — shutter speed ("1/500"), ISO ("200"), white balance ("5500K"), aperture ("f/1.8"). Reinforces the precision instrument feel and ensures numeric data is easy to scan.
- **Micro-labels (10px, uppercase, tracking-widest, bold):** HUD parameter labels like "SHUTTER," "ISO," "EV," "WB." These tiny, widely-spaced uppercase labels are a signature pattern — they whisper technical authority.
- **Tracking-tight on headings:** Titles use tight letter-spacing for a compact, authoritative feel.
- **Tracking-wider/tracking-widest on labels:** Mode selectors, category headers, and badge text use expanded letter-spacing for a premium, architectural rhythm.

### Text Color Hierarchy

1. `#fafafa` — Primary content, titles, active values
2. `#a1a1aa` — Secondary descriptions, inactive labels
3. `#71717a` — Tertiary text, disabled states
4. `#52525b` — Subtle dividers, least-prominent text
5. `#a78bfa` (Primary violet) — Highlighted values, focus states, interactive accents
6. `#34d399` (Emerald) — Active indicators, success states, mode highlights

---

## 4. Component Stylings

### TopAppBar

Fixed at the top with a frosted-glass effect: `bg-zinc-950/80` with `backdrop-blur-md` and a single `border-b border-zinc-800`. Height: 56px (`h-14`). Center-aligned title in Geist Black, flanked by icon buttons on both sides. The bar is translucent, allowing the viewfinder to show through — the UI floats over the content rather than blocking it.

### Icon Buttons

Pill-shaped (`rounded-full`), using Soft Violet (`#a78bfa`) icon color with `hover:bg-zinc-800` and `active:scale-95` press feedback. Minimalist transition creates a snappy, responsive feel. Standard padding: `p-2`.

### HUD Overlay Chips

Technical camera parameters displayed in small, translucent boxes: `bg-zinc-950/60` with `backdrop-blur-md` and `border border-zinc-800`. Subtly rounded corners (`rounded` / `rounded-lg`). Each chip contains a micro-label (9-10px uppercase dim text) above a monospace value. These float over the viewfinder like a fighter pilot's HUD.

### Shutter / Record Button

The primary action control, centered in the bottom navigation:

- **Photo mode:** Dual-ring construction — outer ring (`w-16 h-16`, `border-4 border-zinc-100`) with inner filled disc (`w-12 h-12 bg-zinc-100`). Classic camera shutter metaphor.
- **Video mode:** Solid red disc (`w-14 h-14 bg-error rounded-full`) with a glowing shadow (`shadow-[0_0_20px_rgba(239,68,68,0.3)]`) and a `border-4 border-black` inset.
- **Long exposure mode:** White disc with an SVG progress ring animating around it in Alarm Red (`#ef4444`).
- All variants use `active:scale-90` or `active:scale-95` press feedback.

### Mode Selectors

Horizontal scrolling strips of uppercase, widely-tracked labels (10-11px). Inactive modes in Cool Muted Steel (`#a1a1aa`), active mode in Crisp Digital Emerald (`#34d399`) or Soft Violet (`#a78bfa`) with a small dot indicator beneath. Some variants use a left-border accent (`border-l-4 border-tertiary`) on the active pill.

### Bento Control Cards

Rectangular panels with frosted-glass backgrounds (`bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800`) and generously rounded corners (`rounded-xl`). Used in the Stars mode for grouped controls (Tracking toggle, Noise Reduction, Trail Length slider). These create a modular, dashboard-like control surface.

### Toggle Switches

Pill-shaped track (`w-10 h-5 rounded-full`) with Off state in `bg-zinc-800` and On state in `bg-primary` (`#a78bfa`). White circular thumb (`after:bg-white after:rounded-full after:h-4 after:w-4`) with smooth translate-x transition. Used throughout Settings for feature toggles.

### Filter Chips

Pill-shaped buttons (`rounded-full`) with active state using `bg-primary text-on-primary` and inactive state using `bg-surface-container border border-outline-variant text-on-surface-variant`. Compact padding: `px-4 py-1.5`.

### Gallery Grid

Asymmetric bento grid layout (`grid grid-cols-4 gap-3`). Featured images span full width (`col-span-4`), side items use `col-span-2`, and thumbnails are single-column. Each cell has a `rounded-xl border border-outline-variant` frame with hover scale transforms (`group-hover:scale-105`).

### EXIF Data Overlays

Frosted-glass panels positioned at the bottom of gallery images: `bg-zinc-950/80 backdrop-blur-md rounded-lg border border-zinc-800`. Technical data displayed in monospace with Crisp Digital Emerald (`#34d399`) values, separated by hair-thin vertical dividers (`w-px h-6 bg-zinc-800`).

### Zoom / Lens Selector

Pill-shaped containers (`rounded-full`) with frosted glass (`bg-zinc-950/40 backdrop-blur-md border border-zinc-800/50`). Active zoom level gets a filled pill (`bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700`) with violet or white text.

### Settings Rows

Grouped in surface-container cards (`rounded-xl border border-outline-variant overflow-hidden`). Each row has a leading icon in a small square container (`w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800`), with violet or emerald icon tint depending on category. Rows separated by `border-b border-outline-variant`.

### Focus Slider

Vertical line (`w-0.5 bg-zinc-800`) with a glowing dot indicator (`bg-violet-400 rounded-full ring-4 ring-violet-400/20`). Tick marks at extremes. Rotated "FOCUS" label in micro-text. Minimalist and precise.

### Viewfinder Grid

3×3 grid overlay using `opacity-20` with `border-r border-b border-zinc-100` for rule-of-thirds composition guides. Subtle enough not to distract, visible enough to compose.

### Vignette Frame

Device-shaped border overlay (`border-[12px] border-zinc-950/20 rounded-[40px]`) simulating a phone screen bezel for immersive full-screen viewfinder mode.

---

## 5. Layout Principles

### Viewport Strategy

All screens target modern mobile devices. Camera screens use the full viewport as a viewfinder with UI elements overlaid as absolute-positioned floating controls. Non-camera screens (Gallery, Settings) use standard scrolling layouts with fixed top bars and no bottom bars.

### Frosted-Glass Layering

The defining spatial strategy. Viewfinder-adjacent controls use `backdrop-blur-md` (12px blur) or `backdrop-blur-2xl` (24px blur) with semi-transparent backgrounds (`bg-zinc-950/60`, `bg-black/40`, `bg-zinc-900/80`). This creates a depth hierarchy where the live camera feed sits at the deepest layer and UI controls float above it with a recognizable "through-glass" quality. The blur intensity signals importance: stronger blur = more interactive control.

### Border-Based Separation Over Shadows

Shadows are virtually absent from the design system. Instead, separation is achieved through:

1. **Hairline borders** (`border border-zinc-800`, `border border-outline-variant`)
2. **Surface-tier shifts** (moving from `#09090b` → `#121215` → `#18181b`)
3. **Opacity steps** (bg-zinc-950/60, bg-zinc-950/80, bg-zinc-950)

This flat, border-driven approach reinforces the "precision instrument" feel — nothing is fuzzy or ambiguous.

### Edge-to-Edge Immersion

Camera screens use `overflow-hidden` with the viewfinder image filling the entire viewport. Gradient overlays (`bg-gradient-to-t from-black via-transparent to-transparent`) fade the edges, ensuring overlaid text is always legible without hard boundaries. The TopAppBar and BottomNavBar use semi-transparent backgrounds to maintain visual continuity with the scene beneath.

### Whitespace Strategy

- **Camera screens:** Minimal whitespace — controls are compact and tightly packed to maximize viewfinder real estate. Spacing is achieved through the `gap` utility (typically `gap-1` to `gap-4`) rather than padding.
- **Settings:** Generous section spacing (`space-y-8`) with comfortable row padding (`p-4`). Category headers get `mb-4` breathing room.
- **Gallery:** Grid gap of `gap-3` creates a tight but consistent masonry rhythm.

### Fixed Chrome Pattern

Every screen has a fixed TopAppBar (h-14, z-50) at the top and a fixed BottomNavBar (h-24, z-50) at the bottom. Main content is padded with `pt-14 pb-24` to clear the chrome. Camera screens override this with `pt-14 pb-48` to create more room for mode selectors above the bottom bar.

### Content Max-Width

Non-camera screens constrain their content width: Settings uses `max-w-2xl mx-auto`, Gallery uses `max-w-7xl mx-auto`. Camera screens are always full-bleed.

---

## 6. Animation & Interaction

### Press Feedback

All interactive elements use `active:scale-95` or `active:scale-90` with `transition-transform duration-150` or `duration-200`. This creates a snappy, tactile press sensation that feels like pressing a physical button.

### Hover States

Subtle background shifts to the next surface tier (`hover:bg-zinc-800`, `hover:bg-surface-container-high`). Icon color transitions from dim zinc to bright white or violet (`hover:text-zinc-200`, `hover:text-primary`). Never dramatic — just a whisper of response.

### Pulse Animation

Used for live/recording indicators: `animate-pulse` on small dots (the "EXPOSING" dot, the gallery selection dot). Conveys active capture state without being distracting.

### Scale Transitions

Gallery images use `group-hover:scale-105 transition-transform duration-500` for a slow, cinematic zoom on hover. The long duration (500ms) creates a deliberate, professional-feeling interaction.

### Grayscale Transitions

Settings preview image uses `grayscale group-hover:grayscale-0 transition-all duration-700` — a 700ms color reveal that adds a dramatic, editorial quality.

---

## 7. Iconography

**Material Symbols Outlined** — All icons use the outlined variant with specific variable font settings: `FILL: 0, wght: 400, GRAD: 0, opsz: 24`. Icons are never filled by default; the outlined style maintains the lightweight, technical aesthetic. Icon sizes are typically 20-24px for controls and 2xl (1.5rem) for primary actions.

Key icon patterns:

- Camera mode icons in the TopAppBar use Soft Violet (`text-violet-400`)
- Settings row icons use Violet (`text-primary`) or Emerald (`text-tertiary`) depending on category
- Navigation icons in BottomNavBar use neutral zinc with hover activation
- The cameraswitch icon is always present in the bottom-right corner

---

## 8. Design Rules & Constraints

1. **Never use light backgrounds.** The entire system is built on near-black surfaces. Even "elevated" surfaces barely lighten.
2. **Borders over shadows.** Always prefer `border border-zinc-800` for separation. Shadows are reserved exclusively for the shutter button's glow effect.
3. **Accent colors for function, never decoration.** Violet signals interactivity. Emerald signals active/success. Red signals danger/recording. No other colors appear.
4. **Frosted glass for viewfinder overlays.** Any control sitting over the live camera feed must use `backdrop-blur` with semi-transparent backgrounds.
5. **Technical data in monospace.** All camera parameters (ISO, shutter, aperture, etc.) use `font-mono` to reinforce the precision instrument identity.
6. **Micro-labels always uppercase with wide tracking.** Parameter names ("ISO," "EV," "WB") are always 9-10px, uppercase, and tracked wide — this is a signature pattern.
7. **Flat hierarchy.** No component uses more than two levels of visual nesting. Settings rows, cards, and HUD chips are single-depth containers.
8. **Compact density.** Padding and gaps are minimal. The UI prioritizes the camera feed over its own real estate. Every pixel of chrome is justified by function.
