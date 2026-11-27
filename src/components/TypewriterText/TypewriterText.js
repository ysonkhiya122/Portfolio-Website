import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import styles from './TypewriterText.module.scss';
export default function TypewriterText({ phrases, typingSpeed = 60, deletingSpeed = 30, pauseDuration = 1800, className = '', }) {
    const [displayed, setDisplayed] = useState('');
    const [phase, setPhase] = useState('typing');
    const phraseIdx = useRef(0);
    const charIdx = useRef(0);
    const reducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useEffect(() => {
        if (reducedMotion)
            return;
        const current = phrases[phraseIdx.current];
        if (phase === 'typing') {
            if (charIdx.current < current.length) {
                const t = setTimeout(() => {
                    setDisplayed(current.slice(0, charIdx.current + 1));
                    charIdx.current++;
                }, typingSpeed);
                return () => clearTimeout(t);
            }
            else {
                const t = setTimeout(() => setPhase('pausing'), pauseDuration);
                return () => clearTimeout(t);
            }
        }
        if (phase === 'pausing') {
            setPhase('deleting');
        }
        if (phase === 'deleting') {
            if (charIdx.current > 0) {
                const t = setTimeout(() => {
                    charIdx.current--;
                    setDisplayed(current.slice(0, charIdx.current));
                }, deletingSpeed);
                return () => clearTimeout(t);
            }
            else {
                phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
                setPhase('typing');
            }
        }
    }, [phase, displayed, phrases, typingSpeed, deletingSpeed, pauseDuration, reducedMotion]);
    // Static fallback for users who prefer reduced motion.
    if (reducedMotion) {
        return _jsx("span", { className: `${styles.wrapper} ${className}`, children: phrases[0] });
    }
    return (_jsxs("span", { className: `${styles.wrapper} ${className}`, children: [_jsx("span", { className: "sr-only", children: phrases[0] }), _jsxs("span", { "aria-hidden": "true", children: [displayed, _jsx("span", { className: styles.caret })] })] }));
}
