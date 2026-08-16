import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero/Hero'

describe('Hero', () => {
  it('renders the full name', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Yash Sonkhiya')
  })

  it('renders the availability indicator', () => {
    render(<Hero />)
    expect(screen.getByText(/open to work/i)).toBeInTheDocument()
  })

  it('renders all four stat labels', () => {
    render(<Hero />)
    // Counter values animate from 0 via IntersectionObserver (mocked in
    // jsdom), so assert on the stable labels rather than animated numbers.
    expect(screen.getByText('Years exp.')).toBeInTheDocument()
    expect(screen.getByText('Production apps')).toBeInTheDocument()
    expect(screen.getByText('Countries live')).toBeInTheDocument()
    expect(screen.getByText('Defect reduction')).toBeInTheDocument()
  })

  it('renders both CTA links', () => {
    render(<Hero />)
    expect(screen.getByText('Get in touch')).toBeInTheDocument()
    expect(screen.getByText('View work')).toBeInTheDocument()
  })
})
