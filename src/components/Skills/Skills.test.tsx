import { render, screen } from '@testing-library/react'
import Skills from '@/components/Skills/Skills'

describe('Skills', () => {
  it('renders the section heading', () => {
    render(<Skills />)
    expect(screen.getByRole('heading', { name: /technical skills/i })).toBeInTheDocument()
  })

  it('renders all skill group titles', () => {
    render(<Skills />)
    expect(screen.getByText('Languages')).toBeInTheDocument()
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Testing')).toBeInTheDocument()
    expect(screen.getByText('DevOps & Cloud')).toBeInTheDocument()
  })

  it('renders TypeScript as a skill', () => {
    render(<Skills />)
    // Appears in both the grouped list and the skill sphere.
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0)
  })
})
