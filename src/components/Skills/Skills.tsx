import { useReveal } from '@/hooks/useReveal'
import { skillGroups } from '@/data/portfolio'
import SkillSphere from '@/components/SkillSphere/SkillSphere'
import styles from './Skills.module.scss'

export default function Skills() {
  const sectionRef = useReveal()

  return (
    <section
      id="skills"
      className={`section-base ${styles.skills}`}
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-header__index">04</span>
          <h2 className="section-header__title">Technical skills</h2>
        </div>

        <div className={styles.layout}>
          {/* Left — grouped list */}
          <div className={styles.groups}>
            {skillGroups.map((group, i) => (
              <div
                key={group.id}
                className={`reveal ${styles.group}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <p className={styles.groupTitle}>{group.title}</p>
                <ul className={styles.list}>
                  {group.skills.map((skill) => (
                    <li key={skill} className={styles.item}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right — 3D sphere */}
          <div className={`reveal ${styles.sphereWrapper}`}>
            <SkillSphere />
          </div>
        </div>
      </div>
    </section>
  )
}
