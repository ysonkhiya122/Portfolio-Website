import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '@/content'
import { lockScroll, unlockScroll } from '@/lib/scrollLock'
import styles from './CaseStudyDialog.module.scss'

interface Props {
  project: Project | null
  onClose: () => void
}

/**
 * Native <dialog> in modal mode.
 *
 * The platform handles inertness of the rest of the page, focus
 * restoration on close, Escape, and the top layer. This component no
 * longer implements its own Tab trap: `showModal()` already does it, and
 * a second trap fighting the first is how focus bugs happen.
 */
export default function CaseStudyDialog({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (project && !dialog.open) {
      dialog.showModal()
      // Move focus to the close control, not the container.
      closeRef.current?.focus()
      lockScroll()
    } else if (!project && dialog.open) {
      dialog.close()
      unlockScroll()
    }
  }, [project])

  // Belt and braces: if the browser closes the dialog itself (Escape),
  // keep React state in sync.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handle = () => {
      unlockScroll()
      onClose()
    }
    dialog.addEventListener('cancel', handle)
    return () => dialog.removeEventListener('cancel', handle)
  }, [onClose])

  // Release the lock if the component unmounts while open.
  useEffect(() => () => unlockScroll(), [])

  if (typeof document === 'undefined') return null

  return createPortal(
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="case-study-title">
      {project && (
        <article className={styles.content}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>
                Case study · {project.timeframe} · {project.role}
              </p>
              <h2 id="case-study-title" className={styles.title}>
                {project.name}
              </h2>
              <p className={styles.headline}>{project.headline}</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close case study"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M2 2l10 10M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <section className={styles.block}>
            <h3 className={styles.blockTitle}>The problem</h3>
            <p className={styles.body}>{project.context}</p>
          </section>

          <section className={styles.block}>
            <h3 className={styles.blockTitle}>Decisions and trade-offs</h3>
            <ul className={styles.decisions}>
              {project.decisions.map((decision) => (
                <li key={decision.slice(0, 28)} className={styles.decision}>
                  {decision}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <h3 className={styles.blockTitle}>Outcome</h3>
            <dl className={styles.impact}>
              {project.impact.map((metric) => (
                <div key={metric.label} className={styles.impactItem}>
                  <dt className={styles.impactLabel}>{metric.label}</dt>
                  <dd className={styles.impactValue}>{metric.value}</dd>
                  <p className={styles.impactSource}>Source: {metric.source}</p>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.block}>
            <h3 className={styles.blockTitle}>Stack</h3>
            <ul className={styles.stack}>
              {project.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
            {project.notes && <p className={styles.notes}>{project.notes}</p>}
          </section>

          <footer className={styles.footer}>
            {project.links
              .filter((link) => link.kind !== 'case-study')
              .map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                >
                  {link.label}
                </a>
              ))}
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Close
            </button>
          </footer>
        </article>
      )}
    </dialog>,
    document.body,
  )
}
