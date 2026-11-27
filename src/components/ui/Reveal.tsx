import type { CSSProperties, ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger index — each step adds 55ms of delay. */
  order?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

/**
 * Declarative wrapper for the `.reveal` progressive-enhancement
 * pattern. No observers are spun up per element: a single observer is
 * created by the parent section's `useReveal` and picks these up.
 */
export default function Reveal({
  children,
  order = 0,
  as: Tag = 'div',
  className = '',
  style,
}: RevealProps) {
  return (
    <Tag
      className={`reveal ${className}`.trim()}
      style={{ '--reveal-delay': `${order * 55}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
