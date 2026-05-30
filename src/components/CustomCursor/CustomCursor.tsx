import { useEffect, useRef, useCallback } from 'react'
import styles from './CustomCursor.module.scss'

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const pos      = useRef({ x: -100, y: -100 })
  const ring     = useRef({ x: -100, y: -100 })
  const rafId    = useRef<number>(0)
  const hovering = useRef(false)

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const animate = useCallback(() => {
    ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
    ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)

    if (dotRef.current) {
      dotRef.current.style.transform =
        `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`
    }
    if (ringRef.current) {
      ringRef.current.style.transform =
        `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`
    }
    rafId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = () => {
      hovering.current = true
      dotRef.current?.classList.add(styles.hovered)
      ringRef.current?.classList.add(styles.hovered)
    }

    const onLeave = () => {
      hovering.current = false
      dotRef.current?.classList.remove(styles.hovered)
      ringRef.current?.classList.remove(styles.hovered)
    }

    const attachHover = () => {
      const interactives = document.querySelectorAll<HTMLElement>(
        'a, button, [data-cursor-hover]'
      )
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMove)
    rafId.current = requestAnimationFrame(animate)

    // Re-attach on DOM mutations (SPA route changes)
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })
    attachHover()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
      observer.disconnect()
    }
  }, [animate])

  return (
    <>
      <div ref={ringRef}  className={styles.ring} aria-hidden="true" />
      <div ref={dotRef}   className={styles.dot}  aria-hidden="true" />
    </>
  )
}
