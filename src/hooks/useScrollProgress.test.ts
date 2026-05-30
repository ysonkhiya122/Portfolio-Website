import { renderHook, act } from '@testing-library/react'
import { useScrollProgress } from '@/hooks/useScrollProgress'

describe('useScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    })
  })

  it('returns 0 on initial render', () => {
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0)
  })

  it('calculates progress percentage on scroll', () => {
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 600 })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBeGreaterThan(0)
    expect(result.current).toBeLessThanOrEqual(100)
  })
})
