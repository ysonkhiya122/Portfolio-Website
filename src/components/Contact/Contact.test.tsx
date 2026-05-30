import { render, screen } from '@testing-library/react'
import Contact from '@/components/Contact/Contact'

describe('Contact', () => {
  it("renders the section heading", () => {
    render(<Contact />)
    expect(screen.getByText(/Let's build/i)).toBeInTheDocument()
  })

  it('renders the email link', () => {
    render(<Contact />)
    const emailLinks = screen.getAllByText(/yashsonkhiya2195@gmail.com/)
    expect(emailLinks.length).toBeGreaterThan(0)
  })

  it('renders the LinkedIn entry', () => {
    render(<Contact />)
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
  })

  it('renders the GitHub entry', () => {
    render(<Contact />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })
})
