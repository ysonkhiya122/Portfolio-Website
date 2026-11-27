import { content } from '@/content'
import { formatMonth } from '@/lib/format'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import { sectionEyebrow } from '@/content/sections'
import styles from './Recognition.module.scss'

export default function Recognition() {
  const sorted = [...content.achievements].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Section id="recognition" eyebrow={sectionEyebrow('recognition')} title="Receipts.">
      <div className={styles.layout}>
        <Reveal className={styles.head}>
          <p className={styles.note}>
            Everything here is verifiable on request. No invented awards.
          </p>
        </Reveal>

        <Reveal order={1} className={styles.listWrapper}>
          <ol className={styles.list}>
            {sorted.map((item) => (
              <li key={item.id} className={styles.item}>
                <time className={styles.date} dateTime={item.date}>
                  {formatMonth(item.date)}
                </time>
                <div className={styles.detail}>
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.issuer}>{item.issuer}</p>
                </div>
              </li>
            ))}
          </ol>

          {content.education.map((entry) => (
            <div key={entry.id} className={styles.education}>
              <time className={styles.date} dateTime={entry.end}>
                {entry.start}–{entry.end}
              </time>
              <div className={styles.detail}>
                <p className={styles.title}>{entry.qualification}</p>
                <p className={styles.issuer}>
                  {entry.institution} · {entry.location}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
