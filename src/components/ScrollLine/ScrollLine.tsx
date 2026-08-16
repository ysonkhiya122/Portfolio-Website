import { useEffect, useRef } from 'react'
import styles from './ScrollLine.module.scss'

/**
 * Scroll progress indicator. Purely decorative (aria-hidden) —
 * writes transform: scaleX() directly to the DOM node inside a
 * rAF-throttled scroll handler, so scrolling never triggers React
 * re-renders.
 */
export default function ScrollLine() {
  const lineRef = useRef<HTMLDivElement>(null)
  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      ticking.current = false
      const el = lineRef.current
      if (!el) return
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0
      el.style.transform = `scaleX(${pct})`
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div ref={lineRef} className={styles.line} aria-hidden="true" />
}
