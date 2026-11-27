import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assets } from '@/content/assets';
import { site } from '@/content/site';
import { sortedNotes } from '@/lib/noteRoutes';
import { sectionMeta, sectionNumber, sectionOrder } from '@/content/sections';
import { content } from '@/content';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import styles from './CommandPalette.module.scss';
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
function scrollToId(id) {
    const target = document.querySelector(id);
    if (!target)
        return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', id);
    target.focus({ preventScroll: true });
}
function openExternal(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}
function buildCommands(openProject) {
    // Hints are derived, not typed. They were hardcoded here and had already
    // gone stale twice over: 01–02 skipped five numbers, and removing a section
    // would have silently desynced them from the page again.
    const nav = sectionOrder.map((id) => ({
        id,
        label: sectionMeta[id].label,
        group: 'Jump to',
        hint: sectionNumber(id),
        run: () => scrollToId(`#${id}`),
    }));
    const noteCommands = sortedNotes.map((note) => ({
        id: `note-${note.slug}`,
        label: note.title,
        group: 'Notes',
        keywords: note.tags.join(' '),
        run: () => openExternal(`/notes/${note.slug}/`),
    }));
    const cases = content.projects.map((project) => ({
        id: `case-${project.id}`,
        label: project.name,
        group: 'Case studies',
        keywords: `${project.headline} ${project.stack.join(' ')}`,
        run: () => openProject(project.id),
    }));
    const actions = [
        {
            id: 'email',
            label: 'Copy email address',
            group: 'Actions',
            keywords: 'contact mail',
            run: () => {
                void navigator.clipboard.writeText(site.email);
            },
        },
        {
            id: 'mail',
            label: 'Send an email',
            group: 'Actions',
            keywords: 'contact hire',
            run: () => {
                window.location.href = `mailto:${site.email}`;
            },
        },
        ...assets
            .filter((asset) => asset.group === 'Downloads')
            .map((asset) => ({
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
    ];
    return [...nav, ...cases, ...noteCommands, ...actions];
}
export default function CommandPalette({ onOpenProject, }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(0);
    const inputRef = useRef(null);
    const dialogRef = useRef(null);
    const restoreRef = useRef(null);
    const commands = useMemo(() => buildCommands((id) => onOpenProject?.(id)), [onOpenProject]);
    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle)
            return commands;
        return commands.filter((command) => `${command.label} ${command.group} ${command.keywords ?? ''}`
            .toLowerCase()
            .includes(needle));
    }, [commands, query]);
    const close = useCallback(() => {
        setOpen(false);
        setQuery('');
        setFocused(0);
        restoreRef.current?.focus();
        restoreRef.current = null;
    }, []);
    const run = useCallback((command) => {
        close();
        // Defer so focus restoration happens before the action scrolls.
        window.setTimeout(command.run, 60);
    }, [close]);
    // Global shortcut and a public custom event so any component (the
    // nav hint, for example) can open the palette without prop drilling.
    useEffect(() => {
        const toggle = () => {
            setOpen((current) => {
                if (!current) {
                    restoreRef.current = document.activeElement;
                    setFocused(0);
                }
                return !current;
            });
        };
        const onKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                toggle();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('open-command-palette', toggle);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('open-command-palette', toggle);
        };
    }, []);
    useEffect(() => {
        if (!open)
            return;
        const timer = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 30);
        lockScroll();
        return () => {
            window.clearTimeout(timer);
            unlockScroll();
        };
    }, [open]);
    // Clamp rather than sync: when the query narrows the list, the
    // cursor is derived from the result count instead of being written
    // back through an effect (which would cause a cascading render).
    const cursor = filtered.length === 0 ? 0 : Math.min(focused, filtered.length - 1);
    useEffect(() => {
        if (!open)
            return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                close();
                return;
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setFocused((current) => filtered.length ? (Math.min(current, filtered.length - 1) + 1) % filtered.length : 0);
                return;
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setFocused((current) => {
                    const size = filtered.length;
                    if (size === 0)
                        return 0;
                    const from = Math.min(current, size - 1);
                    return (from - 1 + size) % size;
                });
                return;
            }
            if (event.key === 'Enter' && filtered[cursor]) {
                event.preventDefault();
                run(filtered[cursor]);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, filtered, cursor, close, run]);
    // Keep the active option scrolled into view without scrollIntoView
    // fighting the page.
    const activeId = filtered[cursor] ? `cmd-${filtered[cursor].id}` : undefined;
    useEffect(() => {
        if (!open || !activeId)
            return;
        document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
    }, [activeId, open]);
    if (!open)
        return null;
    const grouped = filtered.reduce((acc, command) => {
        ;
        (acc[command.group] ??= []).push(command);
        return acc;
    }, {});
    return (_jsx("div", { className: styles.overlay, children: _jsxs("div", { ref: dialogRef, className: styles.palette, role: "dialog", "aria-modal": "true", "aria-label": "Command palette", children: [_jsxs("div", { className: styles.inputRow, children: [_jsxs("svg", { className: styles.searchIcon, width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: [_jsx("circle", { cx: "6", cy: "6", r: "4.4", stroke: "currentColor", strokeWidth: "1.4", fill: "none" }), _jsx("path", { d: "M9.4 9.4 12.5 12.5", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })] }), _jsx("input", { ref: inputRef, className: styles.input, value: query, onChange: (event) => {
                                setQuery(event.target.value);
                                setFocused(0);
                            }, placeholder: "Search sections, case studies, actions\u2026", "aria-label": "Search commands", role: "combobox", "aria-expanded": "true", "aria-controls": "command-results", "aria-activedescendant": activeId, autoComplete: "off", spellCheck: false }), _jsx("button", { type: "button", className: styles.esc, onClick: close, "aria-label": "Close command palette", children: "esc" })] }), _jsxs("div", { className: styles.results, id: "command-results", role: "listbox", "aria-label": "Results", children: [filtered.length === 0 && (_jsxs("p", { className: styles.empty, children: ["Nothing matches \u201C", query, "\u201D. Try ", _jsx("em", { children: "work" }), ", ", _jsx("em", { children: "cv" }), " or ", _jsx("em", { children: "email" }), "."] })), Object.entries(grouped).map(([group, items]) => (_jsxs("div", { className: styles.group, role: "group", "aria-label": group, children: [_jsx("p", { className: styles.groupLabel, "aria-hidden": "true", children: group }), items.map((command) => {
                                    const index = filtered.indexOf(command);
                                    return (_jsxs("button", { id: `cmd-${command.id}`, type: "button", role: "option", "aria-selected": index === cursor, tabIndex: -1, className: styles.option, "data-active": index === cursor || undefined, onMouseEnter: () => setFocused(index), onClick: () => run(command), children: [_jsx("span", { className: styles.optionLabel, children: command.label }), command.hint && _jsx("span", { className: styles.optionHint, children: command.hint })] }, command.id));
                                })] }, group)))] }), _jsxs("div", { className: styles.footer, children: [_jsxs("span", { children: [_jsx("kbd", { children: "\u2191" }), _jsx("kbd", { children: "\u2193" }), " navigate"] }), _jsxs("span", { children: [_jsx("kbd", { children: "\u21B5" }), " open"] }), _jsxs("span", { children: [_jsx("kbd", { children: isMac ? '⌘' : 'ctrl' }), _jsx("kbd", { children: "K" }), " toggle"] })] })] }) }));
}
