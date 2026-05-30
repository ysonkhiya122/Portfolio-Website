import styles from './Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <p className={styles.copy}>
            © {year} Yash Sonkhiya. All rights reserved.
          </p>
          <p className={styles.built}>
            <span>Built with </span>React · TypeScript · SCSS
          </p>
        </div>
      </div>
    </footer>
  )
}
