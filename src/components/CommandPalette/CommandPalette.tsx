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
  { id: 'about',        label: 'Go to About',        category: 'Navigate', action: () => scrollTo('#about')        },
  { id: 'experience',   label: 'Go to Experience',   category: 'Navigate', action: () => scrollTo('#experience')   },
  { id: 'projects',     label: 'Go to Projects',     category: 'Navigate', action: () => scrollTo('#projects')     },
  { id: 'skills',       label: 'Go to Skills',       category: 'Navigate', action: () => scrollTo('#skills')       },
  { id: 'achievements', label: 'Go to Recognition',  category: 'Navigate', action: () => scrollTo('#achievements') },
  { id: 'education',    label: 'Go to Education',    category: 'Navigate', action: () => scrollTo('#education')    },
  { id: 'contact',      label: 'Go to Contact',      category: 'Navigate', action: () => scrollTo('#contact')      },
  { id: 'email',        label: 'Send an email',      category: 'Connect',  action: () => { window.location.href = 'mailto:yashsonkhiya2195@gmail.com' }, shortcut: 'E' },
  { id: 'github',       label: 'Open GitHub',        category: 'Connect',  action: () => window.open('https://github.com/ysonkhiya122', '_blank', 'noopener') },
  { id: 'linkedin',     label: 'Open LinkedIn',      category: 'Connect',  action: () => window.open('https://linkedin.com/in/yash-sonkhiya', '_blank', 'noopener') },
]

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export default function CommandPalette() {
  const [open,    setOpen]    = useState(false)
  const [query,   setQuery]   = useState('')
  const [focused, setFocused] = useState(0)
  const inputRef   = useRef<HTMLInputElement>(null)
  const paletteRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )
  const activeId =
    filtered[focused] ? `cmd-option-${filtered[focused].id}` : undefined

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    // Return focus to wherever the user was before opening.
    restoreRef.current?.focus()
    restoreRef.current = null
  }, [])

  const run = useCallback((cmd: Command) => {
    close()
    setTimeout(cmd.action, 100)
  }, [close])

  // Global shortcut: only Cmd/Ctrl+K is listened for while closed.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => {
          if (!v) {
            restoreRef.current = document.activeElement as HTMLElement
            setFocused(0)
          } else {
            setQuery('')
          }
          return !v
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Palette-local keyboard handling — attached only while open.
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocused((v) => (filtered.length ? (v + 1) % filtered.length : 0))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocused((v) => (filtered.length ? (v - 1 + filtered.length) % filtered.length : 0))
      }
      if (e.key === 'Enter' && filtered[focused]) {
        e.preventDefault()
        run(filtered[focused])
      }
      // Focus trap: keep Tab inside the dialog.
      if (e.key === 'Tab') {
        const nodes = paletteRef.current?.querySelectorAll<HTMLElement>(
          'input, button, [tabindex]:not([tabindex="-1"])'
        )
        if (!nodes || nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, focused, filtered, close, run])

  // Focus the input and lock body scroll while open.
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Group by category
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  let flatIndex = -1

  return (
    <>
      {/* Trigger hint — bottom left */}
      <button
        className={styles.trigger}
        onClick={() => {
          restoreRef.current = document.activeElement as HTMLElement
          setFocused(0)
          setOpen(true)
        }}
        aria-label="Open command palette"
        aria-haspopup="dialog"
        data-cursor-hover
      >
        <span className={styles.triggerKbd}>{isMac ? '⌘' : 'Ctrl'}</span>
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
              ref={paletteRef}
              className={styles.palette}
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.97, y: -8  }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
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
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmd-listbox"
                  aria-activedescendant={activeId}
                  aria-label="Search commands"
                />
                <kbd className={styles.escKbd}>esc</kbd>
              </div>

              <div className={styles.results} role="listbox" id="cmd-listbox" aria-label="Commands">
                {Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category} className={styles.group}>
                    <p className={styles.groupLabel}>{category}</p>
                    {cmds.map((cmd) => {
                      flatIndex += 1
                      const idx = flatIndex
                      const isFocused = idx === focused
                      return (
                        <button
                          key={cmd.id}
                          id={`cmd-option-${cmd.id}`}
                          className={`${styles.item} ${isFocused ? styles.active : ''}`}
                          onClick={() => run(cmd)}
                          onMouseEnter={() => setFocused(idx)}
                          role="option"
                          aria-selected={isFocused}
                          tabIndex={-1}
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
                  <p className={styles.empty} role="status">No results for "{query}"</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
