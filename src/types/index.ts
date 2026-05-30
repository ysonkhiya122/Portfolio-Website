// ─── PORTFOLIO DATA TYPES ───────────────────────────────────────

export interface ExperienceItem {
  id: string
  period: string
  company: string
  location: string
  role: string
  type: 'current' | 'previous'
  badgeLabel: string
  badgeVariant: 'green' | 'blue'
  summary: string
  bullets: string[]
}

export interface Project {
  id: string
  number: string
  label: string
  name: string
  subtitle: string
  description: string
  tags: string[]
  links: ProjectLink[]
  featured?: boolean
  note?: string
}

export interface ProjectLink {
  label: string
  href: string
}

export interface SkillGroup {
  id: string
  title: string
  skills: string[]
}

export interface Achievement {
  id: string
  icon: string
  title: string
  subtitle: string
}

export interface EducationItem {
  id: string
  period: string
  degree: string
  institution: string
  location: string
}

export interface ContactLink {
  id: string
  label: string
  value: string
  href?: string
  icon: string
}
