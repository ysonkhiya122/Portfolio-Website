import { useEffect, useRef, useState } from 'react'
import { site } from '@/content/site'
import { lockScroll, unlockScroll } from '@/lib/scrollLock'
import styles from './Nav.module.scss'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Notes', href: '#notes' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
] as const

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Condense the bar after the fold. rAF-throttled, passive listener.
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view — the thing a one-page
  // site is missing most often.
  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(
      (node): node is Element => node !== null,
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible.at(0)
        if (top !== undefined) setActiveSection(`#${top.target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Mobile menu: lock scroll, trap nothing (it is a disclosure, not a
  // dialog), close on Escape and return focus to the trigger.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      buttonRef.current?.focus()
    }
    lockScroll()
    window.addEventListener('keydown', onKey)
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const go = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(href)
    if (!target) return
    event.preventDefault()
    setMenuOpen(false)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', href)
    ;(target as HTMLElement).focus({ preventScroll: true })
  }

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled || undefined}
      data-open={menuOpen || undefined}
    >
      <div className={`container ${styles.bar}`}>
        {/* No aria-label here: the visible text is the accessible name.
            An aria-label that omits the visible "YS" monogram fails
            WCAG 2.5.3 (label in name). */}
        <a href="#top" className={styles.brand} onClick={go('#top')}>
          <span className={styles.brandMark} aria-hidden="true">
            {site.initials}
          </span>
          <span className={styles.brandName}>
            {site.name}
            <span className="sr-only"> — back to top</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.links}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={go(link.href)}
                  className={styles.link}
                  aria-current={activeSection === link.href ? 'true' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.paletteHint}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }),
              )
            }
          >
            {/* The visible text is "⌘ K"; the accessible name must contain
                it, so the label is built from a hidden span instead of an
                aria-label that replaced it. */}
            <span className="sr-only">Open command palette </span>
            <kbd>{IS_MAC ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </button>

          <a
            href="#contact"
            className={`btn btn--primary ${styles.cta}`}
            onClick={go('#contact')}
          >
            Hire me
          </a>

          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuBars} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.mobileMenu} hidden={!menuOpen}>
        <ul className={styles.mobileLinks}>
          {LINKS.map((link, index) => (
            <li key={link.href} style={{ '--i': index } as React.CSSProperties}>
              <a href={link.href} onClick={go(link.href)}>
                <span className={styles.mobileIndex} aria-hidden="true">
                  0{index + 1}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.mobileFoot}>
          <a href={`mailto:${site.email}`} className={styles.mobileMail}>
            {site.email}
          </a>
          <p className={styles.mobileNote}>{site.availability.status}</p>
        </div>
      </div>
    </header>
  )
}
