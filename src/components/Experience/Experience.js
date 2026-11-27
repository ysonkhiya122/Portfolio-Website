import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { content } from '@/content';
import { formatRange, formatDuration } from '@/lib/format';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { tenurePhrase } from '@/content/derived';
import { sectionEyebrow } from '@/content/sections';
import styles from './Experience.module.scss';
function TimelineEntry({ entry, order }) {
    return (_jsxs(Reveal, { as: "article", order: order, className: styles.entry, children: [_jsx("div", { className: styles.rail, "aria-hidden": "true", children: _jsx("span", { className: styles.node, "data-current": entry.end === null || undefined }) }), _jsxs("div", { className: styles.body, children: [_jsxs("header", { className: styles.header, children: [_jsxs("div", { className: styles.headMain, children: [_jsx("h3", { className: styles.role, children: entry.role }), _jsxs("p", { className: styles.org, children: [entry.company, _jsx("span", { className: styles.orgSep, "aria-hidden": "true", children: "\u00B7" }), entry.location] })] }), _jsxs("p", { className: styles.dates, children: [_jsx("time", { dateTime: entry.start, children: formatRange(entry.start, entry.end) }), _jsx("span", { className: styles.duration, children: formatDuration(entry.start, entry.end) })] })] }), _jsx("p", { className: styles.summary, children: entry.summary }), _jsx("ul", { className: styles.highlights, children: entry.highlights.map((highlight) => (_jsx("li", { className: styles.highlight, children: highlight }, highlight.slice(0, 30)))) }), entry.promotion && (_jsxs("p", { className: styles.promotion, children: [_jsx("span", { "aria-hidden": "true", children: "\u2191" }), entry.promotion.title, " \u00B7", ' ', formatRange(entry.promotion.date, null).replace(' — Present', '')] })), _jsx("ul", { className: styles.stack, "aria-label": "Technologies used", children: entry.stack.map((tech) => (_jsx("li", { className: "chip", children: tech }, tech))) })] })] }));
}
export default function Experience() {
    return (_jsx(Section, { id: "experience", eyebrow: sectionEyebrow('experience'), title: `Two roles, one promotion, ${tenurePhrase()} years of production.`, children: _jsx("div", { className: styles.timeline, children: content.experience.map((entry, index) => (_jsx(TimelineEntry, { entry: entry, order: index }, entry.id))) }) }));
}
