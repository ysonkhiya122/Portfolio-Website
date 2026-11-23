import { useEffect, useRef } from 'react'

/**
 * Reveals every `.reveal` descendant once it enters the viewport.
 *
 * Only meaningful when the `js` class is on <html> (set pre-paint in
 * main.tsx). Without it, `.reveal` elements are plain visible content,
 * so a JS failure degrades to a static — but complete — page.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.12) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const elements = Array.from(container.querySelectorAll<HTMLElement>('.reveal'))
    if (elements.length === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold])

  return containerRef
}
