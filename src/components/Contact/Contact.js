import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { site } from '@/content/site';
import { content } from '@/content';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { sectionEyebrow } from '@/content/sections';
import ContactForm from './ContactForm';
import styles from './Contact.module.scss';
const channels = [
    { id: 'email', label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { id: 'linkedin', label: 'LinkedIn', value: 'in/yash-sonkhiya', href: site.links.linkedin },
    { id: 'github', label: 'GitHub', value: '@ysonkhiya122', href: site.links.github },
];
export default function Contact() {
    return (_jsxs(Section, { id: "contact", eyebrow: sectionEyebrow('contact'), title: "Hiring for something where the frontend actually matters?", children: [_jsxs("div", { className: styles.layout, children: [_jsxs(Reveal, { className: styles.left, children: [_jsx("p", { className: styles.body, children: "I am open to senior frontend roles and to short, well-scoped contracts. Tell me what the product does and what is currently breaking, and I will tell you honestly whether I am the right person." }), _jsx("ul", { className: styles.channels, children: channels.map((channel) => (_jsx("li", { children: _jsxs("a", { href: channel.href, className: styles.channel, ...(channel.href.startsWith('http')
                                            ? { target: '_blank', rel: 'noopener noreferrer' }
                                            : {}), children: [_jsx("span", { className: styles.channelLabel, children: channel.label }), _jsx("span", { className: styles.channelValue, children: channel.value }), _jsx("span", { className: styles.channelArrow, "aria-hidden": "true", children: "\u2197" })] }) }, channel.id))) }), _jsxs("dl", { className: styles.facts, children: [_jsxs("div", { children: [_jsx("dt", { children: "Response time" }), _jsx("dd", { children: "Within one working day" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Timezone" }), _jsx("dd", { children: "IST \u00B7 overlaps EU and UK mornings" })] }), _jsxs("div", { children: [_jsx("dt", { children: "Location" }), _jsxs("dd", { children: [site.location.city, ", ", site.location.country] })] })] })] }), _jsx(Reveal, { order: 1, className: styles.right, children: _jsx(ContactForm, {}) })] }), content.faqs.length > 0 && (_jsxs(Reveal, { as: "div", order: 2, className: styles.faqs, "aria-labelledby": "faq-title", children: [_jsx("h3", { id: "faq-title", className: styles.faqTitle, children: "Questions people actually ask" }), _jsx("div", { className: styles.faqGrid, children: content.faqs.map((faq) => (_jsxs("details", { className: styles.faq, children: [_jsxs("summary", { className: styles.faqQuestion, children: [faq.question, _jsx("span", { className: styles.faqMarker, "aria-hidden": "true" })] }), _jsx("p", { className: styles.faqAnswer, children: faq.answer })] }, faq.question))) })] }))] }));
}
