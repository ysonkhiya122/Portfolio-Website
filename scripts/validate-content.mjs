#!/usr/bin/env node
/**
 * Content gate.
 *
 * Runs in CI and on pre-commit. Fails the build if the content layer
 * is malformed, if a metric claim is missing its source, or if a link
 * is not a valid absolute URL. This is the job a runtime validator
 * would have done — moved to where it costs the visitor nothing.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { transform } from 'esbuild'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

async function loadContentModule() {
  // esbuild lets us import the TS content without a build step.
  const { build } = await import('esbuild')
  const outfile = path.join(root, 'node_modules', '.cache', 'content-check.mjs')

  await build({
    entryPoints: [path.join(root, 'src/content/portfolio.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile,
    logLevel: 'silent',
  })

  return import(`file://${outfile}?t=${Date.now()}`)
}

const CONTENT_KEYS = [
  'heroStats',
  'projects',
  'experience',
  'skillGroups',
  'achievements',
  'education',
  'testimonials',
  'faqs',
]

async function main() {
  const { contentSchema } = await import(
    `file://${path.join(root, 'node_modules', '.cache', 'schema-check.mjs')}?t=${Date.now()}`
  ).catch(async () => {
    const { build } = await import('esbuild')
    const outfile = path.join(root, 'node_modules', '.cache', 'schema-check.mjs')
    await build({
      entryPoints: [path.join(root, 'src/content/schema.ts')],
      bundle: true,
      format: 'esm',
      platform: 'node',
      outfile,
      logLevel: 'silent',
    })
    return import(`file://${outfile}?t=${Date.now()}`)
  })

  const mod = await loadContentModule()
  const payload = Object.fromEntries(CONTENT_KEYS.map((key) => [key, mod[key]]))

  const result = contentSchema.safeParse(payload)

  if (!result.success) {
    console.error('\n✖  Portfolio content is invalid:\n')
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join('.') || '(root)'} — ${issue.message}`)
    }
    console.error('\n')
    process.exit(1)
  }

  // Additional house rules that schemas alone cannot express.
  const problems = []

  for (const project of result.data.projects) {
    for (const metric of project.impact) {
      if (!metric.source || metric.source.length < 3) {
        problems.push(`project "${project.id}" metric "${metric.label}" has no source`)
      }
    }
    if (project.status !== 'live' && project.links.some((link) => link.kind === 'live')) {
      problems.push(`project "${project.id}" is ${project.status} but links to a live site`)
    }
  }

  const ids = new Set()
  for (const collection of [result.data.projects, result.data.experience]) {
    for (const item of collection) {
      if (ids.has(item.id)) problems.push(`duplicate id "${item.id}"`)
      ids.add(item.id)
    }
  }

  const heroStats = result.data.heroStats
  if (heroStats.length !== 4) problems.push('hero must have exactly four stats')

  if (problems.length > 0) {
    console.error('\n✖  Content house rules failed:\n')
    problems.forEach((problem) => console.error(`   ${problem}`))
    console.error('\n')
    process.exit(1)
  }

  const counts = [
    `${result.data.projects.length} case studies`,
    `${result.data.experience.length} roles`,
    `${result.data.skillGroups.reduce((sum, group) => sum + group.skills.length, 0)} skills`,
    `${result.data.faqs.length} FAQs`,
  ]

  console.log(`✔  Content valid — ${counts.join(' · ')}`)

  // Warn (not fail) when a placeholder company name is still present.
  const siteSource = await readFile(path.join(root, 'src/content/site.ts'), 'utf8')
  if (/current:\s*'Accenture'/.test(siteSource)) {
    console.log(
      '   note: employer is set to "Accenture" in src/content/site.ts — confirm it is correct.',
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
