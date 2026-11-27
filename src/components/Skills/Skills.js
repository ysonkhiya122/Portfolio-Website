import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { content } from '@/content';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { sectionEyebrow } from '@/content/sections';
import styles from './Skills.module.scss';
const LEVEL_LABEL = {
    expert: 'Expert',
    proficient: 'Proficient',
    working: 'Working knowledge',
};
function SkillGroupCard({ group, order }) {
    return (_jsxs(Reveal, { as: "article", order: order, className: styles.group, children: [_jsx("h3", { className: styles.groupTitle, children: group.title }), _jsx("ul", { className: styles.list, children: group.skills.map((skill) => (_jsxs("li", { className: styles.skill, children: [_jsx("span", { className: styles.skillName, children: skill.name }), _jsxs("span", { className: styles.skillLevel, "data-level": skill.level, "aria-label": `Proficiency: ${LEVEL_LABEL[skill.level]}`, children: [_jsxs("span", { className: styles.bars, "aria-hidden": "true", children: [_jsx("span", { "data-on": skill.level !== 'working' }), _jsx("span", { "data-on": skill.level === 'proficient' || skill.level === 'expert' }), _jsx("span", { "data-on": skill.level === 'expert' })] }), _jsx("span", { className: styles.skillYears, children: skill.years ? `${skill.years}y` : LEVEL_LABEL[skill.level] })] })] }, skill.name))) })] }));
}
export default function Skills() {
    return (_jsx(Section, { id: "skills", eyebrow: sectionEyebrow('skills'), title: "What I actually reach for.", description: "Levelled honestly. \u201CWorking knowledge\u201D means I have shipped with it and would ask questions before architecting around it \u2014 which is more useful to you than a wall of logos.", children: _jsx("div", { className: styles.grid, children: content.skillGroups.map((group, index) => (_jsx(SkillGroupCard, { group: group, order: index }, group.id))) }) }));
}
