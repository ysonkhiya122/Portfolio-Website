import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { sortedNotes } from '@/lib/noteRoutes';
import { formatMonth } from '@/lib/format';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { sectionEyebrow } from '@/content/sections';
import styles from './Notes.module.scss';
function ArrowUpRight() {
    return (_jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M3 9 9 3M9 3H4M9 3v5", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
export default function Notes() {
    return (_jsx(Section, { id: "notes", eyebrow: sectionEyebrow('notes'), title: "Write-ups, not blog posts.", description: "Short pieces about decisions that were hard to make. Written so that someone facing the same problem gets something useful, not so that I look clever.", children: _jsx("ul", { className: styles.list, children: sortedNotes.map((note, index) => (_jsx(Reveal, { as: "li", order: index, className: styles.item, children: _jsxs("a", { href: `/notes/${note.slug}/`, className: styles.link, children: [_jsxs("div", { className: styles.meta, children: [_jsx("time", { dateTime: note.date, children: formatMonth(note.date) }), _jsx("span", { className: styles.sep, "aria-hidden": "true", children: "\u00B7" }), _jsxs("span", { children: [note.readingMinutes, " min read"] })] }), _jsx("h3", { className: styles.title, children: note.title }), _jsx("p", { className: styles.summary, children: note.summary }), _jsx("ul", { className: styles.tags, "aria-label": "Topics", children: note.tags.map((tag) => (_jsx("li", { className: "chip", children: tag }, tag))) }), _jsxs("span", { className: styles.read, children: ["Read ", _jsx(ArrowUpRight, {})] })] }) }, note.slug))) }) }));
}
