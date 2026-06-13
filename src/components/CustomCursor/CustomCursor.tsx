import { useEffect, useRef, useCallback, useState } from 'react'
import styles from './CustomCursor.module.scss'

/**
 * CustomCursor — only rendered on pointer (mouse) devices.
 * Touch/tablet users never see it; the default system cursor remains.
 * Respects prefers-reduced-motion by disabling the lerp animation.
 */
export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const pos      = useRef({ x: -100, y: -100 })
  const ring     = useRef({ x: -100, y: -100 })
  const rafId    = useRef<number>(0)
  const hovering = useRef(false)

  // Only render on devices with a fine pointer (mouse)
  const [isPointerDevice, setIsPointerDevice] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setIsPointerDevice(mq.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mq.matches

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const animate = useCallback(() => {
    const lerpFactor = prefersReducedMotion.current ? 1 : 0.12

    ring.current.x = lerp(ring.current.x, pos.current.x, lerpFactor)
    ring.current.y = lerp(ring.current.y, pos.current.y, lerpFactor)

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
    if (!isPointerDevice) return

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
  }, [isPointerDevice, animate])

  // Don't render on touch/tablet devices
  if (!isPointerDevice) return null

  return (
    <>
      <div ref={ringRef}  className={styles.ring} aria-hidden="true" />
      <div ref={dotRef}   className={styles.dot}  aria-hidden="true" />
    </>
  )
}
