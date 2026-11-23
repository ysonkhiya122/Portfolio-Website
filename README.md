# Yash Sonkhiya — Portfolio

**A product-grade personal site, not a project folder with a deploy.**

Live: [yash-sonkhiya.com](https://yash-sonkhiya.com)

<!-- Replace the badges below with your own repo path once pushed. -->

![CI](https://github.com/ysonkhiya122/Portfolio-Website/actions/workflows/ci.yml/badge.svg)
![Lighthouse](https://img.shields.io/badge/lighthouse-99%20%C2%B7%20100%20%C2%B7%20100%20%C2%B7%20100-3a9971)
![Tests](https://img.shields.io/badge/tests-58%20passing-3a9971)
![Dependencies](https://img.shields.io/badge/prod%20vulns-0-3a9971)

React 18 · TypeScript 5.9 (strict) · Vite 7 · Zod-validated content · Jest 30 + axe
· zero UI dependencies

---

## Why this repo exists

Most engineering portfolios are a hero section, a skills wall and three project
cards with a screenshot. They answer "what have you touched" and nothing else.
This one is built to answer the two questions an actual hiring panel asks:

1. **What did you decide, and why?** Every project on the site carries a
   _Decisions and trade-offs_ section — the reasoning, not the feature list.
2. **Can you ship something that holds up?** The site is its own work sample:
   performance budgets enforced in CI, axe in the test suite, a strict CSP, and
   a print stylesheet that produces a real one-page CV.

---

## Quick start

```bash
nvm use            # Node 22 LTS (.nvmrc)
npm ci
npm run dev        # http://localhost:5173
```

| Script                     | What it does                                                |
| -------------------------- | ----------------------------------------------------------- |
| `npm run dev`              | Vite dev server with HMR                                    |
| `npm run build`            | Type-check (`tsc`) + production build → `dist/`             |
| `npm run preview`          | Serve the production build locally                          |
| `npm test`                 | Jest: unit + accessibility projects                         |
| `npm run test:a11y`        | Only the axe assertions                                     |
| `npm run lint`             | ESLint 9 flat config, type-aware, zero warnings allowed     |
| `npm run format:check`     | Prettier verification                                       |
| `npm run validate:content` | Zod content gate + house rules                              |
| `npm run size`             | Performance budget gate (fails the build on regression)     |
| `npm run build:cv`         | Regenerate `public/yash-sonkhiya-cv.pdf` from content       |
| `npm run visual`           | Playwright screenshots at 3 widths, fails on console errors |
| `npm run validate`         | Everything CI runs, locally, in order                       |

---

## Architecture

```
src/
  content/            ← the only place content lives
    site.ts           identity, links, availability (no hardcoded emails elsewhere)
    portfolio.ts      case studies, experience, skills, recognition, FAQs
    schema.ts         Zod contracts, including a `source` on every metric
    index.ts          assembled content, typed from the schema
    validate.ts       dev-only runtime check (tree-shaken from the build)
  components/         pure renderers, one SCSS module each
  lib/format.ts       date/duration formatting (data-driven, testable)
  styles/             tokens.scss (single source of truth) + globals.scss
scripts/              content gate, budget gate, CV generator, visual check
```

### Design decisions worth knowing

**Content is typed through the schema, not beside it.** `Project`,
`Experience` and friends are `z.infer<>` of the Zod contracts that validate the
data. A component cannot drift from the contract the content gate enforces.

**Validation runs in CI, not in the browser.** Zod parses content in
`validate:content`, in tests, and in dev — never in the shipped bundle, where it
would cost ~13 kB gzipped to check data we authored ourselves.

**No animation library.** Framer Motion was removed once CSS transitions and a
single `IntersectionObserver` covered every effect. That is 40 kB gzipped and
40 kB of JavaScript parse time the visitor no longer pays for.

**Reveals are progressive enhancement.** `.reveal` elements are visible by
default. The `js` class that hides them is added before first paint in
`main.tsx`, so a JS failure degrades to a static but complete page.

**Native `<dialog>` for the case studies.** The platform handles inertness,
focus restoration and Escape. There is less custom accessibility code to get
wrong.

**Budgets are enforced, not aspirational.** `npm run size` fails when the entry
chunk, CSS or total critical path exceed their limits. The numbers below are the
current state, measured on every build.

---

## Measured results

See [`docs/lighthouse.md`](docs/lighthouse.md) for the full report.

|                | Score   |
| -------------- | ------- |
| Performance    | **99**  |
| Accessibility  | **100** |
| Best practices | **100** |
| SEO            | **100** |

|                            | Value   |
| -------------------------- | ------- |
| LCP                        | 2.1 s   |
| CLS                        | 0       |
| TBT                        | 50 ms   |
| Critical path (gzipped)    | ~146 kB |
| Entry JS (gzipped)         | 16.5 kB |
| Production vulnerabilities | 0       |

Accessibility is asserted twice: `jest-axe` renders all nine sections and fails
on any violation, and Lighthouse checks the built page. Both are clean.

---

## Quality gates

CI runs on every push and pull request:

```
validate:content → lint → format:check → build → test --coverage → size
```

…plus a separate **dependency audit** job that blocks on production
vulnerabilities, and a non-blocking Lighthouse job that reports on PRs.

Coverage floor is enforced in `jest.config.mjs` (65% statements). Current: 81%.

---

## Deployment

Netlify. `netlify.toml` sets:

- **CSP** with `script-src 'self'` (no inline scripts, no `unsafe-eval`),
  `frame-ancestors 'none'`, `base-uri 'none'`, `object-src 'none'`
- HSTS with preload, COOP, CORP, `X-Content-Type-Options`, `Permissions-Policy`
- Immutable one-year caching for hashed assets, revalidating HTML
- Netlify Forms for the contact form — no backend, no API key in the client

The form has client validation, server-side validation via Netlify, and a
prefilled `mailto:` recovery path if the request fails. Nothing the visitor
typed is ever lost.

---

## Editing content

Almost everything you would want to change lives in two files:

| I want to change…                               | Edit                       |
| ----------------------------------------------- | -------------------------- |
| Email, GitHub, LinkedIn, availability, employer | `src/content/site.ts`      |
| Case studies, experience, skills, awards, FAQs  | `src/content/portfolio.ts` |
| Colours, spacing, type scale, motion            | `src/styles/tokens.scss`   |

After editing:

```bash
npm run validate:content   # fails loudly on a missing field or a claim with no source
npm run build:cv           # keeps the downloadable CV in sync
```

The content gate enforces more than types: every impact metric needs a `source`,
no internal project may link to a live URL, ids must be unique, and the hero
must carry exactly four stats so the grid never reflows.

---

## Accessibility

- axe assertions in Jest for every section, plus Lighthouse on the build
- WCAG AA contrast verified for the full palette; the lowest text tone is 5.1:1
- Visible focus rings everywhere (`:focus-visible`, never removed)
- Skip link, semantic landmarks, real `<button>` elements, `aria-current` nav
- `prefers-reduced-motion` honoured globally and in every animation
- The mobile menu is a disclosure with `aria-expanded` and Escape-to-close —
  not a fake dialog
- No `aria-label` that contradicts its visible text (WCAG 2.5.3)

---

## Licence

Content and copy © Yash Sonkhiya. Code is MIT — take the architecture, not the
case studies.
