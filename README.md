# Yash Sonkhiya — Portfolio v2

**React 18 · TypeScript · SCSS Modules · Framer Motion · Vite 5**

## What's inside

| Component           | Feature                                                     |
|---------------------|-------------------------------------------------------------|
| `CustomCursor`      | Magnetic dot + lagging ring cursor with hover states        |
| `TypewriterText`    | Multi-phrase typewriter with natural easing                 |
| `AnimatedCounter`   | Scroll-triggered count-up with easeOutQuart                 |
| `SkillSphere`       | 3D rotating Fibonacci sphere (pure CSS 3D transforms, zero deps) |
| `CommandPalette`    | ⌘K navigation modal with keyboard arrows + search          |
| `OpenToWork`        | Pulsing availability badge                                  |
| `ScrollLine`        | Top scroll-progress indicator                               |
| `Nav`               | Scroll-aware blur nav with ⌘K hint                         |
| `Hero`              | Staggered motion, typewriter role, animated counters        |
| `About`             | Prose + live metrics panel + callout                        |
| `Experience`        | Animated vertical timeline with motion fill                 |
| `Projects`          | Featured + professional work grid                           |
| `Skills`            | Grouped list + 3D sphere side by side                      |
| `Achievements`      | Recognition list with hover                                 |
| `Education`         | Clean two-column layout                                     |
| `Contact`           | Side-by-side CTA + link cards                               |

## Quick start

```bash
unzip yash-portfolio.zip
cd yash-portfolio
npm install
npm run dev        # http://localhost:5173
```

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build → /dist
npm run preview    # preview build
npm test           # jest
npm run lint       # eslint
```

## Architecture

- **No inline CSS** — every style in a `.module.scss` co-located with its component
- **Design tokens** — `src/styles/tokens.scss` is the single source of truth, imported via `vite.config.ts`
- **Data-driven** — all content in `src/data/portfolio.ts`; update once, reflects everywhere
- **Zero-dep 3D sphere** — Fibonacci sphere algorithm + CSS 3D transforms, no Three.js
- **⌘K palette** — full keyboard navigation (arrows, enter, esc)

## Deploy to Vercel

Push to GitHub → Import in vercel.com → zero config, auto-detects Vite.
