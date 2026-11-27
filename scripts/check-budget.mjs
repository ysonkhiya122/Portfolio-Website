#!/usr/bin/env node
/**
 * Performance budget gate.
 *
 * A portfolio whose own landing page is slow is a contradiction. These
 * budgets are enforced in CI so a heavy dependency cannot sneak in
 * unnoticed. Raise a budget deliberately or not at all.
 */
import { readdir, stat, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist')

// The vendor chunk is split out of the app entry via manualChunks, so
// "entry" here means the application code only — React lives in its own
// long-cached bundle. Both are counted in critical-total.
const BUDGETS = {
  // Application entry JS, gzipped.
  'js-entry': 30 * 1024,
  // React + scheduler vendor chunk, gzipped. Changes rarely.
  'js-vendor': 60 * 1024,
  // Everything lazily loaded, combined.
  'js-lazy': 30 * 1024,
  // CSS, gzipped. Budget: 26 kB.
  css: 26 * 1024,
  // Everything the browser must fetch to render the first screen.
  'critical-total': 190 * 1024,
}

async function main() {
  const assetsDir = path.join(dist, 'assets')

  let entryJs = 0
  let vendorJs = 0
  let lazyJs = 0
  let css = 0

  for (const file of await readdir(assetsDir)) {
    const full = path.join(assetsDir, file)
    const info = await stat(full)
    if (!info.isFile()) continue

    const gzipped = gzipSync(await readFile(full)).length

    if (file.endsWith('.js')) {
      if (file.startsWith('react-')) vendorJs += gzipped
      else if (file.startsWith('index-')) entryJs += gzipped
      else lazyJs += gzipped
    } else if (file.endsWith('.css')) {
      css += gzipped
    }
  }

  const html = gzipSync(await readFile(path.join(dist, 'index.html'))).length
  const fonts = await measureFonts(assetsDir)
  const critical = entryJs + vendorJs + css + html + fonts

  const results = [
    ['js-entry', entryJs, BUDGETS['js-entry']],
    ['js-vendor', vendorJs, BUDGETS['js-vendor']],
    ['js-lazy', lazyJs, BUDGETS['js-lazy']],
    ['css', css, BUDGETS.css],
    ['critical-total', critical, BUDGETS['critical-total']],
  ]

  const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`
  let failed = false

  console.log('\n  Budget report (gzipped)\n')
  for (const [name, actual, budget] of results) {
    const ok = actual <= budget
    if (!ok) failed = true
    const pct = ((actual / budget) * 100).toFixed(0)
    console.log(
      `  ${ok ? '✔' : '✖'} ${name.padEnd(16)} ${kb(actual).padStart(10)} / ${kb(budget).padStart(10)}  ${pct}%`,
    )
  }

  console.log(`\n  (fonts measured for latin subset: ${kb(fonts)})\n`)

  if (failed) {
    console.error('  Budget exceeded. Trim the bundle or raise the budget deliberately.\n')
    process.exit(1)
  }
}

/** Only the latin subsets are counted — that is what an EN page loads. */
async function measureFonts(assetsDir) {
  let total = 0
  for (const file of await readdir(assetsDir)) {
    if (!file.endsWith('.woff2')) continue
    if (!/-latin-(?:wght-)?(?:normal|400|500)/.test(file)) continue
    if (file.includes('latin-ext')) continue
    total += (await stat(path.join(assetsDir, file))).size
  }
  return total
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
