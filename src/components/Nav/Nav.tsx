import { useState, useEffect } from 'react'
import styles from './Nav.module.scss'

const NAV_ITEMS = [
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Contact',    href: '#contact'    },
]

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close the menu with Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const anchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} aria-label="Main">
      <a href="/" className={styles.logo} aria-label="Yash Sonkhiya — home">
        YS <span>/ Portfolio</span>
      </a>

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
          <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd>
        </span>
        <a href="mailto:yashsonkhiya2195@gmail.com" className={styles.cta} data-cursor-hover>
          Hire me
        </a>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul role="list">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.href} style={{ transitionDelay: menuOpen ? `${i * 0.04}s` : '0s' }}>
              <a
                href={item.href}
                onClick={(e) => anchor(e, item.href)}
                tabIndex={menuOpen ? 0 : -1}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li style={{ transitionDelay: menuOpen ? `${NAV_ITEMS.length * 0.04}s` : '0s' }}>
            <a
              href="mailto:yashsonkhiya2195@gmail.com"
              className={styles.mobileCta}
              tabIndex={menuOpen ? 0 : -1}
            >
              Hire me ↗
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
