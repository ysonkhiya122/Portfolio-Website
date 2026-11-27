import type { SiteContent } from './types'
import {
  achievements,
  about,
  education,
  experience,
  faqs,
  heroStats,
  projects,
  skillGroups,
  testimonials,
} from './portfolio'

/**
 * Content, assembled once.
 *
 * Validation deliberately lives outside this module — see
 * `src/content/validate.ts`, invoked from `main.tsx` in development
 * only. Keeping `import.meta` out of here means the content module
 * stays plain CommonJS-transformable for Jest, and the validator is
 * tree-shaken out of production entirely.
 */
const raw = {
  heroStats,
  projects,
  experience,
  skillGroups,
  achievements,
  education,
  testimonials,
  faqs,
}

export { about }
export type {
  Achievement,
  Experience,
  Faq,
  Project,
  SkillGroup,
  SiteContent,
  Testimonial,
} from './types'

/** Typed through the schema so components and validation cannot drift. */
export const content = raw as unknown as SiteContent
