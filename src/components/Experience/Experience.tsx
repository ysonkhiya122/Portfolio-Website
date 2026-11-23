import { content } from '@/content'
import type { Experience as ExperienceEntry } from '@/content'
import { formatRange, formatDuration } from '@/lib/format'
import { useReveal } from '@/hooks/useReveal'
import Reveal from '@/components/ui/Reveal'
import styles from './Experience.module.scss'

function TimelineEntry({ entry, order }: { entry: ExperienceEntry; order: number }) {
  return (
    <Reveal as="article" order={order} className={styles.entry}>
      <div className={styles.rail} aria-hidden="true">
        <span className={styles.node} data-current={entry.end === null || undefined} />
      </div>

      <div className={styles.body}>
        <header className={styles.header}>
          <div className={styles.headMain}>
            <h3 className={styles.role}>{entry.role}</h3>
            <p className={styles.org}>
              {entry.company}
              <span className={styles.orgSep} aria-hidden="true">
                ·
              </span>
              {entry.location}
            </p>
          </div>

          <p className={styles.dates}>
            <time dateTime={entry.start}>{formatRange(entry.start, entry.end)}</time>
            <span className={styles.duration}>{formatDuration(entry.start, entry.end)}</span>
          </p>
        </header>

        <p className={styles.summary}>{entry.summary}</p>

        <ul className={styles.highlights}>
          {entry.highlights.map((highlight) => (
            <li key={highlight.slice(0, 30)} className={styles.highlight}>
              {highlight}
            </li>
          ))}
        </ul>

        {entry.promotion && (
          <p className={styles.promotion}>
            <span aria-hidden="true">↑</span>
            {entry.promotion.title} ·{' '}
            {formatRange(entry.promotion.date, null).replace(' — Present', '')}
          </p>
        )}

        <ul className={styles.stack} aria-label="Technologies used">
          {entry.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function Experience() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="experience"
      ref={ref}
      className="section section--ruled"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <Reveal className={styles.head}>
          <p className="eyebrow">03 / Experience</p>
          <h2 id="experience-title" className="section-title">
            Two roles, one promotion, three years of production.
          </h2>
        </Reveal>

        <div className={styles.timeline}>
          {content.experience.map((entry, index) => (
            <TimelineEntry key={entry.id} entry={entry} order={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
