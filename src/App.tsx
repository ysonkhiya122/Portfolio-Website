import { Suspense, lazy, useCallback, useState } from 'react'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Projects from '@/components/Projects/Projects'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Recognition from '@/components/Recognition/Recognition'
import Contact from '@/components/Contact/Contact'
import Footer from '@/components/Footer/Footer'
import CaseStudyDialog from '@/components/CaseStudyDialog/CaseStudyDialog'
import { content } from '@/content'

// The palette is idle until invoked — keep it out of the critical path.
const CommandPalette = lazy(() => import('@/components/CommandPalette/CommandPalette'))

export default function App() {
  const [caseStudyId, setCaseStudyId] = useState<string | null>(null)
  const activeProject = content.projects.find((project) => project.id === caseStudyId) ?? null

  const openProject = useCallback((id: string) => {
    setCaseStudyId(id)
    // Reflect the open case study in the URL so a recruiter can share it.
    history.replaceState(null, '', `#work/${id}`)
  }, [])

  const closeProject = useCallback(() => {
    setCaseStudyId(null)
    history.replaceState(null, '', '#work')
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Nav />

      <main id="main" tabIndex={-1}>
        <div id="top" />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Recognition />
        <Contact />
      </main>

      <Footer />

      <CaseStudyDialog project={activeProject} onClose={closeProject} />

      <Suspense fallback={null}>
        <CommandPalette onOpenProject={openProject} />
      </Suspense>
    </>
  )
}
