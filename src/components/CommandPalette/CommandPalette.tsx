import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { assets } from '@/content/assets'
import { site } from '@/content/site'
import { sortedNotes } from '@/lib/noteRoutes'
import { content } from '@/content'
import { lockScroll, unlockScroll } from '@/lib/scrollLock'
import styles from './CommandPalette.module.scss'

interface Command {
  id: string
  label: string
  group: string
  keywords?: string
  hint?: string
  run: () => void
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

function scrollToId(id: string) {
  const target = document.querySelector(id)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', id)
  ;(target as HTMLElement).focus({ preventScroll: true })
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function buildCommands(openProject: (id: string) => void): Command[] {
  const nav: Command[] = [
    {
      id: 'about',
      label: 'About',
      group: 'Jump to',
      hint: '01',
      run: () => scrollToId('#about'),
    },
    {
      id: 'work',
      label: 'Selected work',
      group: 'Jump to',
      hint: '02',
      run: () => scrollToId('#work'),
    },
    {
      id: 'notes',
      label: 'Notes',
      group: 'Jump to',
      hint: '06',
      run: () => scrollToId('#notes'),
    },
    {
      id: 'experience',
      label: 'Experience',
      group: 'Jump to',
      hint: '07',
      run: () => scrollToId('#experience'),
    },
    {
      id: 'skills',
      label: 'Toolkit',
      group: 'Jump to',
      hint: '08',
      run: () => scrollToId('#skills'),
    },
    {
      id: 'contact',
      label: 'Contact',
      group: 'Jump to',
      hint: '09',
      run: () => scrollToId('#contact'),
    },
  ]

  const noteCommands: Command[] = sortedNotes.map((note) => ({
    id: `note-${note.slug}`,
    label: note.title,
    group: 'Notes',
    keywords: note.tags.join(' '),
    run: () => openExternal(`/notes/${note.slug}/`),
  }))

  const cases: Command[] = content.projects.map((project) => ({
    id: `case-${project.id}`,
    label: project.name,
    group: 'Case studies',
    keywords: `${project.headline} ${project.stack.join(' ')}`,
    run: () => openProject(project.id),
  }))

  const actions: Command[] = [
    {
      id: 'email',
      label: 'Copy email address',
      group: 'Actions',
      keywords: 'contact mail',
      run: () => {
        void navigator.clipboard.writeText(site.email)
      },
    },
    {
      id: 'mail',
      label: 'Send an email',
      group: 'Actions',
      keywords: 'contact hire',
      run: () => {
        window.location.href = `mailto:${site.email}`
      },
    },
    ...assets
      .filter((asset) => asset.group === 'Downloads')
      .map<Command>((asset) => ({
        id: asset.id,
        label: asset.label,
        group: 'Downloads',
        keywords: asset.description,
        run: () => openExternal(asset.href),
      })),
    {
      id: 'github',
      label: 'Open GitHub',
      group: 'Elsewhere',
      run: () => openExternal(site.links.github),
    },
    {
      id: 'linkedin',
      label: 'Open LinkedIn',
      group: 'Elsewhere',
      run: () => openExternal(site.links.linkedin),
    },
    {
      id: 'print',
      label: 'Print this page',
      group: 'Actions',
      keywords: 'pdf save resume',
      run: () => window.print(),
    },
  ]

  return [...nav, ...cases, ...noteCommands, ...actions]
}

export default function CommandPalette({
  onOpenProject,
}: {
  onOpenProject?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  const commands = useMemo(() => buildCommands((id) => onOpenProject?.(id)), [onOpenProject])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return commands
    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.keywords ?? ''}`
        .toLowerCase()
        .includes(needle),
    )
  }, [commands, query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setFocused(0)
    restoreRef.current?.focus()
    restoreRef.current = null
  }, [])

  const run = useCallback(
    (command: Command) => {
      close()
      // Defer so focus restoration happens before the action scrolls.
      window.setTimeout(command.run, 60)
    },
    [close],
  )

  // Global shortcut and a public custom event so any component (the
  // nav hint, for example) can open the palette without prop drilling.
  useEffect(() => {
    const toggle = () => {
      setOpen((current) => {
        if (!current) {
          restoreRef.current = document.activeElement as HTMLElement
          setFocused(0)
        }
        return !current
      })
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', toggle)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', toggle)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 30)
    lockScroll()
    return () => {
      window.clearTimeout(timer)
      unlockScroll()
    }
  }, [open])

  // Clamp rather than sync: when the query narrows the list, the
  // cursor is derived from the result count instead of being written
  // back through an effect (which would cause a cascading render).
  const cursor = filtered.length === 0 ? 0 : Math.min(focused, filtered.length - 1)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setFocused((current) =>
          filtered.length ? (Math.min(current, filtered.length - 1) + 1) % filtered.length : 0,
        )
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setFocused((current) => {
          const size = filtered.length
          if (size === 0) return 0
          const from = Math.min(current, size - 1)
          return (from - 1 + size) % size
        })
        return
      }
      if (event.key === 'Enter' && filtered[cursor]) {
        event.preventDefault()
        run(filtered[cursor])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, filtered, cursor, close, run])

  // Keep the active option scrolled into view without scrollIntoView
  // fighting the page.
  const activeId = filtered[cursor] ? `cmd-${filtered[cursor].id}` : undefined
  useEffect(() => {
    if (!open || !activeId) return
    document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' })
  }, [activeId, open])

  if (!open) return null

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, command) => {
    ;(acc[command.group] ??= []).push(command)
    return acc
  }, {})

  return (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.palette}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className={styles.inputRow}>
          <svg
            className={styles.searchIcon}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden="true"
          >
            <circle
              cx="6"
              cy="6"
              r="4.4"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M9.4 9.4 12.5 12.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setFocused(0)
            }}
            placeholder="Search sections, case studies, actions…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className={styles.esc}
            onClick={close}
            aria-label="Close command palette"
          >
            esc
          </button>
        </div>

        <div
          className={styles.results}
          id="command-results"
          role="listbox"
          aria-label="Results"
        >
          {filtered.length === 0 && (
            <p className={styles.empty}>
              Nothing matches “{query}”. Try <em>work</em>, <em>cv</em> or <em>email</em>.
            </p>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className={styles.group} role="group" aria-label={group}>
              <p className={styles.groupLabel} aria-hidden="true">
                {group}
              </p>
              {items.map((command) => {
                const index = filtered.indexOf(command)
                return (
                  <button
                    key={command.id}
                    id={`cmd-${command.id}`}
                    type="button"
                    role="option"
                    aria-selected={index === cursor}
                    tabIndex={-1}
                    className={styles.option}
                    data-active={index === cursor || undefined}
                    onMouseEnter={() => setFocused(index)}
                    onClick={() => run(command)}
                  >
                    <span className={styles.optionLabel}>{command.label}</span>
                    {command.hint && <span className={styles.optionHint}>{command.hint}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>{isMac ? '⌘' : 'ctrl'}</kbd>
            <kbd>K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  )
}
