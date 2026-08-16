import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Self-hosted fonts — served from our own origin with hashed,
// immutable filenames instead of the Google Fonts request chain.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
