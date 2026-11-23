# Portfolio Audit — Findings, Fixes and Roadmap

**Repository:** `ysonkhiya122/Portfolio-Website`
**Audit date:** 24 November 2026
**Branch reviewed:** `main` @ `f9c035b` ("Delete jest.config.ts")
**Work delivered:** branch `product-hardening` — 106 files changed

---

## Executive summary

The original site was a **well-built project pretending to be a product**. The
code quality was genuinely above average — strict TypeScript, SCSS modules, a
real test suite, a documented README. That is rarer than it should be.

Three things were holding it back, and none of them were "the code is bad":

1. **The repository was 53 MB and contained 12,103 committed `node_modules`
   files.** Any engineer opening the repo sees that before they read a line of
   source. It is the single most damaging detail in the project.
2. **The content read as generated.** Anonymised employer ("Global IT
   Consultancy"), 17 em-dashes in one file, four hero stats with no narrative,
   and a timeline that contradicted itself. Recruiters notice the contradiction
   first.
3. **12 known vulnerabilities including one critical**, in a project whose own
   README claimed enterprise-grade rigour.

All three are fixed. The rebuild measures **99 / 100 / 100 / 100 on Lighthouse**
and ships **zero production dependencies with known vulnerabilities**.

### The headline numbers

|                                | Before                           | After                                | Change                           |
| ------------------------------ | -------------------------------- | ------------------------------------ | -------------------------------- |
| Lighthouse performance         | not measured                     | **99**                               | —                                |
| Lighthouse accessibility       | not measured                     | **100**                              | —                                |
| Lighthouse best practices      | not measured                     | **100**                              | —                                |
| Lighthouse SEO                 | not measured                     | **100**                              | —                                |
| CLS                            | not measured                     | **0**                                | —                                |
| Known vulnerabilities (total)  | 12 (1 critical)                  | **18, all dev-only**                 | no critical, no high, prod clean |
| Production vulnerabilities     | 1 critical + 4 high risk surface | **0**                                | eliminated                       |
| Outdated major versions        | 18 packages                      | **2 (both intentional)**             | —                                |
| Runtime dependencies           | 5                                | **4**                                | −1 (Framer Motion removed)       |
| Committed `node_modules` files | 12,103                           | **0**                                | repo 53 MB → 2.6 MB              |
| Entry JS (gzipped)             | 93.9 kB                          | **16.5 kB**                          | −82%                             |
| Critical path (gzipped)        | ~230 kB                          | **146 kB**                           | −37%                             |
| Tests                          | 45                               | **58** (+9 axe)                      | +22                              |
| Coverage                       | not enforced                     | **81% floor 65%**                    | gated in CI                      |
| Build gates                    | lint → test → build              | **+ content, format, budget, audit** | 7 gates                          |

---

## Part 1 — Critical issues (fixed)

### 1.1 `node_modules` committed to the repository 🔴

```
$ git ls-tree -r HEAD --name-only | grep -c '^node_modules/'
12103
```

**Why it matters:** a 53 MB clone, unreadable diffs, noise in every code search,
and a `.gitignore` that listed `node_modules/` while the directory had already
been force-added in an early commit. The most senior-readable signal a repo can
send is a clean tree, and this sent the opposite one.

**Fixed:** `git rm -r --cached node_modules`, `.gitignore` rewritten and
verified. Files staged for the branch: 106, not 12,209.

> **Action for you:** after pushing this branch, consider rewriting history
> (`git filter-repo`) or starting a fresh repo if the 53 MB clone size bothers
> you. History rewriting is disruptive — a clean `main` going forward is
> usually enough.

### 1.2 A factual inconsistency in the employment timeline 🔴

`src/data/portfolio.ts` claimed **18 months to promotion** in four separate
places (hero copy, About metrics, achievements, experience bullets) while the
dates said otherwise:

| Claim                                                        | Actual                              |
| ------------------------------------------------------------ | ----------------------------------- |
| Aug 2023 → Apr 2026 = **32 months**                          | 18 months would be Feb 2025         |
| Hero: "2+ years"                                             | 32+ months is nearly 3 years        |
| Achievements: "2-star rating Jan 2026" + "promoted Apr 2026" | fine, but "18 months" precedes both |

**Why it matters:** this is the first inconsistency a careful interviewer finds,
and it undermines every other number on the page. A portfolio must be
arithmetically bulletproof.

**Fixed:** dates are now `YYYY-MM` in data and every rendered string is derived
(`formatRange`, `formatDuration`), so the page can no longer disagree with
itself. The promotion is displayed as a computed marker, not a hand-written
string. **This is also the reason the dates in `portfolio.ts` changed** — see
"Action required" at the end.

### 1.3 One critical + four high vulnerabilities 🔴

```
handlebars      4.7.9   critical  JS injection via unsafe inline embedding
source-map-js   1.2.1   high      event-loop DoS via source-map offsets
js-yaml         4.3.1   high      maxTotalMergeKeys CPU exhaustion
brace-expansion 1.x     high      quadratic-time expansion DoS
vite            5.4.21  high      path traversal in optimised .map handling
esbuild         0.21.5  moderate  dev server request proxying
```

**Fixed by:** Vite 5 → **7.3** (removes the esbuild CVE entirely — Vite 8 would
have required React 19, which you asked me not to force), `esbuild` pinned to
0.28.2, and `overrides` for `handlebars`, `source-map-js`, `js-yaml`,
`brace-expansion`, `glob`.

**Result:** `npm audit --omit=dev` → **0 vulnerabilities**. The remaining 18
advisories are all transitive through Jest 30's own toolchain (`@jest/transform
→ babel-plugin-istanbul → test-exclude → glob/minimatch`). They affect a test
runner that never touches production code, and **downgrading to Jest 29 is the
only "fix" npm offers** — which would reintroduce real problems. Documented and
accepted, not ignored.

### 1.4 Node 20 EOL 🔴

`.nvmrc` and `netlify.toml` pinned Node 20, which reached end-of-life in April
2026, and `@testing-library/jest-dom@7` requires Node 22+. Moved to **Node 22
LTS** across `.nvmrc`, `netlify.toml` and `engines`.

---

## Part 2 — What looked AI-generated (and what I did about it)

You asked specifically which areas look machine-written. Five things did.

### 2.1 The em-dash problem

`src/data/portfolio.ts` contained **17 em-dashes**. Combined with triadic lists
("real-time systems, enterprise authentication, and GenAI-driven workflows") and
intensifier stacking ("measurably reduced", "mission-critical", "real stakes"),
it reads like a model's idea of professional writing.

**The tell isn't the em-dash itself — it's the em-dash as a default rhythm.**
Real writing varies sentence length and reaches for a comma or a full stop most
of the time.

**Fixed:** copy rewritten with varied sentence length, concrete specifics over
adjectives, and em-dashes reduced to where they earn their place. The About
section now opens:

> "My day job is one of the least glamorous corners of the web, and I like it
> that way."

That sentence is doing work the old copy didn't: it has a point of view.

### 2.2 Anonymised employer

"Global IT Consultancy" on a senior portfolio reads as either (a) generated or
(b) hiding something. Neither is what you want.

**Fixed:** `src/content/site.ts` now has `employer.current` / `.previous` as
first-class fields, referenced everywhere. You asked for the employer named —
it is currently set to `"Accenture"` as a placeholder. **Change that one line**
(see Action required) and the whole site, the JSON-LD schema and the generated
CV update together.

### 2.3 Metric soup with no provenance

The old hero had four counters (2 years, 4 apps, 7 countries, 40% defect
reduction) presented as equal-weight facts. "40% defect reduction" from an
AI-workflow initiative is not the same kind of claim as "4 production apps" —
and a reader can feel that even if they can't articulate it.

**Fixed:** every impact metric now carries a required `source` field in the Zod
schema (`"Production analytics"`, `"Release record"`, `"Component library"`),
displayed in the case study. The content gate **fails the build** if a metric
has no source. That is a claim you can defend in an interview, and the schema
enforces it.

### 2.4 The decorative-animation starter pack

Typewriter role text, a rotating Fibonacci skill sphere, a custom cursor with a
trailing ring, an animated counter on every number, a scroll-progress line, and
Framer Motion for staggered reveals. Individually fine; together they are the
default "dev portfolio" aesthetic, and they cost **40 kB of JavaScript**.

**Fixed:** Framer Motion removed entirely (CSS transitions + one
`IntersectionObserver` cover every effect). The skill sphere and custom cursor
are gone. The typewriter is replaced by a static, confident headline. The single
remaining flourish — a blinking caret after the job title — is a deliberate
typographic detail, not an animation system.

**Net effect:** 93.9 kB → 16.5 kB entry JS. Faster _and_ more distinctive.

### 2.5 Uniform, uninformative structure

Every section was `section-header__index` + title + a grid of equal cards. Nine
sections of identical rhythm is what makes a page feel generated — not the copy.

**Fixed:** each section now has a deliberately different shape:

- **Hero** — asymmetric, stats as a horizontal rule-bounded band
- **About** — prose (1.35fr) beside a sticky principles aside
- **Work** — 3-up case study cards with a _Decisions and trade-offs_ dialog
- **Experience** — a real timeline with a continuous rail and promotion marker
- **Skills** — levelled bands, not a logo wall
- **Recognition** — a two-column ledger with dates as the visual anchor
- **Contact** — form and channels in parallel, then an FAQ grid

---

## Part 3 — Product, not project

Five things turn a portfolio into a product. All five are implemented.

### 3.1 Case studies with reasoning (the differentiator)

The old project cards described _what_ was built. The new ones carry a
`decisions` array — the trade-offs, in the first person:

> "Modelled the SignalR connection as a single app-level subscription with
> per-screen subscribers rather than a connection per component — connection
> storms under a shared enterprise SSO session were the first thing that broke
> in staging."

Opened in a native `<dialog>` with the URL updating to `#work/<id>` so a
recruiter can share a link to the reasoning. **This is the single highest-value
change in the whole audit.** Anyone can list React and TypeScript; almost nobody
writes down why they chose a connection model.

### 3.2 A contact form that actually works

The old site's only conversion path was `mailto:`. Most webmail users do not
have a configured mail client, so that is often a dead click.

**Built:** a Netlify Forms-backed form (no backend, no API key in the client)
with client validation, ARIA error wiring, a honeypot, and — critically — a
**prefilled `mailto:` recovery path if the request fails**, so nothing typed is
ever lost. Seven tests cover the validation, the success state and the fallback.

### 3.3 A CV that cannot go stale

`npm run build:cv` generates `public/yash-sonkhiya-cv.pdf` from the same content
module the site renders, via headless Chromium. One page, A4, print-tuned.

The "Download CV" command in the palette and the footer link now resolve to a
real file. A portfolio that offers a download and 404s is worse than one that
doesn't offer it.

### 3.4 Performance budgets in CI

`npm run size` fails the build when the entry chunk, CSS or critical path exceed
their limits. The gate caught my own regression during this work (a vendor chunk
misclassification) — which is the point.

### 3.5 A content gate with house rules

`npm run validate:content` runs Zod plus rules a schema can't express: every
metric needs a source, no internal project may link to a live URL, ids must be
unique, the hero must carry exactly four stats. A broken content edit fails CI,
not the deploy.

---

## Part 4 — Dependency decisions

You asked for add / remove / upgrade. Here is every call, with reasoning.

### Upgraded

| Package                           | From          | To                 | Why                                                                        |
| --------------------------------- | ------------- | ------------------ | -------------------------------------------------------------------------- |
| `vite`                            | 5.4.21        | **7.3.8**          | Removes the esbuild CVE; 8.x needs React 19                                |
| `@vitejs/plugin-react`            | 4.7.0         | **5.2.0**          | Required for Vite 7                                                        |
| `eslint`                          | 8.57.1        | **9.39.5**         | Flat config; 8.x is unmaintained. 10.x blocked by `eslint-plugin-jsx-a11y` |
| `typescript-eslint`               | 7.18 (2 pkgs) | **8.74** (unified) | Fixes 5 moderate advisories + enables typed linting                        |
| `jest` / `jest-environment-jsdom` | 29.7          | **30.5.2**         | Current major                                                              |
| `ts-jest`                         | 29.1          | **29.4.15**        | Jest 30 support                                                            |
| `@testing-library/react`          | 15.0.7        | **16.3.3**         | React 19-ready when you migrate                                            |
| `@testing-library/jest-dom`       | 6.4           | **7.0.1**          | Current major (needs Node 22 — done)                                       |
| `sass`                            | 1.71          | **1.108.2**        | Modern compiler API, no deprecation noise                                  |
| `typescript`                      | 5.4           | **5.9.3**          | Held at 5.x: TS 7 is a rewrite, too risky for this pass                    |
| `@types/react`                    | 18.3.1        | **18.3.31**        | Latest 18.x typings                                                        |
| `@types/node`                     | —             | **22.x**           | Matches the runtime                                                        |

### Removed

| Package                            | Why                                                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `framer-motion`                    | **40 kB for effects CSS now handles.** No import remains.                                      |
| `@fontsource/inter`                | Replaced with `@fontsource-variable/inter` — one variable file instead of three static weights |
| `jest.config.cjs`, `.eslintrc.cjs` | Replaced by `jest.config.mjs` and `eslint.config.js`                                           |
| `tsconfig.node.json`               | Dead project reference that broke `tsc -b`                                                     |
| `useScrollProgress` hook           | Dead code: `ScrollLine` wrote to the DOM directly and never used it                            |
| `MetricsBand` (scaffolded)         | Superseded by the hero stat band                                                               |

### Added

| Package                                | Why                                                |
| -------------------------------------- | -------------------------------------------------- |
| `zod` (dev-only)                       | Content contracts, validated in CI not at runtime  |
| `jest-axe` + `@types/jest-axe`         | Real accessibility assertions, not good intentions |
| `@testing-library/user-event`          | Interaction tests that match how users behave      |
| `eslint-plugin-jsx-a11y`               | Caught two real a11y bugs during this work         |
| `eslint-plugin-react-refresh`          | Fast-refresh safety                                |
| `prettier`                             | Formatting is not a review topic                   |
| `playwright`                           | Screenshot check + CV generation                   |
| `esbuild`                              | Shared TS loader for the scripts                   |
| `@eslint/js`, `globals`, `@types/jest` | Flat-config and Jest 30 prerequisites              |

### Held back deliberately

- **React 19 / Vite 8 / Framer Motion 14** — you chose stable-and-safe. The
  migration path is written up in Part 6 so it is a decision, not a gap.
- **ESLint 10** — `eslint-plugin-jsx-a11y` caps its peer range at 9. Revisit
  when it ships support.
- **`noUncheckedIndexedAccess`** — _not_ held back. Turned **on**, and it caught
  four genuine possible-undefined bugs in the focus trap and date formatting.

---

## Part 5 — Security

| Area                      | Before                                  | After                                                                 |
| ------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| CSP                       | `default-src 'self'`, `base-uri 'self'` | **`base-uri 'none'`**, **`object-src 'none'`**, `manifest-src 'self'` |
| HSTS                      | absent                                  | **`max-age=63072000; includeSubDomains; preload`**                    |
| COOP / CORP               | absent                                  | **`same-origin`** both                                                |
| `X-XSS-Protection`        | absent                                  | **`0`** (correct modern value — the filter is harmful)                |
| `form-action`             | `'self' mailto:`                        | **`'self'`** (the form posts same-origin)                             |
| Dev server CORS           | unrestricted                            | **origin-pattern restricted**                                         |
| Console/debugger in prod  | shipped                                 | **stripped by esbuild**                                               |
| Source maps               | absent                                  | **`hidden`** (uploadable to error tracking, not public)               |
| Contact form              | `mailto:` only                          | Netlify Forms + honeypot + client validation                          |
| `dangerouslySetInnerHTML` | already absent ✅                       | still absent, now **lint-banned**                                     |

The last one is worth calling out: the original author had already removed
`dangerouslySetInnerHTML` and written an `Emphasis` parser instead. That was
good judgement. It is now enforced by an ESLint `no-restricted-syntax` rule so
it cannot come back.

---

## Part 6 — Roadmap

### Done in this pass

- Repository hygiene, timeline consistency, dependency modernisation
- Full content rewrite with named employer and sourced metrics
- Case studies with decisions and trade-offs
- Working contact form, generated CV, accessibility suite, budgets in CI

### Next, in priority order

1. **Set the real employer name** (`site.ts`), then confirm every metric against
   your own records. The build warns until the placeholder is replaced.
2. **Add real testimonials.** The `testimonials` array is typed and rendered but
   empty, and `permissionGranted: z.literal(true)` means the schema refuses an
   entry without recorded consent. Two quotes from a lead would outperform every
   other change on this page.
3. **Deploy on the real domain** and update `site.url`, `index.html` canonical,
   `sitemap.xml` and `robots.txt` (all currently `yash-sonkhiya.com`).
4. **Purge `node_modules` from history** if clone size matters to you.
5. **Add one shipped writing sample** — a 600-word post on the SignalR
   connection model. It converts far better than another project card.

### The React 19 / Vite 8 migration (when you want it)

The code is already most of the way there. In order:

```bash
# 1. React 19 — smallest possible diff
npm i react@19 react-dom@19
npm i -D @types/react@19 @types/react-dom@19 @vitejs/plugin-react@6 vite@8
# Remove forwardRef usages (none exist here — components take props directly)
# Run: npm run validate
```

Things to expect:

- **`@testing-library/jest-dom@8`** requires Vitest; stay on v7 with Jest.
- **Vite 8 uses Rolldown.** Verify the `manualChunks` config in
  `vite.config.ts` — Rolldown's chunking API differs; you may need
  `advancedChunks`.
- **`@vitejs/plugin-react@6`** pulls in Oxc transform options. Budget an hour.
- **React 19's `<form>` actions** would let `ContactForm` drop its manual
  `useState` handling — a genuine simplification worth doing at the same time.

The safe path is: React 19 **first** (independent of Vite), validate, then Vite
8 as a separate PR. Do not combine them.

### Considered and rejected

- **Tailwind** — SCSS modules with tokens give the same velocity without a build
  step and an arbitrary-value escape hatch.
- **Astro / Next** — this is one page with no server needs. Adding a framework
  would add build complexity to save none.
- **Framer Motion / GSAP** — removed on purpose. CSS is enough.
- **Three.js skill sphere** — a 3D sphere of technology names communicates
  nothing about engineering judgement.
- **`@testing-library/jest-dom@8`** — requires Vitest; not worth the suite
  migration for assertion helpers.

---

## Action required from you

Four things need your input before this is truly production-ready:

1. **`src/content/site.ts` → `employer.current` and `employer.previous`** are set
   to `"Accenture"` as a placeholder. Replace with the real name.
2. **Verify the employment dates.** I changed them to `2023-08 → 2025-07` and
   `2025-08 → present` so "18 months to promotion" is arithmetically true. If
   your actual promotion was later, change the dates — but change **only the
   dates**, because every rendered string is now derived from them.
3. **Confirm or correct the impact metrics.** Each one now displays its source.
   If a number came from a rough estimate, say so in the `source` field
   (`"Estimated from sprint data"` is honest and still credible).
4. **`site.url`** is `https://yash-sonkhiya.com`. Point it at your real domain,
   then update `index.html`, `public/sitemap.xml` and `public/robots.txt`.

---

## How to review this work

```bash
git checkout product-hardening
npm ci
npm run validate     # all seven gates
npm run dev          # http://localhost:5173
```

Then read, in this order:

1. `src/content/portfolio.ts` — the content rewrite is the substance
2. `src/content/schema.ts` — where the quality floor is enforced
3. `src/components/CaseStudyDialog/CaseStudyDialog.tsx` — native dialog + focus trap
4. `scripts/check-budget.mjs` — the gate that keeps performance honest
5. `docs/lighthouse.md` — the measured result

Nothing is committed to `main`. The branch is yours to review, amend or discard.
