import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useReveal } from '@/hooks/useReveal';
import { achievements } from '@/data/portfolio';
import styles from './Achievements.module.scss';
export default function Achievements() {
    const sectionRef = useReveal();
    return (_jsx("section", { id: "achievements", className: `section-base ${styles.achievements}`, ref: sectionRef, children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-header", children: [_jsx("span", { className: "section-header__index", children: "05" }), _jsx("h2", { className: "section-header__title", children: "Recognition" })] }), _jsx("div", { className: styles.list, children: achievements.map((item, i) => (_jsxs("div", { className: `reveal ${styles.item}`, style: { transitionDelay: `${i * 0.05}s` }, children: [_jsx("div", { className: styles.icon, "aria-hidden": "true", children: item.icon }), _jsxs("div", { className: styles.content, children: [_jsx("p", { className: styles.title, children: item.title }), _jsx("p", { className: styles.subtitle, children: item.subtitle })] })] }, item.id))) })] }) }));
}
