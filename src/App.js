import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import Nav from '@/components/Nav/Nav';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Notes from '@/components/Notes/Notes';
import Projects from '@/components/Projects/Projects';
import Experience from '@/components/Experience/Experience';
import Skills from '@/components/Skills/Skills';
import Recognition from '@/components/Recognition/Recognition';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import CaseStudyDialog from '@/components/CaseStudyDialog/CaseStudyDialog';
import { content } from '@/content';
import { caseStudyIdFromHash, pushCaseStudy, replaceWithWork } from '@/lib/caseStudyRoute';
// The palette is idle until invoked — keep it out of the critical path.
const CommandPalette = lazy(() => import('@/components/CommandPalette/CommandPalette'));
const isKnownProject = (id) => id !== null && content.projects.some((project) => project.id === id);
export default function App() {
    // Hydrate from the URL so a shared link opens the case study on a cold
    // load — not just when it is clicked from within the page.
    const [caseStudyId, setCaseStudyId] = useState(() => isKnownProject(caseStudyIdFromHash(window.location.hash))
        ? caseStudyIdFromHash(window.location.hash)
        : null);
    const activeProject = content.projects.find((project) => project.id === caseStudyId) ?? null;
    const openProject = useCallback((id) => {
        setCaseStudyId(id);
        pushCaseStudy(id);
    }, []);
    const closeProject = useCallback(() => {
        setCaseStudyId(null);
        // replace, not push: closing should not add a history entry, it should
        // return the URL to the section it came from.
        replaceWithWork();
    }, []);
    // Keep React state in step with the URL. This covers the browser Back and
    // Forward buttons, a pasted deep link, and the nav's section links.
    useEffect(() => {
        const sync = () => {
            const id = caseStudyIdFromHash(window.location.hash);
            setCaseStudyId(isKnownProject(id) ? id : null);
        };
        window.addEventListener('hashchange', sync);
        window.addEventListener('popstate', sync);
        return () => {
            window.removeEventListener('hashchange', sync);
            window.removeEventListener('popstate', sync);
        };
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("a", { href: "#main", className: "skip-link", children: "Skip to content" }), _jsx(Nav, {}), _jsxs("main", { id: "main", tabIndex: -1, children: [_jsx("div", { id: "top" }), _jsx(Hero, {}), _jsx(About, {}), _jsx(Projects, { onOpenProject: openProject }), _jsx(Notes, {}), _jsx(Experience, {}), _jsx(Skills, {}), _jsx(Recognition, {}), _jsx(Contact, {})] }), _jsx(Footer, {}), _jsx(CaseStudyDialog, { project: activeProject, onClose: closeProject }), _jsx(Suspense, { fallback: null, children: _jsx(CommandPalette, { onOpenProject: openProject }) })] }));
}
