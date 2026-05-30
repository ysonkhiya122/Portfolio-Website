# Yash Sonkhiya — Portfolio

**React 18 · TypeScript · SCSS Modules · Framer Motion · Vite 5**

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
