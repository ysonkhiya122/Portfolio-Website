import { content } from '@/content'
import type { SkillGroup } from '@/content'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import { sectionEyebrow } from '@/content/sections'
import styles from './Skills.module.scss'

const LEVEL_LABEL = {
  expert: 'Expert',
  proficient: 'Proficient',
  working: 'Working knowledge',
} as const

function SkillGroupCard({ group, order }: { group: SkillGroup; order: number }) {
  return (
    <Reveal as="article" order={order} className={styles.group}>
      <h3 className={styles.groupTitle}>{group.title}</h3>
      <ul className={styles.list}>
        {group.skills.map((skill) => (
          <li key={skill.name} className={styles.skill}>
            <span className={styles.skillName}>{skill.name}</span>
            <span
              className={styles.skillLevel}
              data-level={skill.level}
              aria-label={`Proficiency: ${LEVEL_LABEL[skill.level]}`}
            >
              <span className={styles.bars} aria-hidden="true">
                <span data-on={skill.level !== 'working'} />
                <span data-on={skill.level === 'proficient' || skill.level === 'expert'} />
                <span data-on={skill.level === 'expert'} />
              </span>
              <span className={styles.skillYears}>
                {skill.years ? `${skill.years}y` : LEVEL_LABEL[skill.level]}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow={sectionEyebrow('skills')}
      title="What I actually reach for."
      description="Levelled honestly. “Working knowledge” means I have shipped with it and would ask questions before architecting around it — which is more useful to you than a wall of logos."
    >
      <div className={styles.grid}>
        {content.skillGroups.map((group, index) => (
          <SkillGroupCard key={group.id} group={group} order={index} />
        ))}
      </div>
    </Section>
  )
}
