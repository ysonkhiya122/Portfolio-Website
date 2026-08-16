import { render, screen } from '@testing-library/react'
import Emphasis from '@/components/Emphasis/Emphasis'

describe('Emphasis', () => {
  it('renders **bold** markers as <strong> elements', () => {
    render(<Emphasis text="shipped a **real-time platform** to production" />)
    const strong = screen.getByText('real-time platform')
    expect(strong.tagName).toBe('STRONG')
  })

  it('renders plain text unchanged', () => {
    render(<Emphasis text="no markers here" />)
    expect(screen.getByText('no markers here')).toBeInTheDocument()
  })

  it('handles multiple bold segments', () => {
    render(<Emphasis text="**one** and **two**" />)
    expect(screen.getByText('one').tagName).toBe('STRONG')
    expect(screen.getByText('two').tagName).toBe('STRONG')
  })

  it('does not interpret HTML — no injection possible', () => {
    const { container } = render(
      <Emphasis text={'<img src=x onerror=alert(1)> **safe**'} />
    )
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>')
  })
})
