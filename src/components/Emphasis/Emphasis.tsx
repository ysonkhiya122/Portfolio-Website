import { Fragment } from 'react'

/**
 * Renders a string containing **bold** markers as React nodes,
 * replacing the previous dangerouslySetInnerHTML approach.
 * "a **b** c" -> a <strong>b</strong> c
 */
export default function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i}>{part}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}
