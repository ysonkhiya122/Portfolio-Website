/**
 * The page's section order, in one place.
 *
 * Section numbers used to be hardcoded in each component's eyebrow
 * ("03 / Experience"). Inserting a section meant renumbering the rest by
 * hand, and they had already drifted out of order. The number is now
 * derived from this list, so ordering is a one-line change.
 *
 * `notes` is deliberately absent from the numbering: it is a card grid
 * whose items link out, and numbering it would imply it is one of the
 * narrative chapters.
 */
export const sectionOrder = [
  'context',
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
  context: { label: 'How to read this' },
  about: { label: 'About' },
  work: { label: 'Selected work' },
  notes: { label: 'Notes' },
  experience: { label: 'Experience' },
  skills: { label: 'Toolkit' },
  recognition: { label: 'Recognition' },
  contact: { label: 'Contact' },
}

/** "02 / Selected work" */
export function sectionEyebrow(id: SectionId): string {
  const index = sectionOrder.indexOf(id)
  const number = String(index + 1).padStart(2, '0')
  return `${number} / ${sectionMeta[id].label}`
}
