import Nav from '@/components/Nav/Nav'
import ScrollLine from '@/components/ScrollLine/ScrollLine'
import Footer from '@/components/Footer/Footer'
import CustomCursor from '@/components/CustomCursor/CustomCursor'
import CommandPalette from '@/components/CommandPalette/CommandPalette'
import Home from '@/pages/Home'
import '@/styles/globals.scss'

export default function App() {
  return (
    <>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <ScrollLine />
      <Nav />
      <Home />
      <Footer />
      <CommandPalette />
    </>
  )
}
