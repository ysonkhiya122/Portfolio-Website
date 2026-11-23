#!/usr/bin/env node
/**
 * Generates static HTML for the notes and rebuilds sitemap.xml.
 *
 * Why static files rather than a client-side route: a note that only
 * exists after JavaScript runs cannot be indexed reliably, cannot be
 * previewed by a link unfurler, and depends on the SPA fallback
 * returning 200 for a path that arguably should 404. Writing real files
 * costs a build step and solves all three.
 *
 *   npm run build:pages
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cache = path.join(root, 'node_modules', '.cache')

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
const monthYear = (iso) => {
  const [y = '', m = ''] = iso.split('-')
  return `${MONTHS[Number(m) - 1] ?? ''} ${y}`.trim()
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

/** Inline styles shared by the generated pages — no external CSS request. */
const PAGE_CSS = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #08080a; color: #f2efe9;
    font: 400 16px/1.7 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 680px; margin: 0 auto; padding: 56px 24px 96px; }
  a { color: inherit; }
  .back {
    display: inline-flex; align-items: center; gap: 8px;
    font: 500 12px/1 ui-monospace, 'SF Mono', monospace;
    letter-spacing: .1em; text-transform: uppercase;
    color: #8b8680; text-decoration: none; margin-bottom: 40px;
  }
  .back:hover { color: #f2efe9; }
  .meta {
    font: 400 11px/1 ui-monospace, 'SF Mono', monospace;
    letter-spacing: .1em; text-transform: uppercase; color: #8b8680;
    display: flex; gap: 8px; align-items: center; margin-bottom: 16px;
  }
  .meta .dot { color: #55524d; }
  h1 {
    font-size: clamp(30px, 5vw, 40px); font-weight: 560;
    letter-spacing: -.03em; line-height: 1.16; margin-bottom: 18px;
  }
  .summary { font-size: 17px; line-height: 1.65; color: #a5a29b; margin-bottom: 36px; }
  .rule { height: 1px; background: rgba(255,255,255,.13); margin-bottom: 36px; }
  h2 {
    font-size: 13px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase;
    color: #e8a33d; margin: 36px 0 12px;
    font-family: ui-monospace, 'SF Mono', monospace;
  }
  p { margin-bottom: 18px; color: #cfccc5; }
  code {
    font: 400 14px/1.5 ui-monospace, 'SF Mono', monospace;
    background: rgba(255,255,255,.06); padding: 2px 6px; border-radius: 3px;
  }
  .footer {
    margin-top: 56px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.07);
    font-size: 13px; color: #8b8680;
  }
  .footer a { color: #f2efe9; text-decoration: underline; text-underline-offset: 3px; }
  .cta {
    display: inline-block; margin-top: 12px; padding: 11px 20px;
    background: #f2efe9; color: #0a0a0c; border-radius: 6px;
    text-decoration: none; font-size: 13px; font-weight: 500;
  }
  .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 32px; }
  .code {
    font: 500 72px/1 ui-monospace, 'SF Mono', monospace;
    color: #e8a33d; letter-spacing: -.04em; margin-bottom: 24px;
  }
  .links { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 28px; font-size: 14px; }
  .links a { color: #8b8680; text-underline-offset: 3px; }
  .links a:hover { color: #f2efe9; }
  .tag {
    font: 400 11px/1 ui-monospace, 'SF Mono', monospace;
    padding: 4px 9px; border: 1px solid rgba(255,255,255,.13);
    border-radius: 3px; color: #a5a29b;
  }
`

async function load(entry, name) {
  const { build } = await import('esbuild')
  const outfile = path.join(cache, `${name}.mjs`)
  await mkdir(cache, { recursive: true })
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

function renderNote(note, site) {
  const canonical = `${site.url}/notes/${note.slug}/`
  const body = note.body
    .map((paragraph) =>
      paragraph.startsWith('## ')
        ? `<h2>${escapeHtml(paragraph.slice(3))}</h2>`
        : `<p>${escapeHtml(paragraph)}</p>`,
    )
    .join('\n        ')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#08080a">
  <title>${escapeHtml(note.title)} — ${escapeHtml(site.name)}</title>
  <meta name="description" content="${escapeHtml(note.summary)}">
  <link rel="canonical" href="${canonical}">
  <meta name="author" content="${escapeHtml(site.name)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(note.title)}">
  <meta property="og:description" content="${escapeHtml(note.summary)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.url}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/notes/note.css">
  <script type="application/ld+json">
    ${JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: note.title,
        description: note.summary,
        datePublished: note.date,
        author: { '@type': 'Person', name: site.name, url: site.url },
        keywords: note.tags.join(', '),
        url: canonical,
      },
      null,
      2,
    ).replaceAll('</script>', '<\\/script>')}
  </script>
</head>
<body>
  <main class="wrap">
    <a class="back" href="/#notes">&larr; All notes</a>
    <p class="meta">
      <time datetime="${note.date}">${monthYear(note.date)}</time>
      <span class="dot">&middot;</span>
      <span>${note.readingMinutes} min read</span>
    </p>
    <h1>${escapeHtml(note.title)}</h1>
    <p class="summary">${escapeHtml(note.summary)}</p>
    <div class="tags">${note.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
    <div class="rule"></div>
    ${body}
    <p class="footer">
      Written by <a href="/">${escapeHtml(site.name)}</a>, ${escapeHtml(site.role.toLowerCase())}.
      ${escapeHtml(site.availability.status)} —
      <a href="mailto:${site.email}">${site.email}</a>
      <br>
      <a class="cta" href="/#work">See the case studies</a>
    </p>
  </main>
</body>
</html>
`
}

function render404(site) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#08080a">
  <title>Page not found — ${escapeHtml(site.name)}</title>
  <meta name="robots" content="noindex">
  <meta name="description" content="That page does not exist.">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/notes/note.css">
</head>
<body>
  <main class="wrap">
    <p class="code">404</p>
    <h1>That page is not here.</h1>
    <p class="summary">
      The link may be out of date, or the case study id may have changed.
      A recent case study link looks like <code>#work/apexon</code>.
    </p>
    <div class="rule"></div>
    <p>The useful places are:</p>
    <div class="links">
      <a href="/">Home</a>
      <a href="/#work">Case studies</a>
      <a href="/#notes">Notes</a>
      <a href="mailto:${site.email}">Email me</a>
    </div>
  </main>
</body>
</html>
`
}

async function main() {
  const [{ notes }, { site }] = await Promise.all([
    load('src/content/notes.ts', 'notes'),
    load('src/content/site.ts', 'site'),
  ])

  const notesDir = path.join(root, 'public', 'notes')
  await mkdir(notesDir, { recursive: true })
  await writeFile(path.join(notesDir, 'note.css'), PAGE_CSS.trim(), 'utf8')

  for (const note of notes) {
    const dir = path.join(notesDir, note.slug)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), renderNote(note, site), 'utf8')
  }

  await writeFile(path.join(root, 'public', '404.html'), render404(site), 'utf8')

  // ── Sitemap: the home page plus every note, newest first.
  const urls = [
    { loc: `${site.url}/`, priority: '1.0', changefreq: 'monthly' },
    ...notes.map((note) => ({
      loc: `${site.url}/notes/${note.slug}/`,
      priority: '0.7',
      changefreq: 'yearly',
      lastmod: note.date,
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
  await writeFile(path.join(root, 'public', 'sitemap.xml'), sitemap, 'utf8')

  // Keep robots.txt pointing at the right origin if site.url changed.
  const robots = `User-agent: *
Allow: /
Disallow: /assets/

Sitemap: ${site.url}/sitemap.xml
`
  await writeFile(path.join(root, 'public', 'robots.txt'), robots, 'utf8')

  console.log(
    `✔ ${notes.length} note pages + sitemap (${urls.length} URLs) written to public/`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
