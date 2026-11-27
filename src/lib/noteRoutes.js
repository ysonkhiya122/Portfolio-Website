import { notes } from '@/content/notes';
export const notePath = (slug) => `/notes/${slug}/`;
/**
 * Resolves the current page from `location.pathname`.
 * Kept pure so it can be unit-tested without a browser.
 */
export function noteSlugFromPath(pathname) {
    const match = /^\/notes\/([a-z0-9-]+)\/?$/.exec(pathname);
    if (!match?.[1])
        return null;
    const slug = match[1];
    return notes.some((note) => note.slug === slug) ? slug : null;
}
export const sortedNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date));
