import type { ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface SectionProps {
  id: string
  eyebrow: string
  title: ReactNode
  children: ReactNode
  /** Optional lede rendered under the title. */
  description?: ReactNode
  className?: string
  /** Extra content rendered in the header row (e.g. a count or action). */
  headerAside?: ReactNode
}

/**
 * The one section shell.
 *
 * It exists for three reasons:
 *
 * 1. `tabIndex={-1}` makes the section programmatically focusable, so
 *    in-page links can move *focus* and not just scroll position.
 *    Previously nav links called `.focus()` on a plain <section>, which
 *    silently did nothing and dropped keyboard users' focus to <body>.
 * 2. The reveal observer lives here, so nine sections register one each
 *    instead of every component re-implementing the pattern.
 * 3. Numbering, spacing and the header rhythm are defined once.
 */
export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
  headerAside,
}: SectionProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={`section section--ruled ${className}`.trim()}
    >
      <div className="container">
        <header className="reveal section-head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={`${id}-title`} className="section-title">
              {title}
            </h2>
          </div>
          {headerAside}
        </header>

        {description !== undefined && (
          <div className="reveal section-lede">
            <p className="lede">{description}</p>
          </div>
        )}

        {children}
      </div>
    </section>
  )
}
