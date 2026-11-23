import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

/**
 * jsdom gaps.
 *
 * Only the APIs this site actually touches are polyfilled. Anything
 * missing on purpose (native <dialog> modal behaviour, layout) is
 * asserted differently rather than faked into pretending it works.
 */

// Faster, clearer failures than the 5s default.
configure({ asyncUtilTimeout: 2000 })

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly thresholds: readonly number[] = []

  observe(): void {
    /* no-op: tests assert static output, not scroll reveals */
  }
  unobserve(): void {
    /* no-op */
  }
  disconnect(): void {
    /* no-op */
  }
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {
      /* deprecated API kept for completeness */
    },
    removeListener: () => {
      /* deprecated API kept for completeness */
    },
    addEventListener: () => {
      /* no-op */
    },
    removeEventListener: () => {
      /* no-op */
    },
    dispatchEvent: () => false,
  }),
})

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  configurable: true,
  value: () => {
    /* jsdom has no layout */
  },
})

// jsdom < 26 lacks showModal/close on <dialog>.
// jsdom ships <dialog> without modal support; fill only the missing half.
if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  configurable: true,
  value: { writeText: jest.fn().mockResolvedValue(undefined) },
})
