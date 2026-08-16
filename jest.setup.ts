import '@testing-library/jest-dom'

/**
 * jsdom does not implement IntersectionObserver or matchMedia.
 * Components relying on them (useReveal, AnimatedCounter, motion
 * preferences) receive inert stand-ins in the test environment.
 */

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
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
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// jsdom also lacks scrollIntoView on elements.
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  configurable: true,
  value: () => {},
})
