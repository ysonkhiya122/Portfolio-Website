import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CommandPalette from '@/components/CommandPalette/CommandPalette'

describe('CommandPalette', () => {
  it('renders the trigger button', () => {
    render(<CommandPalette />)
    expect(
      screen.getByRole('button', { name: /open command palette/i })
    ).toBeInTheDocument()
  })

  it('opens with Ctrl+K and closes with Escape', async () => {
    render(<CommandPalette />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    // AnimatePresence keeps the dialog mounted during its exit animation.
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
  })

  it('opens via the trigger button', () => {
    render(<CommandPalette />)
    fireEvent.click(screen.getByRole('button', { name: /open command palette/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('filters commands by query', () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'github' } })

    expect(screen.getByText('Open GitHub')).toBeInTheDocument()
    expect(screen.queryByText('Go to About')).not.toBeInTheDocument()
  })

  it('shows an empty state for no matches', () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'zzz-no-match' },
    })
    expect(screen.getByRole('status')).toHaveTextContent(/no results/i)
  })

  it('moves selection with arrow keys and reflects it in aria-activedescendant', () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-activedescendant', 'cmd-option-about')

    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-activedescendant', 'cmd-option-experience')

    fireEvent.keyDown(window, { key: 'ArrowUp' })
    expect(input).toHaveAttribute('aria-activedescendant', 'cmd-option-about')
  })

  it('includes every page section in navigation commands', () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    for (const section of [
      'Go to About',
      'Go to Experience',
      'Go to Projects',
      'Go to Skills',
      'Go to Recognition',
      'Go to Education',
      'Go to Contact',
    ]) {
      expect(screen.getByText(section)).toBeInTheDocument()
    }
  })
})
