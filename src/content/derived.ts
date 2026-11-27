/**
 * Facts derived from the content's own dates.
 *
 * The original site claimed "promoted to senior in 18 months" while its
 * employment dates spanned 23. The first fix derived durations inside the
 * Experience component, but the same claim was also written by hand in
 * the hero lede and the About prose — so the site still contradicted
 * itself in three places, two of them prose.
 *
 * Anything a reader could check against the dates now comes from here.
 * Components never type a duration, and the content gate asserts that no
 * prose paragraph hardcodes one.
 */
import { experience } from './portfolio'

const MONTHS_SHORT = ['mo', 'yr'] as const

function toMonths(iso: string): number {
  const [year = 0, month = 1] = iso.split('-').map(Number)
  return year * 12 + (month - 1)
}

function nowMonths(): number {
  const now = new Date()
  return now.getFullYear() * 12 + now.getMonth()
}

/** The current role, which is the one with no end date. */
const currentRole = experience.find((role) => role.end === null)

/** Months from joining to the promotion, measured from the promotion date. */
export function monthsToPromotion(): number | null {
  const first: (typeof experience)[number] = experience[0]
  const earliest = experience.reduce<(typeof experience)[number]>(
    (oldest, role) => (role.start < oldest.start ? role : oldest),
    first,
  )
  // `promotion` is optional per-entry, so narrow before reading it.
  const withPromotion = experience.find(
    (
      role,
    ): role is (typeof experience)[number] & { promotion: { title: string; date: string } } =>
      'promotion' in role,
  )
  if (!withPromotion) return null
  return Math.max(0, toMonths(withPromotion.promotion.date) - toMonths(earliest.start))
}

/** Whole years of professional experience, rounded down. */
export function yearsOfExperience(): number {
  const start = experience.reduce<string>(
    (oldest, role) => (role.start < oldest ? role.start : oldest),
    experience[0].start,
  )
  const end = currentRole === undefined ? toMonths(experience[0].start) : nowMonths()
  return Math.floor((end - toMonths(start)) / 12)
}

/** "18 months" — the figure used in prose. */
export function promotionPhrase(): string {
  const months = monthsToPromotion()
  if (months === null) return 'promoted internally'
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 0) return `${months} months`
  if (rest === 0) return `${years} ${years === 1 ? 'year' : 'years'}`
  return `${years} ${years === 1 ? 'year' : 'years'} ${rest} months`
}

/** "three years" — spelled out, for prose that reads better as words. */
export function tenurePhrase(): string {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
  const years = yearsOfExperience()
  return words[years] ?? String(years)
}

export { MONTHS_SHORT }
