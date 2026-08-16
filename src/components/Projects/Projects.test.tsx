import { render, screen } from '@testing-library/react'
import Projects from '@/components/Projects/Projects'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders the featured ApexOn project', () => {
    render(<Projects />)
    expect(screen.getByText('ApexOn')).toBeInTheDocument()
  })

  it('renders all three project cards', () => {
    render(<Projects />)
    const articles = document.querySelectorAll('article')
    expect(articles.length).toBe(3)
  })

  it('renders working GitHub and demo links for the featured project', () => {
    render(<Projects />)
    const github = screen.getByText('GitHub').closest('a')
    const demo = screen.getByText('Live demo').closest('a')
    expect(github).toHaveAttribute('href', 'https://github.com/ysonkhiya122/ApexOn')
    expect(demo).toHaveAttribute('href', 'https://apexon.netlify.app/')
  })
})
