import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
const fillValidForm = async (user) => {
    await user.type(screen.getByLabelText('Name'), 'Priya Raman');
    await user.type(screen.getByLabelText('Email'), 'priya@example.com');
    await user.type(screen.getByLabelText('Message'), 'We are hiring a senior frontend engineer for a real-time logistics dashboard. Would you be open to a call?');
};
describe('ContactForm', () => {
    const originalFetch = global.fetch;
    afterEach(() => {
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });
    it('renders accessible, labelled fields', () => {
        render(_jsx(ContactForm, {}));
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
    });
    it('blocks submission and reports errors for empty input', async () => {
        const user = userEvent.setup();
        const fetchSpy = jest.fn();
        global.fetch = fetchSpy;
        render(_jsx(ContactForm, {}));
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
        expect(screen.getByText(/email address looks incomplete/i)).toBeInTheDocument();
        expect(fetchSpy).not.toHaveBeenCalled();
    });
    it('marks invalid fields with aria-invalid for assistive tech', async () => {
        const user = userEvent.setup();
        render(_jsx(ContactForm, {}));
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        await waitFor(() => {
            expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
        });
    });
    it('clears a field error once the user starts correcting it', async () => {
        const user = userEvent.setup();
        render(_jsx(ContactForm, {}));
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        await screen.findByText(/please enter your name/i);
        await user.type(screen.getByLabelText('Name'), 'A');
        await waitFor(() => {
            expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
        });
    });
    it('submits valid input and shows the success state', async () => {
        const user = userEvent.setup();
        const fetchSpy = jest.fn().mockResolvedValue({ ok: true, status: 200 });
        global.fetch = fetchSpy;
        render(_jsx(ContactForm, {}));
        await fillValidForm(user);
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        expect(await screen.findByText('Message sent.')).toBeInTheDocument();
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        const [url, init] = fetchSpy.mock.calls[0];
        expect(url).toBe('/');
        expect(init.method).toBe('POST');
        // The body is urlencoded for Netlify Forms, not a stringified object.
        const params = new URLSearchParams(typeof init.body === 'string' ? init.body : '');
        expect(params.get('form-name')).toBe('contact');
        expect(params.get('email')).toBe('priya@example.com');
        expect(params.get('message')).toContain('real-time logistics');
    });
    it('offers a mailto recovery path when the request fails', async () => {
        const user = userEvent.setup();
        global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
        render(_jsx(ContactForm, {}));
        await fillValidForm(user);
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/could not reach the server/i);
        const recovery = screen.getByRole('link', { name: /send this as an email instead/i });
        expect(recovery).toHaveAttribute('href', expect.stringContaining('mailto:'));
        // The recovery link preserves what the user typed.
        expect(recovery.getAttribute('href')).toContain(encodeURIComponent('real-time logistics'));
    });
    it('keeps the honeypot out of the accessibility tree', () => {
        const { container } = render(_jsx(ContactForm, {}));
        const honeypot = container.querySelector('input[name="company"]');
        expect(honeypot).not.toBeNull();
        expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
        expect(honeypot).toHaveAttribute('tabindex', '-1');
    });
});
