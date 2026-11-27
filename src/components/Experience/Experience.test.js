import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import Experience from './Experience';
import { content } from '@/content';
import { formatRange } from '@/lib/format';
describe('Experience', () => {
    it('renders each role as a heading', () => {
        render(_jsx(Experience, {}));
        for (const entry of content.experience) {
            expect(screen.getByRole('heading', { name: entry.role })).toBeInTheDocument();
        }
    });
    it('formats dates from data rather than a hardcoded string', () => {
        render(_jsx(Experience, {}));
        for (const entry of content.experience) {
            expect(screen.getByText(formatRange(entry.start, entry.end))).toBeInTheDocument();
        }
    });
    it('shows "Present" only for the open-ended role', () => {
        render(_jsx(Experience, {}));
        const present = screen.getAllByText(/— Present/);
        expect(present).toHaveLength(1);
    });
    it('surfaces the promotion as a distinct marker', () => {
        render(_jsx(Experience, {}));
        expect(screen.getByText(/promoted to senior/i)).toBeInTheDocument();
    });
    it('names the employer', () => {
        const { container } = render(_jsx(Experience, {}));
        const [first] = content.experience;
        expect(container.textContent).toContain(first?.company ?? '');
    });
});
