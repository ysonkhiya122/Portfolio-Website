import { contentSchema } from './schema'
import {
  achievements,
  education,
  experience,
  faqs,
  heroStats,
  projects,
  skillGroups,
  testimonials,
} from './portfolio'

const payload = {
  heroStats,
  projects,
  experience,
  skillGroups,
  achievements,
  education,
  testimonials,
  faqs,
}

describe('portfolio content', () => {
  it('satisfies the content schema', () => {
    const result = contentSchema.safeParse(payload)
    if (!result.success) {
      // Surface the exact failing path instead of a wall of JSON.
      throw new Error(
        result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('\n'),
      )
    }
    expect(result.success).toBe(true)
  })

  it('ships exactly four hero stats so the grid never reflows', () => {
    expect(heroStats).toHaveLength(4)
  })

  it('gives every impact metric a source', () => {
    for (const project of projects) {
      for (const metric of project.impact) {
        expect(metric.source.length).toBeGreaterThan(2)
      }
    }
  })

  it('keeps experience in reverse-chronological order', () => {
    const starts = experience.map((entry) => entry.start)
    const sorted = [...starts].sort().reverse()
    expect(starts).toEqual(sorted)
  })

  it('has a single open-ended role at most, and it is the newest', () => {
    const open = experience.filter((entry) => entry.end === null)
    expect(open.length).toBeLessThanOrEqual(1)
    if (open.length === 1) {
      expect(open[0]).toBe(experience[0])
    }
  })

  it('never claims a live link on an internal project', () => {
    for (const project of projects) {
      if (project.status !== 'internal') continue
      const links: readonly { kind: string }[] = project.links
      expect(links.some((link) => link.kind === 'live')).toBe(false)
    }
  })

  it('uses unique ids across collections', () => {
    const ids = [
      ...projects.map((p) => p.id),
      ...experience.map((e) => e.id),
      ...achievements.map((a) => a.id),
      ...education.map((e) => e.id),
    ]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('rejects a malformed metric at the schema boundary', () => {
    const broken = {
      ...payload,
      projects: [
        {
          ...projects[0],
          impact: [{ value: '10x', label: 'made up' }], // missing `source`
        },
      ],
    }
    expect(contentSchema.safeParse(broken).success).toBe(false)
  })

  it('rejects an unknown field rather than silently dropping it', () => {
    const withTypo = { ...payload, heroStats: [{ ...heroStats[0], sufifx: '%' }] }
    expect(
      contentSchema.safeParse({
        ...withTypo,
        heroStats: [
          heroStats[0],
          heroStats[1],
          heroStats[2],
          { ...heroStats[3], siffix: 'x' },
        ],
      }).success,
    ).toBe(false)
  })
})
