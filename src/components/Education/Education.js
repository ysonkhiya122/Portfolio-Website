import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useReveal } from '@/hooks/useReveal';
import { education } from '@/data/portfolio';
import styles from './Education.module.scss';
export default function Education() {
    const sectionRef = useReveal();
    return (_jsx("section", { id: "education", className: `section-base ${styles.education}`, ref: sectionRef, children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-header", children: [_jsx("span", { className: "section-header__index", children: "06" }), _jsx("h2", { className: "section-header__title", children: "Education" })] }), _jsx("div", { className: styles.list, children: education.map((item, i) => (_jsxs("div", { className: `reveal ${styles.item}`, style: { transitionDelay: `${i * 0.08}s` }, children: [_jsx("p", { className: styles.year, children: item.period }), _jsxs("div", { className: styles.content, children: [_jsx("h3", { className: styles.degree, children: item.degree }), _jsx("p", { className: styles.institution, children: item.institution }), _jsx("p", { className: styles.location, children: item.location })] })] }, item.id))) })] }) }));
}
