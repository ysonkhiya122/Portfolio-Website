import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useReveal } from '@/hooks/useReveal';
/**
 * The one section shell.
 *
 * It exists for three reasons:
 *
 * 1. `tabIndex={-1}` makes the section programmatically focusable, so
 *    in-page links can move *focus* and not just scroll position.
 *    Previously nav links called `.focus()` on a plain <section>, which
 *    silently did nothing and dropped keyboard users' focus to <body>.
 * 2. The reveal observer lives here, so nine sections register one each
 *    instead of every component re-implementing the pattern.
 * 3. Numbering, spacing and the header rhythm are defined once.
 */
export default function Section({ id, eyebrow, title, description, children, className = '', headerAside, }) {
    const ref = useReveal();
    return (_jsx("section", { id: id, ref: ref, tabIndex: -1, "aria-labelledby": `${id}-title`, className: `section section--ruled ${className}`.trim(), children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "reveal section-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: eyebrow }), _jsx("h2", { id: `${id}-title`, className: "section-title", children: title })] }), headerAside] }), description !== undefined && (_jsx("div", { className: "reveal section-lede", children: _jsx("p", { className: "lede", children: description }) })), children] }) }));
}
