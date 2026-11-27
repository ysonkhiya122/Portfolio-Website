import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { about } from '@/content';
import { tenurePhrase } from '@/content/derived';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { sectionEyebrow } from '@/content/sections';
import styles from './About.module.scss';
export default function About() {
    return (_jsx(Section, { id: "about", eyebrow: sectionEyebrow('about'), title: "Not a list of frameworks.", children: _jsxs("div", { className: styles.grid, children: [_jsxs(Reveal, { order: 1, className: styles.prose, children: [_jsx("p", { className: styles.opener, children: about.opener.replace('{YEARS}', tenurePhrase()) }), about.paragraphs.map((paragraph) => (_jsx("p", { children: paragraph }, paragraph.slice(0, 32))))] }), _jsxs(Reveal, { order: 2, className: styles.aside, as: "aside", children: [_jsx("h3", { className: styles.asideTitle, children: "How I work" }), _jsx("ol", { className: styles.principles, children: about.principles.map((principle, index) => (_jsxs("li", { className: styles.principle, children: [_jsx("span", { className: styles.principleIndex, "aria-hidden": "true", children: String(index + 1).padStart(2, '0') }), _jsxs("div", { children: [_jsx("h4", { className: styles.principleTitle, children: principle.title }), _jsx("p", { className: styles.principleBody, children: principle.body })] })] }, principle.title))) }), _jsxs("dl", { className: styles.facts, children: [_jsxs("div", { children: [_jsx("dt", { children: "Based" }), _jsxs("dd", { children: [site.location.city, ", ", site.location.region] })] }), _jsxs("div", { children: [_jsx("dt", { children: "Timezone" }), _jsx("dd", { children: "IST (UTC+5:30)" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Working style" }), _jsx("dd", { children: site.location.remoteNote })] })] })] })] }) }));
}
