import { useReveal } from "@/hooks/useReveal";
import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";
import Emphasis from "@/components/Emphasis/Emphasis";
import styles from "./Experience.module.scss";

export default function Experience() {
  const sectionRef = useReveal();

  return (
    <section
      id="experience"
      className={`section-base ${styles.experience}`}
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-header__index">02</span>
          <h2 className="section-header__title">Experience</h2>
        </div>

        <div className={styles.timeline}>
          {/* Vertical track */}
          <div className={styles.track} aria-hidden="true">
            <motion.div
              className={styles.trackFill}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>

          <div className={styles.items}>
            {experience.map((item, i) => (
              <article
                key={item.id}
                className={`reveal ${styles.item}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.role}>{item.role}</h3>
                      <div className={styles.meta}>
                        <span className={styles.company}>{item.company}</span>
                        <span className={styles.sep}>·</span>
                        <span className={styles.location}>{item.location}</span>
                        <span className={styles.sep}>·</span>
                        <span className={styles.period}>{item.period}</span>
                      </div>
                    </div>
                    <span
                      className={`${styles.badge} ${styles[`badge--${item.badgeVariant}`]}`}
                    >
                      {item.badgeLabel}
                    </span>
                  </div>

                  <p className={styles.summary}>{item.summary}</p>

                  <ul className={styles.bullets}>
                    {item.bullets.map((bullet, j) => (
                      <li key={j}>
                        <Emphasis text={bullet} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
