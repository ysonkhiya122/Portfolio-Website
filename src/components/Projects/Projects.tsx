import { useReveal } from '@/hooks/useReveal'
import { projects } from '@/data/portfolio'
import type { Project } from '@/types'
import styles from './Projects.module.scss'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className={`reveal ${styles.card} ${project.featured ? styles.featured : ''}`}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      <p className={styles.number}>{project.number}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.subtitle}>{project.subtitle}</p>
      <p className={styles.desc}>{project.description}</p>

      <div className={styles.tags}>
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className={styles.footer}>
        {project.links.length > 0 ? (
          <div className={styles.links}>
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {link.label}
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        ) : project.note ? (
          <span className={styles.note}>{project.note}</span>
        ) : null}
      </div>
    </article>
  )
}

export default function Projects() {
  const sectionRef = useReveal()

  return (
    <section
      id="projects"
      className={`section-base ${styles.projects}`}
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-header__index">03</span>
          <h2 className="section-header__title">Projects</h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
