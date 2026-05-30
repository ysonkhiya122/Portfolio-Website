import { render, screen } from '@testing-library/react'
import Experience from '@/components/Experience/Experience'

describe('Experience', () => {
  it('renders the section heading', () => {
    render(<Experience />)
    expect(screen.getByRole('heading', { name: /experience/i })).toBeInTheDocument()
  })

  it('renders both experience entries', () => {
    render(<Experience />)
    expect(screen.getByText('Senior Software Engineer — Frontend')).toBeInTheDocument()
    expect(screen.getByText('Associate Software Engineer — React Developer')).toBeInTheDocument()
  })

  it('renders the promotion badge on the senior role', () => {
    render(<Experience />)
    expect(screen.getByText(/Promoted/i)).toBeInTheDocument()
  })

  it('renders at least one bullet point per role', () => {
    render(<Experience />)
    const bullets = document.querySelectorAll('li')
    expect(bullets.length).toBeGreaterThan(0)
  })
})
