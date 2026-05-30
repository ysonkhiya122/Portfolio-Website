import styles from './OpenToWork.module.scss'

export default function OpenToWork() {
  return (
    <a
      href="mailto:yashsonkhiya2195@gmail.com"
      className={styles.badge}
      aria-label="Open to work — contact Yash"
      data-cursor-hover
    >
      <span className={styles.pulse} aria-hidden="true" />
      <span className={styles.dot}   aria-hidden="true" />
      <span className={styles.label}>Open to work</span>
    </a>
  )
}
