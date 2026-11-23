import { site } from '@/content/site'
import { promotionPhrase } from '@/content/derived'
import { heroStats } from '@/content/portfolio'
import styles from './Hero.module.scss'

function ArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M3.5 9.5 9.5 3.5M9.5 3.5H4.6M9.5 3.5v4.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Hero() {
  const scrollTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(id)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Keep the URL and the focus ring honest for keyboard users.
    history.replaceState(null, '', id)
    ;(target as HTMLElement).focus({ preventScroll: true })
  }

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <p className={styles.eyebrow}>
            <span className={styles.statusDot} aria-hidden="true" />
            {site.availability.status}
            <span className={styles.sep} aria-hidden="true">
              /
            </span>
            <span className={styles.loc}>{site.location.city}, IN · remote-friendly</span>
          </p>
        </div>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.titleName}>{site.name}</span>
          <span className={styles.titleRole}>
            {site.roleLong}
            <span className={styles.cursor} aria-hidden="true">
              _
            </span>
          </span>
        </h1>

        <p className={styles.lede}>
          I build the interfaces people depend on when downtime is not an option: real-time
          dispatch for <strong>seven European markets</strong>, enterprise dashboards, and
          internal tools that replace a spreadsheet nobody trusts.
          <span className={styles.ledeSub}>
            {' '}
            Promoted to senior within {promotionPhrase()} of joining. Currently taking the
            frontend of{' '}
            {heroStats.find((stat) => stat.label === 'Apps owned in prod')?.value ?? 'four'}{' '}
            production applications from React 16 to 19 without a single regression.
          </span>
        </p>

        <div className={styles.actions}>
          <a href="#work" className="btn btn--primary" onClick={scrollTo('#work')}>
            View case studies
          </a>
          <a href="#contact" className="btn btn--ghost" onClick={scrollTo('#contact')}>
            Get in touch
          </a>
          <a
            href={site.links.github}
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <ArrowUpRight />
          </a>
        </div>

        <dl className={styles.stats}>
          {heroStats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>
                {stat.value}
                <span className={styles.statSuffix}>{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <a href="#about" className={styles.scrollCue} onClick={scrollTo('#about')}>
        <span className="sr-only">Scroll to the about section</span>
        <span className={styles.scrollCueLabel} aria-hidden="true">
          scroll
        </span>
        <span className={styles.scrollCueLine} aria-hidden="true" />
      </a>
    </section>
  )
}
