import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Projects from './Projects'
import { content } from '@/content'

const renderProjects = (onOpenProject = jest.fn()) => ({
  onOpenProject,
  ...render(<Projects onOpenProject={onOpenProject} />),
})

describe('Projects', () => {
  it('renders one card per case study', () => {
    renderProjects()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(content.projects.length)
  })

  it('leads with outcomes rather than a feature list', () => {
    renderProjects()
    for (const project of content.projects) {
      expect(screen.getByText(project.headline)).toBeInTheDocument()
    }
  })

  it('never links to a live URL for an internal project', () => {
    renderProjects()
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
    renderProjects()
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('target', '_blank')
    }
  })

  it('delegates opening a case study to the parent, so the URL stays the source of truth', async () => {
    const user = userEvent.setup()
    const { onOpenProject } = renderProjects()

    await user.click(screen.getAllByRole('button', { name: /read the case study/i })[0]!)

    expect(onOpenProject).toHaveBeenCalledTimes(1)
    expect(onOpenProject).toHaveBeenCalledWith(content.projects[0]?.id)
  })

  it('does not mount a dialog of its own', () => {
    renderProjects()
    // The dialog is owned by App so that there is exactly one.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
