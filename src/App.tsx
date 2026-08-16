import { lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import Nav from '@/components/Nav/Nav'
import ScrollLine from '@/components/ScrollLine/ScrollLine'
import Footer from '@/components/Footer/Footer'
import CustomCursor from '@/components/CustomCursor/CustomCursor'
import Home from '@/pages/Home'
import '@/styles/globals.scss'

// The palette is idle until the user presses Cmd/Ctrl+K — split it out
// of the critical bundle.
const CommandPalette = lazy(
  () => import('@/components/CommandPalette/CommandPalette')
)

export default function App() {
  return (
    // reducedMotion="user": every Framer Motion animation respects the
    // OS-level prefers-reduced-motion setting automatically.
    <MotionConfig reducedMotion="user">
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <ScrollLine />
      <Nav />
      <Home />
      <Footer />
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
    </MotionConfig>
  )
}
