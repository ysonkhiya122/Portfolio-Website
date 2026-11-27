import { site } from '@/content/site'
import styles from './Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <p className={styles.mark}>{site.initials}</p>
          <p className={styles.copy}>
            © {year} {site.name}. Built in Delhi.
          </p>
        </div>

        <nav className={styles.links} aria-label="Elsewhere">
          <a href={site.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`}>Email</a>
          <a href="/yash-sonkhiya-cv.pdf">CV</a>
        </nav>

        <p className={styles.stack}>React 18 · TypeScript · Vite 7 · no UI kit</p>
      </div>
    </footer>
  )
}
