import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { content } from '@/content';
import { formatMonth } from '@/lib/format';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { sectionEyebrow } from '@/content/sections';
import styles from './Recognition.module.scss';
export default function Recognition() {
    const sorted = [...content.achievements].sort((a, b) => b.date.localeCompare(a.date));
    return (_jsx(Section, { id: "recognition", eyebrow: sectionEyebrow('recognition'), title: "Receipts.", children: _jsxs("div", { className: styles.layout, children: [_jsx(Reveal, { className: styles.head, children: _jsx("p", { className: styles.note, children: "Everything here is verifiable on request. No invented awards." }) }), _jsxs(Reveal, { order: 1, className: styles.listWrapper, children: [_jsx("ol", { className: styles.list, children: sorted.map((item) => (_jsxs("li", { className: styles.item, children: [_jsx("time", { className: styles.date, dateTime: item.date, children: formatMonth(item.date) }), _jsxs("div", { className: styles.detail, children: [_jsx("p", { className: styles.title, children: item.title }), _jsx("p", { className: styles.issuer, children: item.issuer })] })] }, item.id))) }), content.education.map((entry) => (_jsxs("div", { className: styles.education, children: [_jsxs("time", { className: styles.date, dateTime: entry.end, children: [entry.start, "\u2013", entry.end] }), _jsxs("div", { className: styles.detail, children: [_jsx("p", { className: styles.title, children: entry.qualification }), _jsxs("p", { className: styles.issuer, children: [entry.institution, " \u00B7 ", entry.location] })] })] }, entry.id)))] })] }) }));
}
