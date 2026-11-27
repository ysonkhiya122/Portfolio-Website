import { useId, useRef, useState } from 'react'
import { site } from '@/content/site'
import styles from './ContactForm.module.scss'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
const MAX = { name: 80, email: 120, message: 1200 }

function validate(values: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = 'That email address looks incomplete.'
  if (values.message.trim().length < 20)
    errors.message = 'A sentence or two about the role helps — 20 characters minimum.'
  return errors
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
  const formId = useId()
  const [values, setValues] = useState({ name: '', email: '', message: '', company: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const firstInvalidRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const mailtoFallback = `mailto:${site.email}?subject=${encodeURIComponent(
    `Portfolio enquiry from ${values.name || 'a visitor'}`,
  )}&body=${encodeURIComponent(values.message)}`

  const update =
    (field: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      if (errors[field as keyof FieldErrors]) {
        setErrors((current) => ({ ...current, [field]: undefined }))
      }
    }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    void submit(event)
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      firstInvalidRef.current?.focus()
      return
    }

    setStatus('submitting')
    const form = event.currentTarget
    const body = new URLSearchParams({
      'form-name': 'contact',
      name: values.name,
      email: values.email,
      message: values.message,
      company: values.company,
    })

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('success')
      setValues({ name: '', email: '', message: '', company: '' })
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successTitle}>Message sent.</p>
        <p className={styles.successBody}>
          {site.availability.responseTime} If it is urgent, email{' '}
          <a href={`mailto:${site.email}`} className={styles.inlineLink}>
            {site.email}
          </a>{' '}
          directly.
        </p>
        <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>
          Send another
        </button>
      </div>
    )
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="company"
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
      aria-labelledby={`${formId}-legend`}
    >
      <p id={`${formId}-legend`} className={styles.legend}>
        Or write to me directly — this goes to my inbox, not a void.
      </p>

      {/* Netlify needs a hidden input to register the form fields. */}
      <input type="hidden" name="form-name" value="contact" />

      {/* Honeypot: hidden from humans, irresistible to bots. */}
      <p className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          value={values.company}
          onChange={update('company')}
          tabIndex={-1}
          autoComplete="off"
        />
      </p>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`} className={styles.label}>
            Name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            value={values.name}
            onChange={update('name')}
            maxLength={MAX.name}
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className={styles.input}
            ref={(node) => {
              if (errors.name) firstInvalidRef.current = node
            }}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className={styles.error}>
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-email`} className={styles.label}>
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            value={values.email}
            onChange={update('email')}
            maxLength={MAX.email}
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            className={styles.input}
            ref={(node) => {
              if (!errors.name && errors.email) firstInvalidRef.current = node
            }}
          />
          {errors.email && (
            <p id={`${formId}-email-error`} className={styles.error}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-message`} className={styles.label}>
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          value={values.message}
          onChange={update('message')}
          maxLength={MAX.message}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${formId}-message-hint${errors.message ? ` ${formId}-message-error` : ''}`}
          className={styles.textarea}
          ref={(node) => {
            if (!errors.name && !errors.email && errors.message) firstInvalidRef.current = node
          }}
        />
        <div className={styles.fieldFoot}>
          {errors.message ? (
            <p id={`${formId}-message-error`} className={styles.error}>
              {errors.message}
            </p>
          ) : (
            <p id={`${formId}-message-hint`} className={styles.hint}>
              Role, team, and timeline if you have them.
            </p>
          )}
          <span className={styles.count} aria-hidden="true">
            {values.message.length}/{MAX.message}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn--primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>
        <a href={mailtoFallback} className="btn btn--quiet">
          Or use your mail client
        </a>
      </div>

      {status === 'error' && (
        <p className={styles.formError} role="alert">
          The form could not reach the server.{' '}
          <a href={mailtoFallback} className={styles.inlineLink}>
            Send this as an email instead
          </a>{' '}
          — nothing you typed will be lost.
        </p>
      )}
    </form>
  )
}
