import { z } from 'zod'

/**
 * Runtime-validated content contracts.
 *
 * Why Zod when TypeScript already checks the data at compile time:
 * content is the one part of this site that changes without touching
 * component code. A typo in a case-study metric, a missing alt text or
 * a dead link should fail loudly in CI, not silently ship. `.strict()`
 * also means a stale field can never linger unnoticed in the data file.
 */

const isoDate = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM format')

export const impactMetricSchema = z.strictObject({
  value: z.string().min(1, 'Metric needs a value'),
  label: z.string().min(3),
  /** Where the number comes from — recruiters ask. Shown on hover. */
  source: z.string().min(3),
})

export const statSchema = z.strictObject({
  value: z.number().nonnegative(),
  suffix: z.string(),
  prefix: z.string().optional(),
  label: z.string().min(2),
})

export const projectLinkSchema = z.strictObject({
  label: z.string().min(1),
  href: z.url('Project links must be absolute URLs'),
  kind: z.enum(['live', 'code', 'case-study', 'docs']),
})

export const projectSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Use kebab-case ids — they become URL slugs'),
  name: z.string().min(2),
  /** One line a recruiter can repeat to their hiring manager. */
  headline: z.string().min(10).max(90),
  role: z.string().min(3),
  timeframe: z.string().min(4),
  status: z.enum(['live', 'internal', 'archived']),
  /** The problem, in the user's words. */
  context: z.string().min(40),
  /** Technical decisions and their trade-offs. This is the differentiator. */
  decisions: z.array(z.string().min(20)).min(1),
  impact: z.array(impactMetricSchema).min(1),
  stack: z.array(z.string().min(1)).min(2),
  links: z.array(projectLinkSchema).default([]),
  notes: z.string().optional(),
})

export const experienceSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  role: z.string().min(3),
  company: z.string().min(2),
  location: z.string().min(2),
  /** YYYY-MM — rendered and sorted from this, never from a hardcoded string. */
  start: isoDate,
  end: isoDate.nullable(),
  employment: z.enum(['full-time', 'contract', 'freelance']),
  summary: z.string().min(30),
  highlights: z.array(z.string().min(20)).min(1),
  stack: z.array(z.string()).min(1),
  /** Promotions render as a nested marker on the timeline. */
  promotion: z.object({ title: z.string().min(3), date: isoDate }).optional(),
})

export const skillSchema = z.strictObject({
  name: z.string().min(1),
  /** Beginner claims that can't survive an interview are worse than silence. */
  level: z.enum(['expert', 'proficient', 'working']),
  years: z.number().min(0).max(40).optional(),
})

export const skillGroupSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  skills: z.array(skillSchema).min(1),
})

export const achievementSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5),
  issuer: z.string().min(2),
  date: isoDate,
  /** Only include a link if it can be verified by a stranger. */
  href: z.url().optional(),
})

export const educationSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  qualification: z.string().min(4),
  institution: z.string().min(4),
  location: z.string().min(2),
  start: z.string().regex(/^\d{4}$/),
  end: z.string().regex(/^\d{4}$/),
})

export const testimonialSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  quote: z.string().min(60),
  author: z.string().min(3),
  title: z.string().min(3),
  /** Never ship a testimonial without permission recorded. */
  permissionGranted: z.literal(true),
})

export const faqSchema = z.strictObject({
  question: z.string().min(8),
  answer: z.string().min(30),
})

export const aboutSchema = z.strictObject({
  // `{YEARS}` is interpolated from the employment dates at render time, so
  // it is allowed here but never counted as a hardcoded duration.
  opener: z.string().min(40),
  paragraphs: z.array(z.string().min(40)).min(1),
  principles: z.array(z.object({ title: z.string().min(3), body: z.string().min(20) })).min(1),
})

export const contentSchema = z.strictObject({
  about: aboutSchema,
  heroStats: z.array(statSchema).length(4),
  projects: z.array(projectSchema).min(2),
  experience: z.array(experienceSchema).min(1),
  skillGroups: z.array(skillGroupSchema).min(1),
  achievements: z.array(achievementSchema).min(1),
  education: z.array(educationSchema).min(1),
  testimonials: z.array(testimonialSchema).default([]),
  faqs: z.array(faqSchema).min(3),
})

export type ProjectInput = z.input<typeof projectSchema>
