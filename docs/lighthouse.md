# Lighthouse baseline

Captured against a production build (`vite preview`) with headless Chromium and
Lighthouse mobile emulation defaults.

| Category       | Score   |
| -------------- | ------- |
| performance    | **99**  |
| accessibility  | **100** |
| best-practices | **100** |
| seo            | **100** |

| Metric                   | Value |
| ------------------------ | ----- |
| First Contentful Paint   | 1.6 s |
| Largest Contentful Paint | 2.1 s |
| Total Blocking Time      | 50 ms |
| Cumulative Layout Shift  | 0     |
| Speed Index              | 1.6 s |
| Time to Interactive      | 2.1 s |

## Accessibility audits

All accessibility audits pass, including `color-contrast` and `label-content-name-mismatch`.

### Remaining performance warnings

These are advisory, not failures — the category still scores 99:

- `render-blocking-resources` — the single CSS bundle is render-blocking by design; inlining it would only move bytes.
- `network-dependency-tree-insight` — HTML → CSS → font chain. The critical font is now preloaded, which removed the measured layout shift.
- `first-contentful-paint` / `largest-contentful-paint` — 1.6 s / 2.1 s on throttled mobile CPU; both inside the "good" band.

## Journey

| Run                                       | Perf   | A11y    | BP      | SEO     | CLS   |
| ----------------------------------------- | ------ | ------- | ------- | ------- | ----- |
| First rebuild measurement                 | 91     | 96      | 100     | 100     | 0.164 |
| + font preload, reserved stat row         | 99     | 96      | 100     | 100     | 0     |
| + contrast floor raised, brand name fixed | **99** | **100** | **100** | **100** | **0** |
