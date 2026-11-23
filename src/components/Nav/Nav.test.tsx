import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Nav from './Nav'

describe('Nav', () => {
  it('exposes a single primary navigation landmark', () => {
    render(<Nav />)
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('links to every section that exists on the page', () => {
    const { container } = render(<Nav />)
    // Section targets are rendered as anchors; assert the hrefs are real.
    for (const id of ['#about', '#work', '#experience', '#skills', '#contact']) {
      expect(
        within(container)
          .getAllByRole('link')
          .some((a) => a.getAttribute('href') === id),
      ).toBe(true)
    }
  })

  it('toggles the mobile disclosure and reports state via aria-expanded', async () => {
    const user = userEvent.setup()
    render(<Nav />)

    const trigger = screen.getByRole('button', { name: 'Open menu' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('closes the mobile menu with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Nav />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.keyboard('{Escape}')

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('offers a keyboard shortcut affordance for the palette', () => {
    render(<Nav />)
    expect(screen.getByRole('button', { name: 'Open command palette' })).toBeInTheDocument()
  })
})
