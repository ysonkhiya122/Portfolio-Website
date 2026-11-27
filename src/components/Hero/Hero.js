import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { site } from '@/content/site';
import { promotionPhrase } from '@/content/derived';
import { heroStats } from '@/content/portfolio';
import styles from './Hero.module.scss';
function ArrowUpRight() {
    return (_jsx("svg", { width: "13", height: "13", viewBox: "0 0 13 13", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M3.5 9.5 9.5 3.5M9.5 3.5H4.6M9.5 3.5v4.9", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
export default function Hero() {
    const scrollTo = (id) => (event) => {
        const target = document.querySelector(id);
        if (!target)
            return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Keep the URL and the focus ring honest for keyboard users.
        history.replaceState(null, '', id);
        target.focus({ preventScroll: true });
    };
    return (_jsxs("section", { className: styles.hero, "aria-labelledby": "hero-title", children: [_jsxs("div", { className: `container ${styles.inner}`, children: [_jsx("div", { className: styles.top, children: _jsxs("p", { className: styles.eyebrow, children: [_jsx("span", { className: styles.statusDot, "aria-hidden": "true" }), site.availability.status, _jsx("span", { className: styles.sep, "aria-hidden": "true", children: "/" }), _jsxs("span", { className: styles.loc, children: [site.location.city, ", IN \u00B7 remote-friendly"] })] }) }), _jsxs("h1", { id: "hero-title", className: styles.title, children: [_jsx("span", { className: styles.titleName, children: site.name }), _jsxs("span", { className: styles.titleRole, children: [site.roleLong, _jsx("span", { className: styles.cursor, "aria-hidden": "true", children: "_" })] })] }), _jsxs("p", { className: styles.lede, children: ["I build the interfaces people depend on when downtime is not an option: real-time dispatch for ", _jsx("strong", { children: "seven European markets" }), ", enterprise dashboards, and internal tools that replace a spreadsheet nobody trusts.", _jsxs("span", { className: styles.ledeSub, children: [' ', "Promoted to senior within ", promotionPhrase(), " of joining. Currently taking the frontend of", ' ', heroStats.find((stat) => stat.label === 'Apps owned in prod')?.value ?? 'four', ' ', "production applications from React 16 to 19 without a single regression."] })] }), _jsxs("div", { className: styles.actions, children: [_jsx("a", { href: "#work", className: "btn btn--primary", onClick: scrollTo('#work'), children: "View case studies" }), _jsx("a", { href: "#contact", className: "btn btn--ghost", onClick: scrollTo('#contact'), children: "Get in touch" }), _jsxs("a", { href: site.links.github, className: "btn btn--ghost", target: "_blank", rel: "noopener noreferrer", children: ["GitHub ", _jsx(ArrowUpRight, {})] })] }), _jsx("dl", { className: styles.stats, children: heroStats.map((stat) => (_jsxs("div", { className: styles.stat, children: [_jsx("dt", { className: styles.statLabel, children: stat.label }), _jsxs("dd", { className: styles.statValue, children: [stat.value, _jsx("span", { className: styles.statSuffix, children: stat.suffix })] })] }, stat.label))) })] }), _jsxs("a", { href: "#about", className: styles.scrollCue, onClick: scrollTo('#about'), children: [_jsx("span", { className: "sr-only", children: "Scroll to the about section" }), _jsx("span", { className: styles.scrollCueLabel, "aria-hidden": "true", children: "scroll" }), _jsx("span", { className: styles.scrollCueLine, "aria-hidden": "true" })] })] }));
}
