import { useReveal } from '@/hooks/useReveal'
import { achievements } from '@/data/portfolio'
import styles from './Achievements.module.scss'

export default function Achievements() {
  const sectionRef = useReveal()

  return (
    <section
      id="achievements"
      className={`section-base ${styles.achievements}`}
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-header__index">05</span>
          <h2 className="section-header__title">Recognition</h2>
        </div>

        <div className={styles.list}>
          {achievements.map((item, i) => (
            <div
              key={item.id}
              className={`reveal ${styles.item}`}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <div className={styles.icon} aria-hidden="true">{item.icon}</div>
              <div className={styles.content}>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.subtitle}>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
