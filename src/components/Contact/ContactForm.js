import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef, useState } from 'react';
import { site } from '@/content/site';
import styles from './ContactForm.module.scss';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MAX = { name: 80, email: 120, message: 1200 };
function validate(values) {
    const errors = {};
    if (values.name.trim().length < 2)
        errors.name = 'Please enter your name.';
    if (!EMAIL_PATTERN.test(values.email.trim()))
        errors.email = 'That email address looks incomplete.';
    if (values.message.trim().length < 20)
        errors.message = 'A sentence or two about the role helps — 20 characters minimum.';
    return errors;
}
/**
 * Contact form.
 *
 * Posts to Netlify Forms (works on the current hosting with no backend
 * and no API key in the client). Validation runs on the client for
 * speed, and again server-side by Netlify. If the submission fails for
 * any reason, the user is handed a prefilled mailto: link rather than
 * a dead end.
 */
export default function ContactForm() {
    const formId = useId();
    const [values, setValues] = useState({ name: '', email: '', message: '', company: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const firstInvalidRef = useRef(null);
    const mailtoFallback = `mailto:${site.email}?subject=${encodeURIComponent(`Portfolio enquiry from ${values.name || 'a visitor'}`)}&body=${encodeURIComponent(values.message)}`;
    const update = (field) => (event) => {
        setValues((current) => ({ ...current, [field]: event.target.value }));
        if (errors[field]) {
            setErrors((current) => ({ ...current, [field]: undefined }));
        }
    };
    function handleSubmit(event) {
        void submit(event);
    }
    async function submit(event) {
        event.preventDefault();
        const nextErrors = validate(values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            firstInvalidRef.current?.focus();
            return;
        }
        setStatus('submitting');
        const form = event.currentTarget;
        const body = new URLSearchParams({
            'form-name': 'contact',
            name: values.name,
            email: values.email,
            message: values.message,
            company: values.company,
        });
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
            });
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            setStatus('success');
            setValues({ name: '', email: '', message: '', company: '' });
            form.reset();
        }
        catch {
            setStatus('error');
        }
    }
    if (status === 'success') {
        return (_jsxs("div", { className: styles.success, role: "status", children: [_jsx("p", { className: styles.successTitle, children: "Message sent." }), _jsxs("p", { className: styles.successBody, children: [site.availability.responseTime, " If it is urgent, email", ' ', _jsx("a", { href: `mailto:${site.email}`, className: styles.inlineLink, children: site.email }), ' ', "directly."] }), _jsx("button", { type: "button", className: "btn btn--ghost", onClick: () => setStatus('idle'), children: "Send another" })] }));
    }
    return (_jsxs("form", { name: "contact", method: "POST", "data-netlify": "true", "netlify-honeypot": "company", onSubmit: handleSubmit, className: styles.form, noValidate: true, "aria-labelledby": `${formId}-legend`, children: [_jsx("p", { id: `${formId}-legend`, className: styles.legend, children: "Or write to me directly \u2014 this goes to my inbox, not a void." }), _jsx("input", { type: "hidden", name: "form-name", value: "contact" }), _jsxs("p", { className: styles.honeypot, "aria-hidden": "true", children: [_jsx("label", { htmlFor: `${formId}-company`, children: "Company" }), _jsx("input", { id: `${formId}-company`, name: "company", value: values.company, onChange: update('company'), tabIndex: -1, autoComplete: "off" })] }), _jsxs("div", { className: styles.row, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: `${formId}-name`, className: styles.label, children: "Name" }), _jsx("input", { id: `${formId}-name`, name: "name", type: "text", value: values.name, onChange: update('name'), maxLength: MAX.name, autoComplete: "name", required: true, "aria-invalid": Boolean(errors.name), "aria-describedby": errors.name ? `${formId}-name-error` : undefined, className: styles.input, ref: (node) => {
                                    if (errors.name)
                                        firstInvalidRef.current = node;
                                } }), errors.name && (_jsx("p", { id: `${formId}-name-error`, className: styles.error, children: errors.name }))] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: `${formId}-email`, className: styles.label, children: "Email" }), _jsx("input", { id: `${formId}-email`, name: "email", type: "email", value: values.email, onChange: update('email'), maxLength: MAX.email, autoComplete: "email", required: true, "aria-invalid": Boolean(errors.email), "aria-describedby": errors.email ? `${formId}-email-error` : undefined, className: styles.input, ref: (node) => {
                                    if (!errors.name && errors.email)
                                        firstInvalidRef.current = node;
                                } }), errors.email && (_jsx("p", { id: `${formId}-email-error`, className: styles.error, children: errors.email }))] })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: `${formId}-message`, className: styles.label, children: "Message" }), _jsx("textarea", { id: `${formId}-message`, name: "message", rows: 5, value: values.message, onChange: update('message'), maxLength: MAX.message, required: true, "aria-invalid": Boolean(errors.message), "aria-describedby": `${formId}-message-hint${errors.message ? ` ${formId}-message-error` : ''}`, className: styles.textarea, ref: (node) => {
                            if (!errors.name && !errors.email && errors.message)
                                firstInvalidRef.current = node;
                        } }), _jsxs("div", { className: styles.fieldFoot, children: [errors.message ? (_jsx("p", { id: `${formId}-message-error`, className: styles.error, children: errors.message })) : (_jsx("p", { id: `${formId}-message-hint`, className: styles.hint, children: "Role, team, and timeline if you have them." })), _jsxs("span", { className: styles.count, "aria-hidden": "true", children: [values.message.length, "/", MAX.message] })] })] }), _jsxs("div", { className: styles.actions, children: [_jsx("button", { type: "submit", className: "btn btn--primary", disabled: status === 'submitting', children: status === 'submitting' ? 'Sending…' : 'Send message' }), _jsx("a", { href: mailtoFallback, className: "btn btn--quiet", children: "Or use your mail client" })] }), status === 'error' && (_jsxs("p", { className: styles.formError, role: "alert", children: ["The form could not reach the server.", ' ', _jsx("a", { href: mailtoFallback, className: styles.inlineLink, children: "Send this as an email instead" }), ' ', "\u2014 nothing you typed will be lost."] }))] }));
}
