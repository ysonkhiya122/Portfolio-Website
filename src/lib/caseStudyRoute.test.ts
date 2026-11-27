import { caseStudyHref, caseStudyIdFromHash } from './caseStudyRoute'

describe('caseStudyIdFromHash', () => {
  it('reads a case study id out of the hash', () => {
    expect(caseStudyIdFromHash('#work/apexon')).toBe('apexon')
    expect(caseStudyIdFromHash('#work/asset-portal')).toBe('asset-portal')
  })

  it('returns null for the bare work section', () => {
    expect(caseStudyIdFromHash('#work')).toBeNull()
  })

  it('returns null for a trailing slash with no id', () => {
    expect(caseStudyIdFromHash('#work/')).toBeNull()
  })

  it('returns null for unrelated hashes', () => {
    expect(caseStudyIdFromHash('#about')).toBeNull()
    expect(caseStudyIdFromHash('')).toBeNull()
  })

  it('rejects nested paths rather than guessing', () => {
    expect(caseStudyIdFromHash('#work/apexon/extra')).toBeNull()
  })

  it('decodes URI-encoded ids', () => {
    expect(caseStudyIdFromHash('#work/some%20id')).toBe('some id')
  })
})

describe('caseStudyHref', () => {
  it('builds a shareable hash link', () => {
    expect(caseStudyHref('apexon')).toBe('#work/apexon')
  })

  it('round-trips with the parser', () => {
    expect(caseStudyIdFromHash(caseStudyHref('asset-portal'))).toBe('asset-portal')
  })
})
