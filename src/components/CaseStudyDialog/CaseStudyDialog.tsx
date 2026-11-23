import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '@/content'
import styles from './CaseStudyDialog.module.scss'

interface Props {
  project: Project | null
  onClose: () => void
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Native <dialog> in modal mode.
 *
 * Replaces the hand-rolled overlay + manual focus trap the previous
 * version implemented. The platform now handles inertness of the rest
 * of the page, focus restoration on close, Escape, and the top layer,
 * so there is less custom accessibility code to get wrong.
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
      document.documentElement.classList.add('is-scroll-locked')
    } else if (!project && dialog.open) {
      dialog.close()
      document.documentElement.classList.remove('is-scroll-locked')
    }

    return () => {
      document.documentElement.classList.remove('is-scroll-locked')
    }
  }, [project])

  // Belt and braces: if the browser closes the dialog itself (Escape),
  // keep React state in sync.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handle = () => {
      document.documentElement.classList.remove('is-scroll-locked')
      onClose()
    }
    dialog.addEventListener('cancel', handle)
    return () => dialog.removeEventListener('cancel', handle)
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="case-study-title"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (!nodes || nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
    >
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
