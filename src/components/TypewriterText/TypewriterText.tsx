import { useEffect, useState, useRef } from 'react'
import styles from './TypewriterText.module.scss'

interface Props {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

type Phase = 'typing' | 'pausing' | 'deleting'

export default function TypewriterText({
  phrases,
  typingSpeed   = 60,
  deletingSpeed = 30,
  pauseDuration = 1800,
  className     = '',
}: Props) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase]         = useState<Phase>('typing')
  const phraseIdx = useRef(0)
  const charIdx   = useRef(0)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) return
    const current = phrases[phraseIdx.current]

    if (phase === 'typing') {
      if (charIdx.current < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx.current + 1))
          charIdx.current++
        }, typingSpeed)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pausing'), pauseDuration)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'pausing') {
      setPhase('deleting')
    }

    if (phase === 'deleting') {
      if (charIdx.current > 0) {
        const t = setTimeout(() => {
          charIdx.current--
          setDisplayed(current.slice(0, charIdx.current))
        }, deletingSpeed)
        return () => clearTimeout(t)
      } else {
        phraseIdx.current = (phraseIdx.current + 1) % phrases.length
        setPhase('typing')
      }
    }
  }, [phase, displayed, phrases, typingSpeed, deletingSpeed, pauseDuration, reducedMotion])

  // Static fallback for users who prefer reduced motion.
  if (reducedMotion) {
    return <span className={`${styles.wrapper} ${className}`}>{phrases[0]}</span>
  }

  return (
    <span className={`${styles.wrapper} ${className}`}>
      {/* Screen readers get a stable label; the animated text is decorative. */}
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden="true">
        {displayed}
        <span className={styles.caret} />
      </span>
    </span>
  )
}
