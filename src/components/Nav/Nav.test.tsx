import { render, screen, fireEvent } from '@testing-library/react'
import Nav from '@/components/Nav/Nav'

describe('Nav', () => {
  it('renders the logo as a home link', () => {
    render(<Nav />)
    const logo = screen.getByLabelText(/yash sonkhiya — home/i)
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders all nav links (desktop and mobile menus)', () => {
    render(<Nav />)
    for (const label of ['About', 'Experience', 'Projects', 'Skills', 'Contact']) {
      // Each link exists twice: desktop link row + mobile menu panel.
      expect(screen.getAllByText(label)).toHaveLength(2)
    }
  })

  it('renders the hire me CTA', () => {
    render(<Nav />)
    expect(screen.getAllByText(/hire me/i).length).toBeGreaterThan(0)
  })

  it('toggles the mobile menu via the hamburger button', () => {
    render(<Nav />)
    const button = screen.getByRole('button', { name: /open menu/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the mobile menu on Escape', () => {
    render(<Nav />)
    const button = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
