import { render, screen } from '@testing-library/react'
import Projects from '@/components/Projects/Projects'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders the featured RaceIQ project', () => {
    render(<Projects />)
    expect(screen.getByText('RaceIQ')).toBeInTheDocument()
  })

  it('renders all three project cards', () => {
    render(<Projects />)
    const articles = document.querySelectorAll('article')
    expect(articles.length).toBe(3)
  })

  it('renders GitHub link for RaceIQ', () => {
    render(<Projects />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })
})
