import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from 'react';
import styles from './CustomCursor.module.scss';
const INTERACTIVE = 'a, button, [data-cursor-hover]';
/**
 * Custom cursor. Renders nothing on touch devices or when the user
 * prefers reduced motion. Uses event delegation (one document-level
 * listener pair) instead of per-element listeners, and marks <html>
 * with .has-custom-cursor so CSS only hides the native cursor once
 * the component is actually live.
 */
export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const pos = useRef({ x: -100, y: -100 });
    const ring = useRef({ x: -100, y: -100 });
    const rafId = useRef(0);
    const running = useRef(false);
    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = useCallback(() => {
        ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
        ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
        if (dotRef.current) {
            dotRef.current.style.transform =
                `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
        }
        if (ringRef.current) {
            ringRef.current.style.transform =
                `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
        }
        // Park the loop once the ring has caught up with the pointer.
        const dx = Math.abs(ring.current.x - pos.current.x);
        const dy = Math.abs(ring.current.y - pos.current.y);
        if (dx < 0.1 && dy < 0.1) {
            running.current = false;
            return;
        }
        rafId.current = requestAnimationFrame(animate);
    }, []);
    const wake = useCallback(() => {
        if (!running.current) {
            running.current = true;
            rafId.current = requestAnimationFrame(animate);
        }
    }, [animate]);
    useEffect(() => {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!finePointer.matches || reducedMotion.matches)
            return;
        document.documentElement.classList.add('has-custom-cursor');
        const setHover = (hovered) => {
            dotRef.current?.classList.toggle(styles.hovered, hovered);
            ringRef.current?.classList.toggle(styles.hovered, hovered);
        };
        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
            wake();
        };
        // Event delegation — no MutationObserver, no per-element listeners.
        const onOver = (e) => {
            if (e.target.closest?.(INTERACTIVE))
                setHover(true);
        };
        const onOut = (e) => {
            const from = e.target.closest?.(INTERACTIVE);
            const to = e.relatedTarget?.closest?.(INTERACTIVE);
            if (from && !to)
                setHover(false);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseover', onOver, { passive: true });
        document.addEventListener('mouseout', onOut, { passive: true });
        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
            cancelAnimationFrame(rafId.current);
        };
    }, [wake]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: ringRef, className: styles.ring, "aria-hidden": "true" }), _jsx("div", { ref: dotRef, className: styles.dot, "aria-hidden": "true" })] }));
}
