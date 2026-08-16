import { useEffect, useRef, useState } from 'react'
import styles from './AnimatedCounter.module.scss'

interface Props {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  decimals?: number
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

export default function AnimatedCounter({
  value,
  suffix   = '',
  prefix   = '',
  duration = 1400,
  decimals = 0,
}: Props) {
  const [count, setCount]       = useState(0)
  const [started, setStarted]   = useState(false)
  const containerRef             = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    // Respect reduced-motion: show the final value immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }

    const start     = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(easeOutQuart(progress) * value)
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [started, value, duration])

  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toString()

  return (
    <span ref={containerRef} className={styles.counter}>
      {prefix}{display}{suffix}
    </span>
  )
}
