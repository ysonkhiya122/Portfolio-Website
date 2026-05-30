import { experience, projects, skillGroups, achievements, education, contactLinks } from '@/data/portfolio'

describe('portfolio data integrity', () => {
  it('has at least 2 experience entries', () => {
    expect(experience.length).toBeGreaterThanOrEqual(2)
  })

  it('each experience entry has required fields', () => {
    experience.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.role).toBeTruthy()
      expect(item.bullets.length).toBeGreaterThan(0)
    })
  })

  it('has at least one featured project', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThanOrEqual(1)
  })

  it('each project has at least one tag', () => {
    projects.forEach((p) => {
      expect(p.tags.length).toBeGreaterThan(0)
    })
  })

  it('has 6 skill groups', () => {
    expect(skillGroups.length).toBe(6)
  })

  it('has at least 5 achievements', () => {
    expect(achievements.length).toBeGreaterThanOrEqual(5)
  })

  it('has 2 education entries', () => {
    expect(education.length).toBe(2)
  })

  it('contact links include email and linkedin', () => {
    const ids = contactLinks.map((c) => c.id)
    expect(ids).toContain('email')
    expect(ids).toContain('linkedin')
  })
})
