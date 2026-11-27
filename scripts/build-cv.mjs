#!/usr/bin/env node
/**
 * Generates public/yash-sonkhiya-cv.pdf from the same content module the
 * site renders.
 *
 * Why this exists: a portfolio that offers "Download CV" and 404s is
 * worse than one that does not offer it. Generating the PDF from the
 * content layer also means the CV and the site can never disagree — a
 * recruiter comparing them will never find two different employment
 * dates, which is exactly the kind of detail that ends a candidacy.
 *
 *   npm run build:cv
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cache = path.join(root, 'node_modules', '.cache')

async function load(entry, name) {
  const { build } = await import('esbuild')
  const outfile = path.join(cache, `${name}.mjs`)
  await build({
    entryPoints: [path.join(root, entry)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile,
    logLevel: 'silent',
  })
  return import(`file://${outfile}?t=${Date.now()}`)
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const month = (iso) => {
  const [y = '', m = ''] = iso.split('-')
  return `${MONTHS[Number(m) - 1] ?? ''} ${y}`.trim()
}
const range = (start, end) => `${month(start)} – ${end ? month(end) : 'Present'}`

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function main() {
  await mkdir(cache, { recursive: true })

  const [{ site }, content] = await Promise.all([
    load('src/content/site.ts', 'cv-site'),
    load('src/content/index.ts', 'cv-content'),
  ])

  const { experience, projects, skillGroups, achievements, education } = content.content

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${site.name} — Curriculum Vitae</title>
<style>
  @page { size: A4; margin: 11mm 12mm 9mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 8.6pt;
    line-height: 1.34;
    color: #14140f;
  }
  a { color: #14140f; text-decoration: none; }
  header { border-bottom: 1.2pt solid #14140f; padding-bottom: 4pt; margin-bottom: 7pt; }
  h1 { font-size: 17pt; letter-spacing: -0.03em; line-height: 1; }
  .role { font-size: 9.4pt; color: #4a4a44; margin-top: 2pt; }
  .contact { margin-top: 4pt; font-size: 7.8pt; color: #3a3a35; }
  .contact span + span::before { content: "  ·  "; color: #9a9a92; }
  section { margin-bottom: 6.5pt; }
  h2 {
    font-size: 7.6pt; text-transform: uppercase; letter-spacing: 0.14em;
    color: #6b6b62; padding-bottom: 1.5pt; border-bottom: 0.5pt solid #cfcfc6;
    margin-bottom: 3.5pt;
  }
  .summary { color: #33332e; }
  .job { margin-bottom: 5.5pt; page-break-inside: avoid; }
  .job-head { display: flex; justify-content: space-between; gap: 8pt; align-items: baseline; }
  .job-title { font-weight: 700; font-size: 9pt; }
  .job-meta { font-size: 7.8pt; color: #55554e; }
  .job-dates { font-size: 7.8pt; color: #55554e; white-space: nowrap; }
  ul { list-style: none; margin-top: 3pt; }
  li { position: relative; padding-left: 7pt; margin-bottom: 1.2pt; color: #2e2e29; }
  li::before { content: ""; position: absolute; left: 0; top: 5.5pt; width: 3pt; height: 0.5pt; background: #9a9a92; }
  .project { margin-bottom: 4pt; page-break-inside: avoid; }
  .project-name { font-weight: 700; font-size: 8.8pt; }
  .project-line { font-size: 8.1pt; color: #3a3a35; }
  .metrics { font-size: 7.8pt; color: #55554e; margin-top: 1pt; }
  .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5pt 14pt; }
  .skill-row { font-size: 8.1pt; }
  .skill-label { color: #6b6b62; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16pt; }
  .ach { font-size: 8pt; margin-bottom: 1.5pt; }
  .ach span { color: #6b6b62; }
  footer { margin-top: 5pt; border-top: 0.5pt solid #cfcfc6; padding-top: 4pt;
           font-size: 7.4pt; color: #7a7a72; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(site.name)}</h1>
    <p class="role">${escapeHtml(site.roleLong)} · React, TypeScript, real-time systems</p>
    <p class="contact">
      <span>${escapeHtml(site.email)}</span>
      <span>${escapeHtml(site.links.linkedin.replace('https://', ''))}</span>
      <span>${escapeHtml(site.links.github.replace('https://', ''))}</span>
      <span>${escapeHtml(site.location.city)}, ${escapeHtml(site.location.country)}</span>
    </p>
  </header>

  <section>
    <h2>Profile</h2>
    <p class="summary">
      Frontend engineer with three years of production ownership across four enterprise React
      applications, currently leading the frontend for a European field-service client operating
      in seven markets. Promoted to senior in 18 months. I work on systems where a rendering bug
      costs somebody money: real-time dispatch, SLA timers, auditable operational tooling.
    </p>
  </section>

  <section>
    <h2>Experience</h2>
    ${experience
      .map(
        (entry) => `
      <div class="job">
        <div class="job-head">
          <div>
            <div class="job-title">${escapeHtml(entry.role)}</div>
            <div class="job-meta">${escapeHtml(entry.company)} · ${escapeHtml(entry.location)}</div>
          </div>
          <div class="job-dates">${escapeHtml(range(entry.start, entry.end))}</div>
        </div>
        <ul>${entry.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>`,
      )
      .join('')}
  </section>

  <section>
    <h2>Selected projects</h2>
    ${projects
      .map(
        (project) => `
      <div class="project">
        <div class="project-name">${escapeHtml(project.name)} — ${escapeHtml(project.headline)}</div>
        <div class="project-line">${escapeHtml(project.context.split('. ')[0])}.</div>
        <div class="metrics">${project.impact
          .map(
            (metric) =>
              `${escapeHtml(metric.value)} ${escapeHtml(metric.label.toLowerCase())}`,
          )
          .join(' · ')}</div>
      </div>`,
      )
      .join('')}
  </section>

  <section>
    <h2>Technical skills</h2>
    <div class="skills">
      ${skillGroups
        .map(
          (group) => `
        <div class="skill-row">
          <span class="skill-label">${escapeHtml(group.title)}:</span>
          ${escapeHtml(group.skills.map((skill) => skill.name).join(', '))}
        </div>`,
        )
        .join('')}
    </div>
  </section>

  <div class="two-col">
    <section>
      <h2>Recognition</h2>
      ${achievements
        .map(
          (item) =>
            `<div class="ach">${escapeHtml(item.title)} <span>· ${escapeHtml(month(item.date))}</span></div>`,
        )
        .join('')}
    </section>
    <section>
      <h2>Education</h2>
      ${education
        .map(
          (entry) => `
        <div class="ach">
          <strong>${escapeHtml(entry.qualification)}</strong><br>
          ${escapeHtml(entry.institution)} <span>· ${escapeHtml(entry.start)}–${escapeHtml(entry.end)}</span>
        </div>`,
        )
        .join('')}
    </section>
  </div>

  <footer>
    <span>${escapeHtml(site.url.replace('https://', ''))}</span>
    <span>Generated from the site's content layer — always current</span>
  </footer>
</body>
</html>`

  const output = path.join(root, 'public', 'yash-sonkhiya-cv.pdf')
  const fingerprintPath = path.join(root, 'cv-content-hash.txt')

  // The PDF is rendered from this exact HTML, so the HTML's hash is a
  // reliable freshness fingerprint. Recorded on every successful render
  // and compared by scripts/validate-cv.mjs.
  const fingerprint = createHash('sha256').update(html).digest('hex')

  if (process.argv.includes('--hash-only')) {
    console.log(fingerprint)
    return
  }

  let browser
  try {
    const { chromium } = await import('playwright')
    browser = await chromium.launch()
  } catch (error) {
    // The CV is a generated artefact, not a build input: the site ships the
    // committed PDF from public/. Regenerating it on every build is a
    // convenience, but making the build depend on a Chromium binary breaks
    // deployment on any host that does not install one (Netlify's image
    // does not by default). Degrade to the committed copy and say so
    // loudly enough that a stale CV fails `npm run validate`, which is
    // where freshness is actually enforced.
    const reason = error instanceof Error ? error.message.split('\n')[0] : String(error)
    console.warn(
      `\n⚠  build:cv skipped — no Chromium available (${reason})\n` +
        `   Using the committed public/yash-sonkhiya-cv.pdf.\n` +
        `   Run 'npx playwright install chromium' to regenerate it.\n`,
    )
    return
  }

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    await page.pdf({
      path: output,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
    })
    await writeFile(fingerprintPath, `${fingerprint}\n`, 'utf8')
    console.log('✔ public/yash-sonkhiya-cv.pdf written')
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
