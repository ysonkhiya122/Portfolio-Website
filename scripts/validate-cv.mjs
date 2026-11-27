#!/usr/bin/env node
/**
 * CV freshness gate.
 *
 * The CV PDF is generated from the same content layer the site renders,
 * so it can only be correct if it was regenerated after the last content
 * edit. It is a committed binary, though, so drift is invisible: nothing
 * in a diff shows that the PDF still says "18 months".
 *
 * This compares a hash of the CV's source HTML — computed by
 * `build-cv.mjs --hash-only`, which needs no browser — against the hash
 * recorded the last time the PDF was actually rendered. Mismatch means
 * the PDF is stale. That makes the "always current" claim in its footer
 * something CI can enforce instead of something the README asserts.
 *
 *   npm run validate:cv
 */
import { readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

async function main() {
  let recorded
  try {
    recorded = (await readFile(path.join(root, 'cv-content-hash.txt'), 'utf8')).trim()
  } catch {
    console.error(
      '\n✖ cv-content-hash.txt is missing — the CV has never been generated.\n' +
        "   Run 'npx playwright install chromium' then 'npm run build:cv'.\n",
    )
    process.exit(1)
  }

  const { stdout } = await run(
    'node',
    [path.join(root, 'scripts/build-cv.mjs'), '--hash-only'],
    {
      cwd: root,
    },
  )
  const current = stdout.trim()

  if (current !== recorded) {
    console.error(
      '\n✖ public/yash-sonkhiya-cv.pdf is stale.\n' +
        '   The content layer changed after the PDF was rendered, so the CV\n' +
        '   no longer matches the site — the exact drift this generator exists\n' +
        '   to prevent.\n\n' +
        "   Fix: 'npx playwright install chromium && npm run build:cv'\n",
    )
    process.exit(1)
  }

  console.log(`✔ CV is current — matches content hash ${recorded.slice(0, 12)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
