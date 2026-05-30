import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import Projects from '@/components/Projects/Projects'
import Skills from '@/components/Skills/Skills'
import Achievements from '@/components/Achievements/Achievements'
import Education from '@/components/Education/Education'
import Contact from '@/components/Contact/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Achievements />
      <Education />
      <Contact />
    </main>
  )
}
