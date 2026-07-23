# Tech Stack & Design System

The reusable stack and design language used across projects. No file paths — copy
this into a new project and install the same packages, tokens and rules.

---

## 1. Core Stack

| Layer | Package | Version | Purpose |
| :--- | :--- | :--- | :--- |
| Framework | `react`, `react-dom` | ^18.3 | Function components + hooks, JSX (no TypeScript) |
| Build | `vite` | ^5.4 | Dev server + ESM build |
| | `@vitejs/plugin-react` | ^4.3 | Fast Refresh |
| Routing | `react-router-dom` | ^6.30 | `BrowserRouter`, code-split routes |
| Styling | `tailwindcss` | ^3.4 | Utility CSS |
| | `postcss`, `autoprefixer` | ^8.5 / ^10.5 | Pipeline |
| | `tailwindcss-animate` | ^1.0 | Animation utilities |
| Components | shadcn/ui pattern | — | Copied-in components, not a dependency |
| | `@radix-ui/react-accordion` | ^1.2 | Accordion primitive |
| | `@radix-ui/react-dialog` | ^1.1 | Dialog / sheet primitive |
| | `@radix-ui/react-navigation-menu` | ^1.2 | Nav menu primitive |
| | `@radix-ui/react-slot` | ^1.3 | `asChild` composition |
| Class utils | `clsx` | ^2.1 | Conditional classes |
| | `tailwind-merge` | ^3.6 | Dedupe conflicting Tailwind classes |
| | `class-variance-authority` | ^0.7 | Component variants |
| Icons | `lucide-react` | ^1.24 | Icon set |
| Lint | `eslint` 9 flat config | ^9.13 | + `react`, `react-hooks`, `react-refresh` |

**Standard helper** — every project gets this one:
```js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...inputs) => twMerge(clsx(inputs))
```

---

## 2. Motion Stack

| Package | Version | Use it for |
| :--- | :--- | :--- |
| `framer-motion` | ^12.42 | Component-level motion: reveals, page transitions, springs, `AnimatePresence`, carousels |
| `gsap` | ^3.15 | Imperative timelines and particle/spotlight effects that framer makes awkward |
| `lenis` | ^1.3 | App-wide inertia smooth scroll |

**Rule of thumb:** framer for anything declarative and per-component; GSAP only
where you need a timeline or to animate hundreds of raw DOM nodes; never both on
the same element.

**Lenis config that works:**
```js
new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // expo-out
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
})
```
Lenis smooths the *real* window scroll, so `position: sticky`,
`IntersectionObserver` and scroll-progress readers all keep working. Expose the
instance globally so anchor links and scroll-to-top can drive it.

---

## 3. 3D Stack

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `three` | ^0.185 | The renderer |
| `@react-three/fiber` | ^8.18 | React renderer for three.js (`Canvas`, `useFrame`, `useThree`) |
| `@react-three/drei` | ^9.122 | Helpers: `Line`, `Text`, `Billboard`, `RoundedBox`, `useTexture` |

### Approach: procedural, not asset-based
Everything is built from three.js primitives — **no GLB/GLTF, no model
downloads**. Boxes, cylinders, capsules, spheres and rounded boxes composed into
stylised icons. Costs bundle size only, never asset weight, and restyles by
editing a material constant instead of re-exporting from Blender.

### Shared material palette
Define these once and reuse across every icon so the same object reads
identically wherever it appears:
```js
M_BODY   = { color: '#16345c', metalness: 0.45, roughness: 0.40 }
M_DARK   = { color: '#0d2242', metalness: 0.40, roughness: 0.50 }
M_LIGHT  = { color: '#20456f', metalness: 0.30, roughness: 0.55 }
M_PERSON = { color: '#0d2242', metalness: 0.25, roughness: 0.75 }
M_STEEL  = { color: '#9db6dc', metalness: 0.65, roughness: 0.32 }
PATIENT  = '#cfe0f7'   // clinical white
BLOOD    = '#ff4d4d'   // the ONLY warm accent in the whole set
ACCENT     = '#5fa6ff' // emissive readouts
ACCENT_HOT = '#9cc5ff' // hot spots, data dots
```
Emissive faces use `toneMapped={false}` so they stay neon against dark backgrounds.

### Icon authoring conventions
- Centred on the origin, roughly **1–1.3 units tall**.
- Front face toward **+Z** (the orbiting camera's side).
- **No ground plane or pedestal** — icons float.
- Share small building blocks (a glowing screen face, a capsule+sphere figure)
  rather than re-modelling them per icon.
- Register icons in a single string-keyed map so data configs can name them.

### Data-driven scenes
Keep scene *content* in a plain data file and the *engine* generic — one
component renders any number of diagrams:
```js
{
  stages: [{ key, tag, title, desc }],          // scroll steps + copy
  nodes:  [{ key, label, stage, pos:[x,y,z], icon, sublabel?, labelSide?, labelY? }],
  edges:  [[from, to]],                          // 'center' = hub at origin
  camera: { initialPosition, fov, xOffset,
            zoomRange:[a,b], azimuth:{base,swing},
            elevationRange:[a,b], lookAt:[x,y,z] },
}
```
Adding a diagram = add an entry + a one-line wrapper. The engine never changes.

### Scroll-driven 3D
Read progress from the section's own `getBoundingClientRect()` on a `rAF` loop
and write it to a **ref**, not state — never re-render per frame. Do not use
drei `ScrollControls` when you have Lenis; the rect-reading approach composes
with smooth scroll, sticky positioning and normal page layout.

```js
const total = rect.height - window.innerHeight
const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0   // 0..1
```
Section height = `stages.length * 100vh`, canvas inside a `position: sticky` box.

### 3D performance & resilience rules

| Rule | Why |
| :--- | :--- |
| Wrap every canvas in an **error boundary** | A blocked or lost WebGL context throws and would unmount the whole page. Catch it, render a CSS fallback, keep content up. |
| Split the **three.js half into its own module** and `lazy()` it | Keeps ~500KB–1MB of WebGL off the critical path. The wrapper component must import zero three.js. |
| Mount trigger depends on position | Below the fold: `IntersectionObserver` with ~`300px` rootMargin. In the hero: `requestIdleCallback` *after* `load` (with a ~2.5s timeout) — a viewport check fires instantly and lands 1MB in front of the LCP. |
| Once mounted, **stay mounted** | Tearing down a WebGL context to rebuild it on the next scroll-by costs more than idling. |
| Gate `frameloop` on visibility | `'never'` / `'demand'` off-screen, `'always'` in view — zero GPU when scrolled past. |
| Cap `dpr` at `[1, 1.75]`–`[1, 2]`, use `alpha: true` | Bounded fill cost; the canvas composites over the CSS background. |
| Reserve the canvas height in CSS up front | A late-mounting canvas must cost no layout shift. |
| `useMemo` geometries/materials; share across instances | 26 objects × 5 shapes would otherwise allocate ~90 buffers. |
| One canvas behind a **DOM grid**, not N canvases | Browsers cap WebGL contexts; DOM hit-testing beats raycasting and captions stay real, selectable text. |
| 3D is always decorative and `aria-hidden` | All copy is real DOM text that renders with or without WebGL. |

---

## 4. Typography

- **Inter**, **self-hosted variable font** — one file covers weights 100–900.
- Split latin / latin-ext by `unicode-range`, `font-display: swap`, and
  **preload** the woff2 (the `@font-face` lives inside bundled CSS, so the
  browser would otherwise only discover it after parsing that stylesheet).
- Never load it from Google Fonts: two preconnects + a render-blocking
  stylesheet chaining to a font file = three third-party round trips before
  first paint.

```
font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
```

| Role | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- |
| Hero title | `clamp(38px, 5.2vw, 68px)`, line-height 1.04 | 800 | `-1.2px` |
| Section heading | `clamp(26px, 3.4vw, 46px)`, line-height 1.08 | 800 | `-0.8px` |
| Eyebrow / label | `12.5px`, uppercase | 600 | `3px` |
| Body | 16px | 400 | normal |

Body sets `font-feature-settings: 'rlig' 1, 'calt' 1` and
`-webkit-font-smoothing: antialiased`.

---

## 5. Design Tokens

### Brand palette
| Category | Element | Value |
| :--- | :--- | :--- |
| **Background** | Top / Mid / Bottom | `#010a25` / `#021e3b` / `#01112c` |
| **Action** | Primary / Hover | `#5fa6ff` / `#74b3ff` |
| **Accent gradient** | | `linear-gradient(135deg, #5fa6ff, #74b3ff)` |
| **Surface (glass)** | Fill / Border / Radius | `rgba(16,29,43,.6)` / `rgba(95,166,255,.16)` / `18px` |
| **Panel (solid)** | | `#101d2b` |
| **Text** | Default / Muted | `#e6f0f5` / `#8ba3b5` |
| **Glow** | | `0 0 24px rgba(95,166,255,.32)` |

### Page background
Deep navy with a soft central glow — one gradient, applied to `html, body`:
```css
background-image:
  radial-gradient(55% 55% at 50% 42%,
    rgba(37,92,158,.38) 0%, rgba(20,55,100,.16) 38%, transparent 72%),
  linear-gradient(180deg, #010a25 0%, #021e3b 50%, #01112c 100%);
```
Use `overflow-x: clip` (not `hidden`) on `html, body` — `hidden` turns body into
a scroll container and breaks sticky headers.

### shadcn base variables (HSL)
```css
:root {
  --background: 213 52% 8%;      --foreground: 197 40% 93%;
  --card: 210 44% 12%;           --card-foreground: 197 40% 93%;
  --popover: 211 50% 9%;         --popover-foreground: 197 40% 93%;
  --primary: 217 100% 69%;       --primary-foreground: 210 40% 98%;
  --secondary: 208 38% 16%;      --secondary-foreground: 197 40% 93%;
  --muted: 208 34% 17%;          --muted-foreground: 202 22% 63%;
  --accent: 213 100% 69%;        --accent-foreground: 210 40% 98%;
  --destructive: 0 62% 50%;      --destructive-foreground: 0 0% 98%;
  --border: 214 32% 26%;         --input: 208 30% 22%;
  --ring: 217 100% 69%;          --radius: 0.85rem;
}
```

### Tailwind extensions
```js
boxShadow: {
  glow:      '0 0 24px rgba(95, 166, 255, 0.32)',
  'glow-lg': '0 0 60px rgba(95, 166, 255, 0.40)',
  card:      '0 18px 50px -20px rgba(0, 0, 0, 0.6)',
}
backgroundImage: { 'accent-grad': 'linear-gradient(135deg, #5fa6ff 0%, #74b3ff 100%)' }
animation: {
  'fade-up': 'fade-up 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both',
  float:     'float 6s ease-in-out infinite',
  shimmer:   'shimmer 5s linear infinite',
}
container: { center: true, padding: '1rem', screens: { '2xl': '1200px' } }
darkMode: ['class']
```

Scrollbars are thin and accent-tinted app-wide:
`scrollbar-width: thin; scrollbar-color: rgba(95,166,255,.45) transparent`
plus the `::-webkit-scrollbar` equivalents at `8px`.

---

## 6. Motion & Interaction Language

| Behaviour | How |
| :--- | :--- |
| **Smooth scroll** | Lenis app-wide; hash links go through `lenis.scrollTo(target, { offset: -90 })` |
| **Route transition** | 5 vertical curtain panels sweep away on nav, `ease [0.76, 0, 0.24, 1]`, `pointer-events: none`, skipped on first load |
| **Custom cursor** | Dot tracking 1:1 + eased trailing ring that grows over links/buttons/`[data-cursor]`; disabled on `(pointer: coarse)` |
| **Scroll reveals** | Rise + fade via `IntersectionObserver`, staggered ~60ms, with a safety net that un-hides everything if the observer misfires |
| **Card effects** | GSAP spotlight + border glow + particles + ripple; framer-spring tilt (`damping 30 / stiffness 100 / mass 2`) |
| **Reduced motion** | `prefers-reduced-motion` kills reveal animations; all 3D is decorative |

**Principles:** dark navy canvas, one blue accent, glass panels with soft glows.
Motion is slow and continuous (orbits, drifts, float) rather than snappy. Nothing
decorative may gate content.

---

## 7. Performance Rules (apply to every project)

- **Code-split every route** except the landing page. A lazy landing route
  suspends on first paint and produces a large CLS; keep it in the entry chunk.
- **Prefetch a route's chunk on link hover** so navigation never shows a spinner.
- **Do not hand-write `manualChunks` for a heavy vendor lib.** Forcing a `three`
  vendor chunk pulls Vite's `__vite_preload` helper into it, which makes every
  page chunk statically import it — the library then ships to text-only pages.
  Let Rollup hoist it into an async chunk reachable only from lazy components.
  Verify: the heavy lib must not appear in `modulepreload` links in `index.html`.
- **Self-host fonts**, preload the woff2, prefer one variable file over N weights.
- **Do not preload the hero image** when the hero is client-rendered and fades in
  — LCP is gated on the JS bundle, and the preload only steals bandwidth from it
  (measured: 2.5s → 3.9s).
- **Prerender `<head>` per route at build time** for SPAs. Social scrapers
  (WhatsApp/Slack/LinkedIn/X) read raw HTML and never execute JS, so a
  client-side head manager cannot fix Open Graph. Metadata only — snapshotting
  the DOM bakes `opacity: 0` reveal states into the markup.
- Hosting must try a real file before the SPA catch-all, or per-route HTML is
  silently defeated by a blanket rewrite.
- **SPAs must send a `page_view` on route change** — analytics snippets only fire
  on hard loads, so otherwise you record one pageview per session.
