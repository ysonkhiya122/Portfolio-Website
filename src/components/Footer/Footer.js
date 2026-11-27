import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { site } from '@/content/site';
import styles from './Footer.module.scss';
export default function Footer() {
    const year = new Date().getFullYear();
    return (_jsx("footer", { className: styles.footer, children: _jsxs("div", { className: `container ${styles.inner}`, children: [_jsxs("div", { className: styles.left, children: [_jsx("p", { className: styles.mark, children: site.initials }), _jsxs("p", { className: styles.copy, children: ["\u00A9 ", year, " ", site.name, ". Built in Delhi."] })] }), _jsxs("nav", { className: styles.links, "aria-label": "Elsewhere", children: [_jsx("a", { href: site.links.github, target: "_blank", rel: "noopener noreferrer", children: "GitHub" }), _jsx("a", { href: site.links.linkedin, target: "_blank", rel: "noopener noreferrer", children: "LinkedIn" }), _jsx("a", { href: `mailto:${site.email}`, children: "Email" }), _jsx("a", { href: "/yash-sonkhiya-cv.pdf", children: "CV" })] }), _jsx("p", { className: styles.stack, children: "React 18 \u00B7 TypeScript \u00B7 Vite 7 \u00B7 no UI kit" })] }) }));
}
