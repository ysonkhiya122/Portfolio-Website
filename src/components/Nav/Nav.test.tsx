import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav/Nav'

describe('Nav', () => {
  it('renders the logo', () => {
    render(<Nav />)
    expect(screen.getByText(/YS/)).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Nav />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders the hire me CTA', () => {
    render(<Nav />)
    expect(screen.getByText(/hire me/i)).toBeInTheDocument()
  })
})
