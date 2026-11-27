import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Declarative wrapper for the `.reveal` progressive-enhancement
 * pattern. No observers are spun up per element: a single observer is
 * created by the parent section's `useReveal` and picks these up.
 */
export default function Reveal({ children, order = 0, as: Tag = 'div', className = '', style, }) {
    return (_jsx(Tag, { className: `reveal ${className}`.trim(), style: { '--reveal-delay': `${order * 55}ms`, ...style }, children: children }));
}
