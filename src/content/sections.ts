/**
 * The page's section order, in one place.
 *
 * Section numbers used to be hardcoded in each component's eyebrow and in
 * the command palette's jump-to list. Both had already drifted. Every
 * number is now derived from this array, so adding, removing or reordering
 * a section is a one-line change that cannot desync the page from the
 * palette.
 *
 * The list must stay in the order the components appear in App.tsx —
 * `notes` is included because it is a numbered chapter between Work and
 * Experience, and skipping it produced a section order that jumped
 * 02 → 04 with no 03.
 */
export const sectionOrder = [
  'about',
  'work',
  'notes',
  'experience',
  'skills',
  'recognition',
  'contact',
] as const

export type SectionId = (typeof sectionOrder)[number]

export const sectionMeta: Record<SectionId, { label: string }> = {
  about: { label: 'About' },
  work: { label: 'Selected work' },
  notes: { label: 'Notes' },
  experience: { label: 'Experience' },
  skills: { label: 'Toolkit' },
  recognition: { label: 'Recognition' },
  contact: { label: 'Contact' },
}

/** "01" — the zero-padded position of a section. */
export function sectionNumber(id: SectionId): string {
  return String(sectionOrder.indexOf(id) + 1).padStart(2, '0')
}

/** "02 / Selected work" */
export function sectionEyebrow(id: SectionId): string {
  return `${sectionNumber(id)} / ${sectionMeta[id].label}`
}
