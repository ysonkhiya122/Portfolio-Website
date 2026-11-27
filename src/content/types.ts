import type { z } from 'zod'
import type {
  achievementSchema,
  contentSchema,
  experienceSchema,
  faqSchema,
  projectSchema,
  skillGroupSchema,
  testimonialSchema,
} from './schema'

/**
 * Component-facing types are inferred from the same schemas that
 * validate the data, so a component can never drift from the contract
 * the content gate enforces. These are `import type` only — nothing
 * from Zod reaches the browser bundle.
 */
export type Project = z.infer<typeof projectSchema>
export type Experience = z.infer<typeof experienceSchema>
export type SkillGroup = z.infer<typeof skillGroupSchema>
export type Skill = SkillGroup['skills'][number]
export type Achievement = z.infer<typeof achievementSchema>
export type Faq = z.infer<typeof faqSchema>
export type Testimonial = z.infer<typeof testimonialSchema>
export type SiteContent = z.infer<typeof contentSchema>
export type ProjectLink = Project['links'][number]
export type ImpactMetric = Project['impact'][number]
