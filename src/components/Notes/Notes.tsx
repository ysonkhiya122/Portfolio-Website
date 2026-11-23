import { sortedNotes } from '@/lib/noteRoutes'
import { formatMonth } from '@/lib/format'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import styles from './Notes.module.scss'

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 9 9 3M9 3H4M9 3v5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Notes() {
  return (
    <Section
      id="notes"
      eyebrow="Writing"
      title="Write-ups, not blog posts."
      description="Short pieces about decisions that were hard to make. Written so that someone facing the same problem gets something useful, not so that I look clever."
    >
      <ul className={styles.list}>
        {sortedNotes.map((note, index) => (
          <Reveal as="li" key={note.slug} order={index} className={styles.item}>
            <a href={`/notes/${note.slug}/`} className={styles.link}>
              <div className={styles.meta}>
                <time dateTime={note.date}>{formatMonth(note.date)}</time>
                <span className={styles.sep} aria-hidden="true">
                  ·
                </span>
                <span>{note.readingMinutes} min read</span>
              </div>
              <h3 className={styles.title}>{note.title}</h3>
              <p className={styles.summary}>{note.summary}</p>
              <ul className={styles.tags} aria-label="Topics">
                {note.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
              <span className={styles.read}>
                Read <ArrowUpRight />
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
