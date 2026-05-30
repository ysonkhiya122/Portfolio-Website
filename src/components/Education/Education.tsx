import { useReveal } from '@/hooks/useReveal'
import { education } from '@/data/portfolio'
import styles from './Education.module.scss'

export default function Education() {
  const sectionRef = useReveal()

  return (
    <section
      id="education"
      className={`section-base ${styles.education}`}
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-header__index">06</span>
          <h2 className="section-header__title">Education</h2>
        </div>

        <div className={styles.list}>
          {education.map((item, i) => (
            <div
              key={item.id}
              className={`reveal ${styles.item}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <p className={styles.year}>{item.period}</p>
              <div className={styles.content}>
                <h3 className={styles.degree}>{item.degree}</h3>
                <p className={styles.institution}>{item.institution}</p>
                <p className={styles.location}>{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
