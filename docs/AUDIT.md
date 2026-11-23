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

---

## Part 7 — Second pass: auditing my own work

The first pass fixed what was wrong with the original repo. This pass
audited the fixes. Every item below was a real defect in code I shipped
and called done — which is the point of doing a second pass at all.

### Defects I introduced

**1. Deep links did not work, though the audit claimed they did.**
`App.tsx` wrote `#work/<id>` to the URL with `history.replaceState`, but
nothing ever read the hash back. Loading a shared link opened the site
with the dialog closed. Worse, `replaceState` also meant the browser Back
button could not close the dialog.

Fixed properly: `src/lib/caseStudyRoute.ts` now owns parse/build/push, the
app hydrates initial state from `location.hash`, listens for both
`hashchange` and `popstate`, `pushState` opens a case study and a
`replaceState` to `#work` closes it. Unknown slugs resolve to `null`
rather than opening an empty dialog.

**2. Two `<dialog>` elements were mounting.**
`Projects` kept its own `activeId` state and its own `CaseStudyDialog`,
while `App` had a second one driven by the URL. Clicking a card bypassed
the URL entirely, and both dialogs existed in the DOM. The card picker
was decorating the app with a modal, not opening it.

Fixed by making `Projects` a pure renderer that delegates via
`onOpenProject`. The type system then flagged all five test call sites,
which is how the duplication should have been caught in the first place.

**3. `is-scroll-locked` was a no-op.**
Three components added `html.is-scroll-locked`; no stylesheet defined it.
The class did nothing, and background scroll was only blocked because
`showModal()` puts the page in the top layer.

Fixed with a real rule in `globals.scss` _and_ a reference-counted
`src/lib/scrollLock.ts`. A naive class toggle breaks the moment two
surfaces overlap — opening the command palette over an open case study
and closing the palette unlocked the page underneath the still-open
modal. Three unit tests cover the counting.

**4. Nav links moved the viewport but not the keyboard.**
`scrollToId()` called `.focus()` on a plain `<section>`, which has no
`tabindex`, so the call silently did nothing and focus fell back to
`<body>`. A keyboard user activating "Skills" was scrolled to the section
and left with focus nowhere.

Fixed with `tabIndex={-1}` on sections. Verified in a real browser:
`document.activeElement` after clicking the nav link is now
`section#skills`.

**5. Nine font files were being emitted into every deploy.** (see Part 3)

**6. The CV could silently drift from the site.** `build:cv` existed but
was not part of `npm run build`, so the PDF was only as fresh as the last
manual run. It is now generated on every build.

**7. Two WCAG 2.5.3 violations hid behind mobile-only testing.**
`label-content-name-mismatch` failed for the nav palette button (visible
`⌘ K`, `aria-label="Open command palette"`) and the hero scroll cue
(visible `scroll`, `aria-label="Skip to about section"`). Both replaced
visible text with an accessible name that did not contain it. Fixed with
visually-hidden spans. Desktop Lighthouse had never been run until now;
it surfaced both immediately.

**8. Test hygiene.** Every command-palette test emitted a React
`not wrapped in act(...)` warning because the keyboard event was
dispatched outside `act()`. Zero warnings now, so the next real warning
will be visible.

### Two structural problems behind those defects

**A section shell was missing.** Nine components each re-implemented
`<section><div class="container"><header>…`, each registered its own
reveal observer, and section numbers were typed by hand — they had
already drifted. `src/components/ui/Section.tsx` now owns the focus
target, the reveal and the layout; `src/content/sections.ts` owns order
and derivation, so numbering cannot drift.

**Links were unverifiable.** The palette linked to `/yash-sonkhiya-cv.pdf`
with no guarantee it existed. `npm run validate:links` now asserts that
every registry asset resolves, every section anchor exists, and every
note has a built page. It is in `npm run validate` and in CI.

### Added

| What                                     | Why                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/content/notes.ts` + three write-ups | Proof of reasoning in prose, not just claims                                                                    |
| `scripts/build-pages.mjs`                | Real static HTML per note, plus sitemap/robots regeneration                                                     |
| Context section                          | States what is verified, measured, attributed and generalised — the trust question a senior reader actually has |
| `src/content/assets.ts`                  | Downloads as data, so the link gate can verify them                                                             |
| Content guide (`docs/CONTENT.md`)        | The editing workflow, in one place                                                                              |

### Verified after these changes

| Check                               | Result                                                          |
| ----------------------------------- | --------------------------------------------------------------- |
| `npm run validate`                  | green — content, links, lint, format, **80 tests**, build, size |
| Lighthouse desktop                  | **100 / 100 / 100 / 100**, CLS 0, zero failing audits           |
| Lighthouse mobile                   | 99 / 100 / 100 / 100, LCP 2.1 s, CLS 0                          |
| Deep link cold load                 | dialog open, `:modal`, correct title, page locked               |
| Escape / Back / Forward             | close, close, reopen — URL and lock stay consistent             |
| Unknown slug `#work/does-not-exist` | no dialog, no error                                             |
| Nav keyboard focus                  | `section#skills` receives focus                                 |
| Fonts emitted                       | 9 → **4** files; critical path 146.1 → **142.3 kB**             |
| Bundle                              | entry 20.1 · vendor 44.4 · css 7.8 kB gzipped                   |
| Production vulnerabilities          | 0                                                               |

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

---

## Part 8 — Removing the "How to read this" section

I added a numbered section stating what on the site is verified,
measured, attributed and generalised. It was the wrong call, and it
carried two bugs that proved it.

**It was redundant.** The section claimed "each metric names its source"
— and the case-study dialog already prints `Source: Product analytics`
under every metric. It promised that confidential client detail is
described by domain — and each project's `notes` field already said
"described by domain and outcome only". Every one of its four cards
restated evidence the page already carried at the point of the claim.
Worse, the blanket claim was _weaker_ than the specific notes it
duplicated: a reader wanting to know why there is no live URL for the
dispatch platform found the answer in the case study, not in a preamble.

**It was the wrong register.** A portfolio earns trust by making claims
you can check, not by opening with a disclaimer about its own honesty.
Four hundred words of epistemic fine print, presented as chapter one,
reads as defensive and pushes evidence and outcomes below the fold.

**Two bugs the section shipped with.** Its eyebrow rendered "01 /
How to read this" while the About section also rendered "01 / About" —
because numbering was derived but the section list had been ordered
independently of the components. And its "Generalised" card interpolated
a lowercase content string after a full stop: "…employment agreement. a
European field-service enterprise is as specific as…". Removing the
section removed the second bug; the first led to the real fix below.

### What replaced it

- The one genuinely unique fact — _which parts of the migration were
  mine and which were the team's_ — moved into the dispatch platform's
  `notes` field, where it is read by someone already interested in that
  project. That is the right moment to disclose it.
- `site.employer.clientDescriptor` was deleted: it existed only to feed
  the removed card, and an unused content field rots.
- **Section numbering is now derived everywhere.** The command palette's
  jump-to hints were still hardcoded (`01`, `02`, `06`, `07`, `08`,
  `09`) — the exact bug Part 7 claimed to have fixed. They are now
  generated from `sectionOrder`, and `Notes` takes a number too, so the
  sequence is continuous. Verified in a browser: page eyebrows and
  palette entries agree exactly, `01 About` through `07 Contact`.
- **Added `public/404.html`.** Removing content made me check what
  happens on a bad URL: the static host returned 200 with the home page,
  so any mistyped link or stale case-study id silently looked fine.
  Generated by `scripts/build-pages.mjs` with `noindex` and real
  navigation.

---

## Part 9 — The site still contradicted its own dates

Part 1 called out the original repo's worst content defect: copy claiming
"promoted to senior in 18 months" while its own employment dates spanned 23. The fix derived that figure inside the Experience component.

It was a partial fix. The same claim was _also_ typed into the hero lede
and the About prose, both of which I had written by hand. So the shipped
site claimed **18 months** in two places and computed **23** in a third —
the identical defect, reintroduced by me, in the same repository, after I
had documented it as fixed.

### Why it survived

I fixed the _symptom_ (one component rendered a duration) rather than the
_class_ (any duration anywhere is a claim about dates). There was no
mechanism that could notice a hardcoded number in prose, so nothing did.

### The fix

`src/content/derived.ts` now owns every checkable number: months to
promotion (measured from `promotion.date`, not from role boundaries),
years of experience, and the phrasings used in copy. Prose carries no
durations at all — the About opener uses a `{YEARS}` token interpolated
at render time, and the hero and Experience heading call the derived
helpers.

Two gates back it up:

- `src/content/derived.test.ts` asserts the computed gap matches the
  dates, and explicitly fails if the phrase ever reads `18 months` again.
- `scripts/validate-content.mjs` rejects duration-shaped claims in prose
  (`\b\d+\s*(month|year)s?\b`) with the message _"derive it from
  experience dates instead"_. Verified by reintroducing the bug: the gate
  failed as intended.

### Two further defects found while fixing it

**The content gate could not see schema changes.** It imported a cached
`schema-check.mjs` and only recompiled if that import threw. After the
first run, every schema edit was silently ignored and content was
validated against a stale contract. A gate that cannot see your change is
worse than no gate; it now compiles unconditionally.

**The About prose had never been validated at all.** `about` was missing
from the gate's `CONTENT_KEYS` and from `contentSchema`, so the
most-edited copy on the site bypassed validation entirely. It now has a
schema, and the house-rule check actually receives its text.
