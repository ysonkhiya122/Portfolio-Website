import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Self-hosted variable font: one interpolated file instead of six
// static weights, ~120 kB fewer bytes over the wire.
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono/400.css'

import '@/styles/globals.scss'

// Development-only content validation. Vite statically replaces the
// flag, so the validator and its schema are removed from the build.
if (import.meta.env.DEV) {
  const { assertValidContent } = await import('@/content/validate')
  assertValidContent()
}

// Add the `js` class before first paint so reveal animations can start
// hidden without ever hiding content from a user whose JS failed.
document.documentElement.classList.add('js')

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element #root is missing from index.html')
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
