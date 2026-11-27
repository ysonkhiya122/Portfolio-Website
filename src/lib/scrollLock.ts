/**
 * Reference-counted body scroll lock.
 *
 * Three surfaces can lock scrolling: the case-study dialog, the command
 * palette and the mobile menu. With a naive class toggle, closing one
 * while another is open (palette → case study, menu → palette) unlocks
 * the page underneath a still-open modal.
 *
 * Counting the holders means the page only unlocks when the last one
 * releases. The lock is applied by a single `html.is-scroll-locked` rule
 * in globals.scss — the class existed in three components but had no
 * CSS behind it, so nothing was ever actually locked.
 */

let holders = 0
let scrollY = 0

const root = () => document.documentElement

export function lockScroll(): void {
  if (typeof document === 'undefined') return
  holders += 1
  if (holders > 1) return

  // Preserve the scroll position: `overflow: hidden` on the root snaps
  // some browsers to the top.
  scrollY = window.scrollY
  root().style.setProperty('--scroll-y', `-${scrollY}px`)
  root().classList.add('is-scroll-locked')
}

export function unlockScroll(): void {
  if (typeof document === 'undefined') return
  holders = Math.max(0, holders - 1)
  if (holders > 0) return

  root().classList.remove('is-scroll-locked')
  root().style.removeProperty('--scroll-y')
}

/** Test-only escape hatch, so one suite cannot leak a lock into another. */
export function resetScrollLockForTests(): void {
  holders = 0
  scrollY = 0
  root().classList.remove('is-scroll-locked')
  root().style.removeProperty('--scroll-y')
}
