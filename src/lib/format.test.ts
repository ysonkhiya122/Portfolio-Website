import { formatDuration, formatMonth, formatRange, monthsBetween } from './format'

describe('formatMonth', () => {
  it('renders YYYY-MM as a short month and year', () => {
    expect(formatMonth('2025-08')).toBe('Aug 2025')
    expect(formatMonth('2024-01')).toBe('Jan 2024')
    expect(formatMonth('2023-12')).toBe('Dec 2023')
  })
})

describe('formatRange', () => {
  it('uses "Present" for an open-ended role', () => {
    expect(formatRange('2025-08', null)).toBe('Aug 2025 — Present')
  })

  it('renders both ends when closed', () => {
    expect(formatRange('2023-08', '2025-07')).toBe('Aug 2023 — Jul 2025')
  })
})

describe('monthsBetween', () => {
  it('counts inclusive months across a year boundary', () => {
    expect(monthsBetween('2023-08', '2025-07')).toBe(23)
  })

  it('never returns a negative duration for reversed input', () => {
    expect(monthsBetween('2025-07', '2023-08')).toBe(0)
  })
})

describe('formatDuration', () => {
  it('formats whole years without a stray month count', () => {
    expect(formatDuration('2023-08', '2025-08')).toBe('2 yr')
  })

  it('formats years and months', () => {
    expect(formatDuration('2023-08', '2025-07')).toBe('1 yr 11 mo')
  })

  it('formats sub-year durations in months', () => {
    expect(formatDuration('2025-01', '2025-05')).toBe('4 mo')
  })
})
