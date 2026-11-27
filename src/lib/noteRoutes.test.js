import { notePath, noteSlugFromPath, sortedNotes } from './noteRoutes';
describe('noteSlugFromPath', () => {
    it('extracts a known slug from a note path', () => {
        expect(noteSlugFromPath('/notes/one-signalr-connection/')).toBe('one-signalr-connection');
    });
    it('accepts the path without a trailing slash', () => {
        expect(noteSlugFromPath('/notes/one-signalr-connection')).toBe('one-signalr-connection');
    });
    it('returns null for the home page', () => {
        expect(noteSlugFromPath('/')).toBeNull();
    });
    it('returns null for a slug that does not exist', () => {
        expect(noteSlugFromPath('/notes/not-a-real-note/')).toBeNull();
    });
    it('returns null for a nested path rather than guessing', () => {
        expect(noteSlugFromPath('/notes/one-signalr-connection/extra/')).toBeNull();
    });
    it('rejects path traversal attempts', () => {
        expect(noteSlugFromPath('/notes/../../etc/passwd')).toBeNull();
    });
});
describe('notePath', () => {
    it('round-trips with the parser', () => {
        expect(noteSlugFromPath(notePath('react-16-to-19-by-route'))).toBe('react-16-to-19-by-route');
    });
});
describe('sortedNotes', () => {
    it('is ordered newest first', () => {
        const dates = sortedNotes.map((note) => note.date);
        expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
    });
    it('has no duplicate slugs', () => {
        const slugs = sortedNotes.map((note) => note.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });
    it('every note is long enough to be worth publishing', () => {
        for (const note of sortedNotes) {
            expect(note.body.length).toBeGreaterThanOrEqual(4);
            expect(note.summary.length).toBeGreaterThan(60);
            expect(note.tags.length).toBeGreaterThan(0);
        }
    });
});
