import { experience } from './portfolio'
import { monthsToPromotion, promotionPhrase, tenurePhrase, yearsOfExperience } from './derived'

/**
 * These exist because the site shipped a fixed "18 months" while its own
 * employment dates spanned 23. The number appeared in three places, two of
 * them prose, and only the Experience component was derived.
 */
describe('derived facts', () => {
  const earliest = [...experience].sort((a, b) => a.start.localeCompare(b.start))[0]!
  const promoted = experience.find(
    (
      role,
    ): role is (typeof experience)[number] & { promotion: { title: string; date: string } } =>
      'promotion' in role,
  )

  it('computes the promotion gap from the dates, not from copy', () => {
    expect(promoted).toBeDefined()
    if (!promoted) return

    const startYear = Number(earliest.start.slice(0, 4))
    const startMonth = Number(earliest.start.slice(5, 7))
    const promotedYear = Number(promoted.promotion.date.slice(0, 4))
    const promotedMonth = Number(promoted.promotion.date.slice(5, 7))
    const expected = (promotedYear - startYear) * 12 + (promotedMonth - startMonth)

    expect(monthsToPromotion()).toBe(expected)
  })

  it('reports a promotion gap that matches the dates it is derived from', () => {
    const months = monthsToPromotion()
    expect(months).not.toBeNull()
    // Guards the specific defect: the site said 18 while the dates said 23.
    expect(months).toBeGreaterThanOrEqual(12)
    expect(months).toBeLessThanOrEqual(60)
  })

  it('phrases the gap in months or years, never a stale constant', () => {
    const phrase = promotionPhrase()
    expect(phrase).toMatch(/^\d+ (month|months|year|years)/)
    expect(phrase).not.toBe('18 months')
  })

  it('derives years of experience from the earliest start date', () => {
    const years = yearsOfExperience()
    expect(years).toBeGreaterThanOrEqual(1)
    expect(years).toBeLessThanOrEqual(40)
  })

  it('spells tenure out in words for prose', () => {
    expect(tenurePhrase()).toMatch(/^[a-z]+$/)
  })
})
