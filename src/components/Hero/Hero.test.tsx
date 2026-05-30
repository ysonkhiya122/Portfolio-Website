import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero/Hero'

describe('Hero', () => {
  it('renders the full name', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Yash Sonkhiya')
  })

  it('renders the availability indicator', () => {
    render(<Hero />)
    expect(screen.getByText(/open to opportunities/i)).toBeInTheDocument()
  })

  it('renders all three stat values', () => {
    render(<Hero />)
    expect(screen.getByText('2+')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renders both CTA links', () => {
    render(<Hero />)
    expect(screen.getByText('Get in touch')).toBeInTheDocument()
    expect(screen.getByText('View work')).toBeInTheDocument()
  })
})
