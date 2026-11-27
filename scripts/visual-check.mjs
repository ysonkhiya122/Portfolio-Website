#!/usr/bin/env node
/**
 * Visual smoke check.
 *
 * Renders the built site at three widths, exercises the case-study
 * dialog and the command palette, fails on console errors, and writes
 * screenshots to ./shots (git-ignored). Run against `npm run preview`.
 *
 *   npm run preview &  npm run visual
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = 'shots'
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const failures = []

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
  })

  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`${viewport.name}: ${message.text()}`)
  })
  page.on('pageerror', (error) => failures.push(`${viewport.name}: ${error.message}`))

  await page.goto(BASE, { waitUntil: 'networkidle' })

  // Force every reveal so the full page is captured, not just the fold.
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
  })
  await page.waitForTimeout(300)

  for (const id of ['about', 'work', 'experience', 'skills', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(250)
    await page.screenshot({ path: `${OUT}/${viewport.name}-${id}.png` })
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: `${OUT}/${viewport.name}-hero.png` })

  // Interactive surfaces only need checking once.
  if (viewport.name === 'desktop') {
    await page.locator('#work').scrollIntoViewIfNeeded()
    await page
      .getByRole('button', { name: /read the case study/i })
      .first()
      .click()
    await page.waitForTimeout(400)
    if (!(await page.getByRole('dialog').isVisible()))
      failures.push('case study dialog did not open')
    await page.screenshot({ path: `${OUT}/dialog.png` })
    await page.keyboard.press('Escape')

    await page.keyboard.press('Control+k')
    await page.waitForTimeout(400)
    if (!(await page.getByRole('dialog', { name: 'Command palette' }).isVisible())) {
      failures.push('command palette did not open')
    }
    await page.screenshot({ path: `${OUT}/palette.png` })
  }

  await page.close()
}

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: 900 } })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
  })
  await page.screenshot({ path: `${OUT}/${viewport.name}-full.png`, fullPage: true })
  await page.close()
}

await browser.close()

if (failures.length > 0) {
  console.error('\n✖ Visual check found problems:\n')
  failures.forEach((failure) => console.error(`   ${failure}`))
  process.exit(1)
}

console.log(`✔ Visual check passed — screenshots in ./${OUT}`)
