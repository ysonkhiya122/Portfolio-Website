import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import styles from './CaseStudyDialog.module.scss';
/**
 * Native <dialog> in modal mode.
 *
 * The platform handles inertness of the rest of the page, focus
 * restoration on close, Escape, and the top layer. This component no
 * longer implements its own Tab trap: `showModal()` already does it, and
 * a second trap fighting the first is how focus bugs happen.
 */
export default function CaseStudyDialog({ project, onClose }) {
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog)
            return;
        if (project && !dialog.open) {
            dialog.showModal();
            // Move focus to the close control, not the container.
            closeRef.current?.focus();
            lockScroll();
        }
        else if (!project && dialog.open) {
            dialog.close();
            unlockScroll();
        }
    }, [project]);
    // Belt and braces: if the browser closes the dialog itself (Escape),
    // keep React state in sync.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog)
            return;
        const handle = () => {
            unlockScroll();
            onClose();
        };
        dialog.addEventListener('cancel', handle);
        return () => dialog.removeEventListener('cancel', handle);
    }, [onClose]);
    // Release the lock if the component unmounts while open.
    useEffect(() => () => unlockScroll(), []);
    if (typeof document === 'undefined')
        return null;
    return createPortal(_jsx("dialog", { ref: dialogRef, className: styles.dialog, "aria-labelledby": "case-study-title", children: project && (_jsxs("article", { className: styles.content, children: [_jsxs("header", { className: styles.header, children: [_jsxs("div", { children: [_jsxs("p", { className: styles.eyebrow, children: ["Case study \u00B7 ", project.timeframe, " \u00B7 ", project.role] }), _jsx("h2", { id: "case-study-title", className: styles.title, children: project.name }), _jsx("p", { className: styles.headline, children: project.headline })] }), _jsx("button", { ref: closeRef, type: "button", className: styles.close, onClick: onClose, "aria-label": "Close case study", children: _jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: _jsx("path", { d: "M2 2l10 10M12 2L2 12", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }) })] }), _jsxs("section", { className: styles.block, children: [_jsx("h3", { className: styles.blockTitle, children: "The problem" }), _jsx("p", { className: styles.body, children: project.context })] }), _jsxs("section", { className: styles.block, children: [_jsx("h3", { className: styles.blockTitle, children: "Decisions and trade-offs" }), _jsx("ul", { className: styles.decisions, children: project.decisions.map((decision) => (_jsx("li", { className: styles.decision, children: decision }, decision.slice(0, 28)))) })] }), _jsxs("section", { className: styles.block, children: [_jsx("h3", { className: styles.blockTitle, children: "Outcome" }), _jsx("dl", { className: styles.impact, children: project.impact.map((metric) => (_jsxs("div", { className: styles.impactItem, children: [_jsx("dt", { className: styles.impactLabel, children: metric.label }), _jsx("dd", { className: styles.impactValue, children: metric.value }), _jsxs("p", { className: styles.impactSource, children: ["Source: ", metric.source] })] }, metric.label))) })] }), _jsxs("section", { className: styles.block, children: [_jsx("h3", { className: styles.blockTitle, children: "Stack" }), _jsx("ul", { className: styles.stack, children: project.stack.map((tech) => (_jsx("li", { className: "chip", children: tech }, tech))) }), project.notes && _jsx("p", { className: styles.notes, children: project.notes })] }), _jsxs("footer", { className: styles.footer, children: [project.links
                            .filter((link) => link.kind !== 'case-study')
                            .map((link) => (_jsx("a", { href: link.href, target: "_blank", rel: "noopener noreferrer", className: "btn btn--ghost", children: link.label }, link.href))), _jsx("button", { type: "button", className: "btn btn--primary", onClick: onClose, children: "Close" })] })] })) }), document.body);
}
