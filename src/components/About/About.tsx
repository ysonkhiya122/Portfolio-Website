import { useReveal } from '@/hooks/useReveal'
import AnimatedCounter from '@/components/AnimatedCounter/AnimatedCounter'
import { aboutMetrics } from '@/data/portfolio'
import styles from './About.module.scss'

const TAGS = [
  'React 16–19', 'TypeScript', 'Redux Toolkit', 'SignalR',
  'Auth0 / Entra SSO', 'Azure DevOps', 'Jest', 'GenAI workflows',
]

export default function About() {
  const sectionRef = useReveal()

  return (
    <section
      id="about"
      className={`section-base ${styles.about}`}
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-header__index">01</span>
          <h2 className="section-header__title">About</h2>
        </div>

        <div className={styles.grid}>
          <div className={`reveal ${styles.prose}`}>
            <p>
              I'm a frontend engineer focused on building reliable, scalable interfaces that serve
              real users at production scale. At a global IT consultancy I'm embedded within a team
              delivering mission-critical web applications for a major European enterprise client —
              seven countries, live operations, real stakes.
            </p>
            <p>
              My practice spans React architecture, TypeScript engineering, real-time data systems,
              and the integration of AI-assisted development workflows that have measurably reduced
              delivery timelines and incident rates across sprint cycles.
            </p>
            <p>
              I operate as sole frontend contributor on high-stakes builds — from designing UX
              flows and component libraries to guiding backend API contracts for production scale.
              That end-to-end ownership shapes how I think about both the craft and the code.
            </p>
            <div className={styles.tags}>
              {TAGS.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className={`reveal ${styles.metricsCol}`} style={{ transitionDelay: '0.12s' }}>
            <p className={styles.metricsLabel}>Impact at a glance</p>
            <div className={styles.metrics}>
              {aboutMetrics.map((m) => (
                <div key={m.label} className={styles.metric}>
                  <span className={styles.metricValue}>
                    <AnimatedCounter value={m.value} suffix={m.suffix} duration={1400} />
                  </span>
                  <span className={styles.metricLabel}>{m.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutIndex}>›</span>
              <p className={styles.calloutText}>
                Presented an AI-assisted engineering workflow to senior leadership and business
                stakeholders as an innovation initiative — not an experiment, a delivery framework.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
