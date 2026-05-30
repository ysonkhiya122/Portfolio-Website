import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './CommandPalette.module.scss'

interface Command {
  id:       string
  label:    string
  category: string
  action:   () => void
  shortcut?: string
}

const COMMANDS: Command[] = [
  { id: 'about',        label: 'Go to About',        category: 'Navigate', action: () => scrollTo('#about')       },
  { id: 'experience',   label: 'Go to Experience',   category: 'Navigate', action: () => scrollTo('#experience')  },
  { id: 'projects',     label: 'Go to Projects',     category: 'Navigate', action: () => scrollTo('#projects')    },
  { id: 'skills',       label: 'Go to Skills',       category: 'Navigate', action: () => scrollTo('#skills')      },
  { id: 'contact',      label: 'Go to Contact',      category: 'Navigate', action: () => scrollTo('#contact')     },
  { id: 'email',        label: 'Send an email',       category: 'Connect',  action: () => window.location.href = 'mailto:yashsonkhiya2195@gmail.com', shortcut: 'E' },
  { id: 'github',       label: 'Open GitHub',        category: 'Connect',  action: () => window.open('https://github.com/ysonkhiya122', '_blank') },
  { id: 'linkedin',     label: 'Open LinkedIn',      category: 'Connect',  action: () => window.open('https://linkedin.com/in/yash-sonkhiya', '_blank') },
]

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function CommandPalette() {
  const [open,    setOpen]    = useState(false)
  const [query,   setQuery]   = useState('')
  const [focused, setFocused] = useState(0)
  const inputRef              = useRef<HTMLInputElement>(null)

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const close = useCallback(() => { setOpen(false); setQuery('') }, [])

  const run = useCallback((cmd: Command) => {
    close()
    setTimeout(cmd.action, 100)
  }, [close])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        setFocused(0)
      }
      if (e.key === 'Escape') close()
      if (!open) return
      if (e.key === 'ArrowDown') setFocused((v) => (v + 1) % filtered.length)
      if (e.key === 'ArrowUp')   setFocused((v) => (v - 1 + filtered.length) % filtered.length)
      if (e.key === 'Enter' && filtered[focused]) run(filtered[focused])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, focused, filtered, close, run])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
  }, [open])

  // Group by category
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  return (
    <>
      {/* Trigger hint — bottom left */}
      <button className={styles.trigger} onClick={() => setOpen(true)} data-cursor-hover>
        <span className={styles.triggerKbd}>⌘</span>
        <span className={styles.triggerKbd}>K</span>
        <span className={styles.triggerLabel}>Command</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
          >
            <motion.div
              className={styles.palette}
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.97, y: -8  }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Command palette"
            >
              <div className={styles.inputRow}>
                <span className={styles.searchIcon} aria-hidden="true">⌕</span>
                <input
                  ref={inputRef}
                  className={styles.input}
                  placeholder="Type a command or search…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setFocused(0) }}
                  aria-label="Search commands"
                />
                <kbd className={styles.escKbd}>esc</kbd>
              </div>

              <div className={styles.results} role="listbox">
                {Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category} className={styles.group}>
                    <p className={styles.groupLabel}>{category}</p>
                    {cmds.map((cmd) => {
                      const isFocused = filtered.indexOf(cmd) === focused
                      return (
                        <button
                          key={cmd.id}
                          className={`${styles.item} ${isFocused ? styles.active : ''}`}
                          onClick={() => run(cmd)}
                          onMouseEnter={() => setFocused(filtered.indexOf(cmd))}
                          role="option"
                          aria-selected={isFocused}
                          data-cursor-hover
                        >
                          <span className={styles.itemLabel}>{cmd.label}</span>
                          {cmd.shortcut && (
                            <kbd className={styles.shortcut}>{cmd.shortcut}</kbd>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className={styles.empty}>No results for "{query}"</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
