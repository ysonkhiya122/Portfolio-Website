import { useState, useEffect } from 'react'
import styles from './Nav.module.scss'

const NAV_ITEMS = [
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Contact',    href: '#contact'    },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const anchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo} aria-label="Yash Sonkhiya">
        YS <span>/ Portfolio</span>
      </div>

      <ul className={styles.links} role="list">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a href={item.href} onClick={(e) => anchor(e, item.href)} data-cursor-hover>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <span className={styles.kbdHint} aria-hidden="true">
          <kbd>⌘</kbd><kbd>K</kbd>
        </span>
        <a href="mailto:yashsonkhiya2195@gmail.com" className={styles.cta} data-cursor-hover>
          Hire me
        </a>
      </div>
    </nav>
  )
}
