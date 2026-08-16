# Yash Sonkhiya — Portfolio

[![CI](https://github.com/ysonkhiya122/Portfolio-Website/actions/workflows/ci.yml/badge.svg)](https://github.com/ysonkhiya122/Portfolio-Website/actions/workflows/ci.yml)

**Live: [yash-sonkhiya.netlify.app](https://yash-sonkhiya.netlify.app/)**

React 18 · TypeScript (strict) · SCSS Modules · Framer Motion · Vite 5 · Jest + RTL

## Quick start

```bash
git clone https://github.com/ysonkhiya122/Portfolio-Website.git
cd Portfolio-Website
npm install
npm run dev        # http://localhost:5173
```

## Scripts

```bash
npm run dev        # dev server
npm run build      # type-check + production build → /dist
npm run preview    # preview the production build
npm test           # jest (34 tests, 8 suites)
npm run lint       # eslint
```

## Architecture

- **Data-driven** — all content lives in `src/data/portfolio.ts` behind typed
  interfaces (`src/types`); components are pure renderers. Update once,
  reflects everywhere — including the animated stats.
- **Design tokens** — `src/styles/tokens.scss` is the single source of truth,
  auto-injected into every SCSS module via `vite.config.ts`.
- **No inline CSS** — every style in a `.module.scss` co-located with its component.
- **Zero-dep 3D sphere** — Fibonacci-sphere distribution + CSS 3D transforms,
  no Three.js. The rAF loop pauses when the sphere is off-screen.
- **⌘K / Ctrl-K palette** — full keyboard navigation, lazy-loaded out of the
  critical bundle.
- **No `dangerouslySetInnerHTML`** — emphasis in experience bullets is parsed
  from `**markers**` into React nodes (`Emphasis` component).

## Accessibility

- Skip-to-content link, semantic landmarks, real buttons for interactive elements
- `prefers-reduced-motion` respected across all animation (typewriter, counters,
  sphere, reveals, smooth scroll)
- Custom cursor only activates on fine-pointer devices after JS mounts — the
  native cursor is never lost
- Mobile navigation menu with `aria-expanded`, Escape-to-close, and scroll lock
- Text colors meet WCAG AA contrast on the dark background

## Quality gates

CI runs on every push and PR: **lint → test (with coverage) → build**.
Node version is pinned via `.nvmrc` / `engines`.

## Deploying

Static output in `dist/` — deployed on Netlify. `robots.txt`, `sitemap.xml`,
Open Graph card, and JSON-LD Person schema ship from `public/` and `index.html`.
