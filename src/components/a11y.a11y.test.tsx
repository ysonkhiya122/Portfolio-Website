import type { ComponentType } from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Projects from '@/components/Projects/Projects'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Recognition from '@/components/Recognition/Recognition'
import Contact from '@/components/Contact/Contact'
import Footer from '@/components/Footer/Footer'
import Nav from '@/components/Nav/Nav'

const cases: [string, ComponentType][] = [
  ['Nav', Nav],
  ['Hero', Hero],
  ['About', About],
  ['Projects', () => <Projects onOpenProject={() => {}} />],
  ['Experience', Experience],
  ['Skills', Skills],
  ['Recognition', Recognition],
  ['Contact', Contact],
  ['Footer', Footer],
]

describe.each(cases)('%s accessibility', (_name, Component) => {
  it('has no detectable axe violations', async () => {
    const { container } = render(<Component />)
    const { violations } = await axe(container)
    // Report the rule and node so a failure is actionable, not a count.
    const summary = violations.map(
      (violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`,
    )
    expect(summary).toEqual([])
  })
})
