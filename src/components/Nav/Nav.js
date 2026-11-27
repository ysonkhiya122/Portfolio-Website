import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import styles from './Nav.module.scss';
const LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Notes', href: '#notes' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
];
const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const buttonRef = useRef(null);
    // Condense the bar after the fold. rAF-throttled, passive listener.
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(() => {
                setScrolled(window.scrollY > 24);
                ticking = false;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    // Highlight the section currently in view — the thing a one-page
    // site is missing most often.
    useEffect(() => {
        const sections = LINKS.map((link) => document.querySelector(link.href)).filter((node) => node !== null);
        if (sections.length === 0)
            return;
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            const top = visible.at(0);
            if (top !== undefined)
                setActiveSection(`#${top.target.id}`);
        }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] });
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);
    // Mobile menu: lock scroll, trap nothing (it is a disclosure, not a
    // dialog), close on Escape and return focus to the trigger.
    useEffect(() => {
        if (!menuOpen)
            return;
        const onKey = (event) => {
            if (event.key !== 'Escape')
                return;
            setMenuOpen(false);
            buttonRef.current?.focus();
        };
        lockScroll();
        window.addEventListener('keydown', onKey);
        return () => {
            unlockScroll();
            window.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);
    const go = (href) => (event) => {
        const target = document.querySelector(href);
        if (!target)
            return;
        event.preventDefault();
        setMenuOpen(false);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', href);
        target.focus({ preventScroll: true });
    };
    return (_jsxs("header", { className: styles.header, "data-scrolled": scrolled || undefined, "data-open": menuOpen || undefined, children: [_jsxs("div", { className: `container ${styles.bar}`, children: [_jsxs("a", { href: "#top", className: styles.brand, onClick: go('#top'), children: [_jsx("span", { className: styles.brandMark, "aria-hidden": "true", children: site.initials }), _jsxs("span", { className: styles.brandName, children: [site.name, _jsx("span", { className: "sr-only", children: " \u2014 back to top" })] })] }), _jsx("nav", { className: styles.nav, "aria-label": "Primary", children: _jsx("ul", { className: styles.links, children: LINKS.map((link) => (_jsx("li", { children: _jsx("a", { href: link.href, onClick: go(link.href), className: styles.link, "aria-current": activeSection === link.href ? 'true' : undefined, children: link.label }) }, link.href))) }) }), _jsxs("div", { className: styles.actions, children: [_jsxs("button", { type: "button", className: styles.paletteHint, onClick: () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })), children: [_jsx("span", { className: "sr-only", children: "Open command palette " }), _jsx("kbd", { children: IS_MAC ? '⌘' : 'Ctrl' }), _jsx("kbd", { children: "K" })] }), _jsx("a", { href: "#contact", className: `btn btn--primary ${styles.cta}`, onClick: go('#contact'), children: "Hire me" }), _jsx("button", { ref: buttonRef, type: "button", className: styles.menuButton, "aria-expanded": menuOpen, "aria-controls": "mobile-menu", "aria-label": menuOpen ? 'Close menu' : 'Open menu', onClick: () => setMenuOpen((open) => !open), children: _jsxs("span", { className: styles.menuBars, "aria-hidden": "true", children: [_jsx("span", {}), _jsx("span", {})] }) })] })] }), _jsxs("div", { id: "mobile-menu", className: styles.mobileMenu, hidden: !menuOpen, children: [_jsx("ul", { className: styles.mobileLinks, children: LINKS.map((link, index) => (_jsx("li", { style: { '--i': index }, children: _jsxs("a", { href: link.href, onClick: go(link.href), children: [_jsxs("span", { className: styles.mobileIndex, "aria-hidden": "true", children: ["0", index + 1] }), link.label] }) }, link.href))) }), _jsxs("div", { className: styles.mobileFoot, children: [_jsx("a", { href: `mailto:${site.email}`, className: styles.mobileMail, children: site.email }), _jsx("p", { className: styles.mobileNote, children: site.availability.status })] })] })] }));
}
