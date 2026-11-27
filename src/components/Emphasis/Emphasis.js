import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment } from 'react';
/**
 * Renders a string containing **bold** markers as React nodes,
 * replacing the previous dangerouslySetInnerHTML approach.
 * "a **b** c" -> a <strong>b</strong> c
 */
export default function Emphasis({ text }) {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return (_jsx(_Fragment, { children: parts.map((part, i) => i % 2 === 1 ? (_jsx("strong", { children: part }, i)) : (_jsx(Fragment, { children: part }, i))) }));
}
