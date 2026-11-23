import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommandPalette from './CommandPalette'

const open = () =>
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }),
  )

describe('CommandPalette', () => {
  it('is closed until invoked', () => {
    render(<CommandPalette />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on Cmd/Ctrl+K', async () => {
    render(<CommandPalette />)
    open()
    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
  })

  it('focuses the search input when opened', async () => {
    render(<CommandPalette />)
    open()
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Search commands' })).toHaveFocus()
    })
  })

  it('filters the list by query', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    open()

    const input = await screen.findByRole('combobox', { name: 'Search commands' })
    await user.type(input, 'linkedin')

    expect(screen.getByRole('option', { name: /open linkedin/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /^about/i })).not.toBeInTheDocument()
  })

  it('searches case studies by their stack, not just the name', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    open()

    const input = await screen.findByRole('combobox', { name: 'Search commands' })
    await user.type(input, 'signalr')

    expect(
      screen.getByRole('option', { name: /field dispatch platform/i }),
    ).toBeInTheDocument()
  })

  it('shows a helpful empty state instead of a blank panel', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    open()

    await user.type(await screen.findByRole('combobox', { name: 'Search commands' }), 'zzzzzz')
    expect(screen.getByText(/nothing matches/i)).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    open()
    await screen.findByRole('dialog')

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('moves the active option with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    open()

    const input = await screen.findByRole('combobox', { name: 'Search commands' })
    // The accessible name includes the section index hint ("About 01").
    const first = screen.getByRole('option', { name: /^about/i })
    expect(first).toHaveAttribute('aria-selected', 'true')

    await user.type(input, '{ArrowDown}')
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('opens a case study through the callback', async () => {
    const user = userEvent.setup()
    const onOpenProject = jest.fn()
    render(<CommandPalette onOpenProject={onOpenProject} />)
    open()

    const input = await screen.findByRole('combobox', { name: 'Search commands' })
    await user.type(input, 'apexon')
    await user.keyboard('{Enter}')

    await waitFor(() => expect(onOpenProject).toHaveBeenCalledWith('apexon'))
  })
})
