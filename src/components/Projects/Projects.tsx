import { useState } from 'react'
import { content } from '@/content'
import type { Project } from '@/content'
import { useReveal } from '@/hooks/useReveal'
import Reveal from '@/components/ui/Reveal'
import CaseStudyDialog from '@/components/CaseStudyDialog/CaseStudyDialog'
import styles from './Projects.module.scss'

const STATUS_LABEL: Record<Project['status'], string> = {
  live: 'Live',
  internal: 'In production',
  archived: 'Archived',
}

const LINK_LABEL: Record<string, string> = {
  live: 'Live',
  code: 'Code',
  docs: 'Docs',
  'case-study': 'Case study',
}

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 9 9 3M9 3H4M9 3v5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectCard({
  project,
  order,
  onOpen,
}: {
  project: Project
  order: number
  onOpen: () => void
}) {
  const externalLinks = project.links.filter((link) => link.kind !== 'case-study')

  return (
    <Reveal as="article" order={order} className={styles.card}>
      <div className={styles.cardTop}>
        <span className={`chip ${project.status === 'live' ? 'chip--live' : ''}`}>
          {project.status === 'live' && <span className={styles.liveDot} aria-hidden="true" />}
          {STATUS_LABEL[project.status]}
        </span>
        <span className={styles.timeframe}>{project.timeframe}</span>
      </div>

      <div className={styles.titleBlock}>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.headline}>{project.headline}</p>
        <p className={styles.role}>{project.role}</p>
      </div>

      <ul className={styles.impact} aria-label={`${project.name} outcomes`}>
        {project.impact.map((metric) => (
          <li key={metric.label} className={styles.impactItem}>
            <span className={styles.impactValue}>{metric.value}</span>
            <span className={styles.impactLabel}>{metric.label}</span>
          </li>
        ))}
      </ul>

      <ul className={styles.stack} aria-label={`${project.name} stack`}>
        {project.stack.map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
      </ul>

      <div className={styles.cardFoot}>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={onOpen}
          aria-haspopup="dialog"
        >
          Read the case study
          <span aria-hidden="true">→</span>
        </button>

        {externalLinks.length > 0 && (
          <span className={styles.external}>
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                {LINK_LABEL[link.kind] ?? link.label}
                <ArrowUpRight />
              </a>
            ))}
          </span>
        )}
      </div>
    </Reveal>
  )
}

export default function Projects() {
  const ref = useReveal<HTMLElement>()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = content.projects.find((project) => project.id === activeId) ?? null

  return (
    <section
      id="work"
      ref={ref}
      className="section section--ruled"
      aria-labelledby="work-title"
    >
      <div className="container">
        <Reveal className={styles.head}>
          <p className="eyebrow">02 / Selected work</p>
          <h2 id="work-title" className="section-title">
            Three systems, and the decisions behind them.
          </h2>
          <p className="lede">
            Feature lists are easy to fake. These are the trade-offs I actually argued for, and
            the numbers that came out of them.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {content.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              order={index}
              onOpen={() => setActiveId(project.id)}
            />
          ))}
        </div>
      </div>

      <CaseStudyDialog project={active} onClose={() => setActiveId(null)} />
    </section>
  )
}
