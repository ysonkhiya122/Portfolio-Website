import { site } from '@/content/site'
import { content } from '@/content'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import { sectionEyebrow } from '@/content/sections'
import ContactForm from './ContactForm'
import styles from './Contact.module.scss'

const channels = [
  { id: 'email', label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/yash-sonkhiya', href: site.links.linkedin },
  { id: 'github', label: 'GitHub', value: '@ysonkhiya122', href: site.links.github },
]

export default function Contact() {
  return (
    <Section
      id="contact"
      eyebrow={sectionEyebrow('contact')}
      title="Hiring for something where the frontend actually matters?"
    >
      <div className={styles.layout}>
        <Reveal className={styles.left}>
          <p className={styles.body}>
            I am open to senior frontend roles and to short, well-scoped contracts. Tell me
            what the product does and what is currently breaking, and I will tell you honestly
            whether I am the right person.
          </p>

          <ul className={styles.channels}>
            {channels.map((channel) => (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  className={styles.channel}
                  {...(channel.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span className={styles.channelLabel}>{channel.label}</span>
                  <span className={styles.channelValue}>{channel.value}</span>
                  <span className={styles.channelArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <dl className={styles.facts}>
            <div>
              <dt>Response time</dt>
              <dd>Within one working day</dd>
            </div>
            <div>
              <dt>Timezone</dt>
              <dd>IST · overlaps EU and UK mornings</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                {site.location.city}, {site.location.country}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal order={1} className={styles.right}>
          <ContactForm />
        </Reveal>
      </div>

      {content.faqs.length > 0 && (
        <Reveal as="div" order={2} className={styles.faqs} aria-labelledby="faq-title">
          <h3 id="faq-title" className={styles.faqTitle}>
            Questions people actually ask
          </h3>
          <div className={styles.faqGrid}>
            {content.faqs.map((faq) => (
              <details key={faq.question} className={styles.faq}>
                <summary className={styles.faqQuestion}>
                  {faq.question}
                  <span className={styles.faqMarker} aria-hidden="true" />
                </summary>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      )}
    </Section>
  )
}
