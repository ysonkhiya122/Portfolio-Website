import { useReveal } from '@/hooks/useReveal'
import { contactLinks } from '@/data/portfolio'
import styles from './Contact.module.scss'

export default function Contact() {
  const sectionRef = useReveal()

  return (
    <section
      id="contact"
      className={`section-base ${styles.contact}`}
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className={`reveal ${styles.inner}`}>
          <div className={styles.left}>
            <h2 className={styles.heading}>
              Let's build<br />something together.
            </h2>
            <p className={styles.sub}>
              Open to senior frontend engineering roles, freelance contracts, and
              technical collaborations. I typically respond within 24 hours.
            </p>
            <a
              href="mailto:yashsonkhiya2195@gmail.com"
              className="btn-primary"
            >
              Send an email ↗
            </a>
          </div>

          <div className={styles.right}>
            <div className={styles.links}>
              {contactLinks.map((link) =>
                link.href ? (
                  <a
                    key={link.id}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={styles.link}
                  >
                    <div className={styles.linkLeft}>
                      <span className={styles.linkIcon} aria-hidden="true">
                        {link.icon}
                      </span>
                      <div>
                        <p className={styles.linkLabel}>{link.label}</p>
                        <p className={styles.linkValue}>{link.value}</p>
                      </div>
                    </div>
                    <span className={styles.linkArrow} aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <div key={link.id} className={`${styles.link} ${styles.linkStatic}`}>
                    <div className={styles.linkLeft}>
                      <span className={styles.linkIcon} aria-hidden="true">
                        {link.icon}
                      </span>
                      <div>
                        <p className={styles.linkLabel}>{link.label}</p>
                        <p className={styles.linkValue}>{link.value}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
