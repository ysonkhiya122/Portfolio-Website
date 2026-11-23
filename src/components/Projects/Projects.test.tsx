import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Projects from './Projects'
import { content } from '@/content'

describe('Projects', () => {
  it('renders one card per case study', () => {
    render(<Projects />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(content.projects.length)
  })

  it('leads with outcomes rather than a feature list', () => {
    render(<Projects />)
    for (const project of content.projects) {
      expect(screen.getByText(project.headline)).toBeInTheDocument()
    }
  })

  it('never links to a live URL for an internal project', () => {
    render(<Projects />)
    for (const project of content.projects) {
      if (project.status !== 'internal') continue
      for (const link of project.links) {
        expect(
          screen.queryByRole('link', { name: new RegExp(link.href) }),
        ).not.toBeInTheDocument()
      }
    }
  })

  it('marks external links with a safe rel attribute', () => {
    render(<Projects />)
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('target', '_blank')
    }
  })

  it('opens the case study dialog on demand', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    const buttons = screen.getAllByRole('button', { name: /read the case study/i })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(buttons[0]!)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // The dialog shows the reasoning, not just the description.
    expect(screen.getByText('Decisions and trade-offs')).toBeInTheDocument()
  })

  it('closes the dialog and unmounts its content', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(screen.getAllByRole('button', { name: /read the case study/i })[0]!)
    await user.click(screen.getByRole('button', { name: 'Close case study' }))

    expect(screen.queryByText('Decisions and trade-offs')).not.toBeInTheDocument()
  })
})
