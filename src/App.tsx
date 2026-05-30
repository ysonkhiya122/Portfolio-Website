import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import ScrollLine from '@/components/ScrollLine/ScrollLine'
import Footer from '@/components/Footer/Footer'
import CustomCursor from '@/components/CustomCursor/CustomCursor'
import CommandPalette from '@/components/CommandPalette/CommandPalette'
import Home from '@/pages/Home'
import '@/styles/globals.scss'

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <ScrollLine />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
      <CommandPalette />
    </BrowserRouter>
  )
}
