/**
 * Downloadable artefacts.
 *
 * The command palette used to link to `/yash-sonkhiya-cv.pdf` with no
 * guarantee the file existed — a link to a 404 is worse than no link.
 * Commands are now generated from this registry, and a CI check asserts
 * that every href resolves to a real file in `public/`.
 */

export interface Asset {
  id: string
  label: string
  href: string
  description: string
  /** Palette command group. */
  group: 'Downloads' | 'Elsewhere'
}

export const assets: Asset[] = [
  {
    id: 'cv',
    label: 'Download CV (PDF)',
    href: '/yash-sonkhiya-cv.pdf',
    description: 'One page, generated from the content on this site.',
    group: 'Downloads',
  },
  {
    id: 'og',
    label: 'Download social card',
    href: '/og-image.png',
    description: 'The image used when this site is shared.',
    group: 'Downloads',
  },
]
