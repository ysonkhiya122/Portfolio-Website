/**
 * Case-study routing helpers.
 *
 * The site is a single page, so "routing" is the URL hash:
 *
 *   #work            → the work section, no dialog
 *   #work/apexon     → the work section with the ApexOn case study open
 *
 * Why the hash and not the History API alone: a hash survives a static
 * host, needs no server rewrite, is shareable, and — importantly —
 * lets the dialog open on a cold load, which `pushState` alone does not.
 */

const CASE_STUDY_PREFIX = '#work/'

export function caseStudyIdFromHash(hash: string): string | null {
  if (!hash.startsWith(CASE_STUDY_PREFIX)) return null
  const id = hash.slice(CASE_STUDY_PREFIX.length).trim()
  // Guard against `#work/` with nothing after it, and any nesting.
  return id.length > 0 && !id.includes('/') ? decodeURIComponent(id) : null
}

export function caseStudyHref(id: string): string {
  return `${CASE_STUDY_PREFIX}${encodeURIComponent(id)}`
}

/** Opens a case study as a new history entry, so Back closes it. */
export function pushCaseStudy(id: string): void {
  history.pushState({ caseStudy: id }, '', caseStudyHref(id))
}

/** Closes the dialog and restores the work-section hash. */
export function replaceWithWork(): void {
  history.replaceState(null, '', '#work')
}
