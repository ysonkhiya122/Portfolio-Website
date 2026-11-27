#!/usr/bin/env node
/**
 * Link integrity gate.
 *
 * Three classes of broken link kept appearing during development, all of
 * which are invisible in a browser until a visitor finds them:
 *
 *   1. A palette command pointing at `/yash-sonkhiya-cv.pdf` when the
 *      file may not have been generated.
 *   2. A nav link to `#skills` when the section id is something else.
 *   3. A note link to a slug that does not exist (or a page not built).
 *
 * This asserts all three, plus that every generated note page was built.
 * It reads the source rather than a rendered DOM, so it runs in a second
 * and needs no browser.
 *
 *   npm run validate:links
 */
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const problems = []
const checked = { assets: 0, anchors: 0, notes: 0 }

async function load(entry, name) {
  const { build } = await import('esbuild')
  const cache = path.join(root, 'node_modules', '.cache')
  const outfile = path.join(cache, `${name}.links.mjs`)
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

/** Every href quoted anywhere in the app source. */
async function collectSourceHrefs(dir = path.join(root, 'src')) {
  const hrefs = new Set()
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      for (const href of await collectSourceHrefs(full)) hrefs.add(href)
    } else if (/\.(tsx?|mdx?)$/.test(entry.name) && !entry.name.includes('.test.')) {
      const source = await readFile(full, 'utf8')
      for (const match of source.matchAll(/(?:href|to|src)=["'{]?['"`]([^'"`\s]+)['"`]/g)) {
        hrefs.add(match[1])
      }
      for (const match of source.matchAll(/['"`](\/[a-z0-9][^'"`\s]*)['"`]/gi)) {
        hrefs.add(match[1])
      }
    }
  }
  return hrefs
}

async function main() {
  const [{ assets }, { notes }, { sectionOrder }] = await Promise.all([
    load('src/content/assets.ts', 'assets'),
    load('src/content/notes.ts', 'notes'),
    load('src/content/sections.ts', 'sections'),
  ])

  // ── 1. Registry-declared downloads must exist in public/
  for (const asset of assets) {
    checked.assets += 1
    const file = path.join(root, 'public', asset.href.replace(/^\//, ''))
    if (!existsSync(file)) {
      problems.push(`asset "${asset.id}" → ${asset.href} does not exist in public/`)
    }
  }

  // ── 2. Every /-prefixed href in the source must resolve to a file,
  //      a built note page, or a known page route.
  const hrefs = await collectSourceHrefs()
  const notePaths = new Set(notes.map((note) => `/notes/${note.slug}/`))
  const knownRoutes = new Set(['/', '/notes/'])

  // Template literals cannot be resolved statically; the note-page check
  // in step 4 covers their real risk (a slug with no built page).
  const STATIC_UNRESOLVABLE = /\$\{/

  // Layout anchors that are not narrative sections: skip links and the
  // scroll-to-top target.
  const LAYOUT_ANCHORS = new Set(['main', 'top', 'content'])

  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue
    if (STATIC_UNRESOLVABLE.test(href)) continue
    const clean = href.split('?')[0].split('#')[0]
    if (clean === '' || clean === '/') continue
    if (notePaths.has(clean) || knownRoutes.has(clean)) {
      checked.notes += 1
      continue
    }
    // App bundles under /assets are produced by vite; ignore those.
    if (clean.startsWith('/assets/')) continue

    const file = path.join(root, 'public', clean.replace(/^\//, ''))
    const built = path.join(root, 'public', clean.replace(/^\//, ''), 'index.html')
    if (!existsSync(file) && !existsSync(built)) {
      problems.push(`source href ${href} has no matching file in public/`)
    }
  }

  // ── 3. Section anchors in the source must match a declared section id.
  const ids = new Set(sectionOrder)
  for (const href of hrefs) {
    if (!href.startsWith('#')) continue
    const id = href.slice(1)
    if (id.startsWith('work/')) continue // case-study deep links
    if (LAYOUT_ANCHORS.has(id)) continue
    checked.anchors += 1
    if (!ids.has(id)) {
      problems.push(`anchor ${href} is not a section id (${[...ids].join(', ')})`)
    }
  }

  // ── 4. Every note must have a built page.
  for (const note of notes) {
    const page = path.join(root, 'public', 'notes', note.slug, 'index.html')
    if (!existsSync(page)) {
      problems.push(`note "${note.slug}" has no built page — run npm run build:pages`)
    }
  }

  if (problems.length > 0) {
    console.error(`\n✖ link check failed (${problems.length} problem(s)):\n`)
    for (const problem of problems) console.error(`  · ${problem}`)
    console.error('')
    process.exit(1)
  }

  console.log(
    `✔ links ok — ${checked.assets} assets · ${checked.anchors} anchors · ${notePaths.size} note routes`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
