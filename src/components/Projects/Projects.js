import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { content } from '@/content';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { sectionEyebrow } from '@/content/sections';
import styles from './Projects.module.scss';
const STATUS_LABEL = {
    live: 'Live',
    internal: 'In production',
    archived: 'Archived',
};
const LINK_LABEL = {
    live: 'Live',
    code: 'Code',
    docs: 'Docs',
    'case-study': 'Case study',
};
function ArrowUpRight() {
    return (_jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M3 9 9 3M9 3H4M9 3v5", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
function ProjectCard({ project, order, onOpen, }) {
    const externalLinks = project.links.filter((link) => link.kind !== 'case-study');
    return (_jsxs(Reveal, { as: "article", order: order, className: styles.card, children: [_jsxs("div", { className: styles.cardTop, children: [_jsxs("span", { className: `chip ${project.status === 'live' ? 'chip--live' : ''}`, children: [project.status === 'live' && _jsx("span", { className: styles.liveDot, "aria-hidden": "true" }), STATUS_LABEL[project.status]] }), _jsx("span", { className: styles.timeframe, children: project.timeframe })] }), _jsxs("div", { className: styles.titleBlock, children: [_jsx("h3", { className: styles.name, children: project.name }), _jsx("p", { className: styles.headline, children: project.headline }), _jsx("p", { className: styles.role, children: project.role })] }), _jsx("ul", { className: styles.impact, "aria-label": `${project.name} outcomes`, children: project.impact.map((metric) => (_jsxs("li", { className: styles.impactItem, children: [_jsx("span", { className: styles.impactValue, children: metric.value }), _jsx("span", { className: styles.impactLabel, children: metric.label })] }, metric.label))) }), _jsx("ul", { className: styles.stack, "aria-label": `${project.name} stack`, children: project.stack.map((tech) => (_jsx("li", { className: "chip", children: tech }, tech))) }), _jsxs("div", { className: styles.cardFoot, children: [_jsxs("button", { type: "button", className: "btn btn--quiet", onClick: onOpen, "aria-haspopup": "dialog", children: ["Read the case study", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] }), externalLinks.length > 0 && (_jsx("span", { className: styles.external, children: externalLinks.map((link) => (_jsxs("a", { href: link.href, target: "_blank", rel: "noopener noreferrer", className: styles.externalLink, children: [LINK_LABEL[link.kind] ?? link.label, _jsx(ArrowUpRight, {})] }, link.href))) }))] })] }));
}
/**
 * Pure renderer. The dialog and its state live in App, so there is one
 * source of truth for "which case study is open".
 */
export default function Projects({ onOpenProject }) {
    return (_jsx(Section, { id: "work", eyebrow: sectionEyebrow('work'), title: "Three systems, and the decisions behind them.", description: "Feature lists are easy to fake. These are the trade-offs I actually argued for, and the numbers that came out of them.", children: _jsx("div", { className: styles.grid, children: content.projects.map((project, index) => (_jsx(ProjectCard, { project: project, order: index, onOpen: () => onOpenProject(project.id) }, project.id))) }) }));
}
