import { site } from '@/content/site'
import Section from '@/components/ui/Section'
import { sectionEyebrow } from '@/content/sections'
import styles from './Context.module.scss'

/**
 * "How to read this site" — an unusual section for a portfolio, and a
 * deliberate one.
 *
 * A senior reader's real question is not "is this impressive" but "is
 * this true". Stating up front what is verified, what is approximated,
 * and why some employer detail is generalised answers that before they
 * have to ask. It also makes the metrics elsewhere on the page more
 * credible, not less — a claim you qualify is a claim you inspected.
 */
export default function Context() {
  const items = [
    {
      label: 'Verified',
      tone: 'live',
      body: 'Employer, role titles, promotion date and certifications are accurate and can be checked with a reference.',
    },
    {
      label: 'Measured',
      tone: 'accent',
      body: 'User volumes, market counts and delivery timelines come from production analytics and release records. Each metric names its source.',
    },
    {
      label: 'Attributed',
      tone: 'info',
      body: 'Where a number depends on a team effort, it says so. The React 16→19 migration was my work; the platform around it was not.',
    },
    {
      label: 'Generalised',
      tone: 'muted',
      body: `Client names and internal system identifiers are described by domain rather than by name, per my employment agreement. ${site.employer.clientDescriptor} is as specific as I can be in public.`,
    },
  ] as const

  return (
    <Section
      id="context"
      eyebrow={sectionEyebrow('context')}
      title="What is checked, what is estimated, what is omitted."
      description="Most portfolios ask you to take everything on trust. This one labels its claims so you can tell the difference."
    >
      <dl className={styles.grid}>
        {items.map((item) => (
          <div key={item.label} className={styles.item}>
            <dt className={styles.label}>
              <span className={styles.dot} data-tone={item.tone} aria-hidden="true" />
              {item.label}
            </dt>
            <dd className={styles.body}>{item.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
