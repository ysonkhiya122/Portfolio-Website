import { useScrollProgress } from '@/hooks/useScrollProgress'
import styles from './ScrollLine.module.scss'

export default function ScrollLine() {
  const progress = useScrollProgress()

  return (
    <div
      className={styles.line}
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  )
}
