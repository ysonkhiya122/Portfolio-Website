import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Notes from '@/components/Notes/Notes'
import Projects from '@/components/Projects/Projects'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Recognition from '@/components/Recognition/Recognition'
import Contact from '@/components/Contact/Contact'
import Footer from '@/components/Footer/Footer'
import CaseStudyDialog from '@/components/CaseStudyDialog/CaseStudyDialog'
import { content } from '@/content'
import { caseStudyIdFromHash, pushCaseStudy, replaceWithWork } from '@/lib/caseStudyRoute'

// The palette is idle until invoked — keep it out of the critical path.
const CommandPalette = lazy(() => import('@/components/CommandPalette/CommandPalette'))

const isKnownProject = (id: string | null) =>
  id !== null && content.projects.some((project) => project.id === id)

export default function App() {
  // Hydrate from the URL so a shared link opens the case study on a cold
  // load — not just when it is clicked from within the page.
  const [caseStudyId, setCaseStudyId] = useState<string | null>(() =>
    isKnownProject(caseStudyIdFromHash(window.location.hash))
      ? caseStudyIdFromHash(window.location.hash)
      : null,
  )

  const activeProject = content.projects.find((project) => project.id === caseStudyId) ?? null

  const openProject = useCallback((id: string) => {
    setCaseStudyId(id)
    pushCaseStudy(id)
  }, [])

  const closeProject = useCallback(() => {
    setCaseStudyId(null)
    // replace, not push: closing should not add a history entry, it should
    // return the URL to the section it came from.
    replaceWithWork()
  }, [])

  // Keep React state in step with the URL. This covers the browser Back and
  // Forward buttons, a pasted deep link, and the nav's section links.
  useEffect(() => {
    const sync = () => {
      const id = caseStudyIdFromHash(window.location.hash)
      setCaseStudyId(isKnownProject(id) ? id : null)
    }
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
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
        <Projects onOpenProject={openProject} />
        <Notes />
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
