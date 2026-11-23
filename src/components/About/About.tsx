import { about } from '@/content'
import { site } from '@/content/site'
import { useReveal } from '@/hooks/useReveal'
import Reveal from '@/components/ui/Reveal'
import styles from './About.module.scss'

export default function About() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="about"
      ref={ref}
      className="section section--ruled"
      aria-labelledby="about-title"
    >
      <div className="container">
        <Reveal className={styles.head}>
          <p className="eyebrow">01 / About</p>
          <h2 id="about-title" className="section-title">
            Not a list of frameworks.
          </h2>
        </Reveal>

        <div className={styles.grid}>
          <Reveal order={1} className={styles.prose}>
            <p className={styles.opener}>{about.opener}</p>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal order={2} className={styles.aside} as="aside">
            <h3 className={styles.asideTitle}>How I work</h3>
            <ol className={styles.principles}>
              {about.principles.map((principle, index) => (
                <li key={principle.title} className={styles.principle}>
                  <span className={styles.principleIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className={styles.principleTitle}>{principle.title}</h4>
                    <p className={styles.principleBody}>{principle.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <dl className={styles.facts}>
              <div>
                <dt>Based</dt>
                <dd>
                  {site.location.city}, {site.location.region}
                </dd>
              </div>
              <div>
                <dt>Timezone</dt>
                <dd>IST (UTC+5:30)</dd>
              </div>
              <div>
                <dt>Working style</dt>
                <dd>{site.location.remoteNote}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
