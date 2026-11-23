import { content } from '@/content'
import { formatMonth } from '@/lib/format'
import { useReveal } from '@/hooks/useReveal'
import Reveal from '@/components/ui/Reveal'
import styles from './Recognition.module.scss'

export default function Recognition() {
  const ref = useReveal<HTMLElement>()
  const sorted = [...content.achievements].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section
      id="recognition"
      ref={ref}
      className="section section--ruled"
      aria-labelledby="recognition-title"
    >
      <div className="container">
        <div className={styles.layout}>
          <Reveal className={styles.head}>
            <p className="eyebrow">05 / Recognition</p>
            <h2 id="recognition-title" className="section-title">
              Receipts.
            </h2>
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
      </div>
    </section>
  )
}
