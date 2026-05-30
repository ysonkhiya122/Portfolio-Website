import { useEffect, useRef } from 'react'

/**
 * useReveal
 * Attaches an IntersectionObserver to a container ref and adds the
 * `is-visible` class to all children matching `.reveal` when they
 * enter the viewport. Cleans up on unmount.
 */
export function useReveal(threshold = 0.08) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const elements = container.querySelectorAll<HTMLElement>('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [threshold])

  return containerRef
}
