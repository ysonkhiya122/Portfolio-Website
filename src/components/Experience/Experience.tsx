import { content } from '@/content'
import type { Experience as ExperienceEntry } from '@/content'
import { formatRange, formatDuration } from '@/lib/format'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import { sectionEyebrow } from '@/content/sections'
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
  return (
    <Section
      id="experience"
      eyebrow={sectionEyebrow('experience')}
      title="Two roles, one promotion, three years of production."
    >
      <div className={styles.timeline}>
        {content.experience.map((entry, index) => (
          <TimelineEntry key={entry.id} entry={entry} order={index} />
        ))}
      </div>
    </Section>
  )
}
