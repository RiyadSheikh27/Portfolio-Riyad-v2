// src/pages/LetsTalk.jsx
// -----------------------------------------------------------------------------
// The contact page, reachable only via the Footer's "Let's talk ↗" link
// (see components/footer/Footer.jsx). Renders a small vertically-centered
// form (Name, Email/Phone, Subject, Message) that validates on submit, then POSTs
// it to CONTACT_ENDPOINT — a Netlify Function (netlify/functions/contact.mjs)
// that emails it via Gmail. Once sent, the form swaps to a success message
// and, after REDIRECT_DELAY, returns the visitor to the home page;
// if sending fails, an error shows under the button and the typed message
// is kept so nothing is lost.
// -----------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ANIMATION_DURATION } from '../constants'

// The serverless function that actually sends the email (see
// netlify/functions/contact.mjs, which declares this path).
const CONTACT_ENDPOINT = '/api/contact'

// How long (ms) the "Thanks!" message stays up before returning home — long
// enough to read it, so the visitor knows the message actually went out.
const REDIRECT_DELAY = 2500

// The "Email/Phone" field accepts either, so the visitor can say how
// they'd like to be reached. Deliberately simple checks — the server
// re-validates, so these are just for quick feedback:
//   email: one "@", no spaces, a dot in the domain
//   phone: digits with optional +, spaces, dashes, dots, parentheses, and
//          7–15 digits in total (the international range)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s\-().]+$/

function isValidContact(value) {
  const trimmed = value.trim()
  if (EMAIL_PATTERN.test(trimmed)) return true
  const digits = trimmed.replace(/\D/g, '').length
  return PHONE_PATTERN.test(trimmed) && digits >= 7 && digits <= 15
}

function LetsTalk() {
  // Each form field gets its own piece of state rather than one combined
  // object. This is a deliberate teaching choice: with independent
  // useState calls, updating one field never risks accidentally clobbering
  // the others (a common bug with a single `setState({...prev, field})`
  // object when a beginner forgets to spread `prev`). It also means each
  // input's onChange handler is a trivial one-liner.
  const [name, setName] = useState('')
  // How the visitor can be reached — an email address or a phone number.
  const [contact, setContact] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  // A hidden "honeypot" field. Real visitors never see or fill it; spam
  // bots that fill every input do, and the server then quietly drops it.
  const [website, setWebsite] = useState('')

  // True while the request is in flight: disables the button so a message
  // can't be sent twice.
  const [sending, setSending] = useState(false)

  // A message shown under the button when sending fails (network error or
  // the server rejected it), or null.
  const [sendError, setSendError] = useState(null)

  // Tracks whether the form has been successfully submitted. Once true, the
  // form itself is replaced with a success message (see the conditional
  // render at the bottom of this component). Kept separate from the field
  // state above because it represents the *form's* status, not a value the
  // user is typing into an input.
  const [submitted, setSubmitted] = useState(false)

  // Holds validation error messages, keyed by field name (e.g.
  // { name: 'Name is required' }). A single object (rather than three more
  // useState calls) is used here because errors are always read/written
  // together as a batch at submit time, unlike the field values above which
  // are updated independently on every keystroke.
  const [errors, setErrors] = useState({})

  // Framer Motion's hook for detecting the OS-level "prefers reduced
  // motion" accessibility setting. When true, we skip the animated
  // offsets/scale below so users who've asked for less motion don't get it.
  const shouldReduceMotion = useReducedMotion()

  const navigate = useNavigate()

  useEffect(() => {
    // Side effect: once the message is sent, go back to the home page after
    // a short pause. The cleanup cancels it if the visitor navigates away
    // first (e.g. clicks the logo), so it never fires on another page.
    if (!submitted) return undefined
    const timer = window.setTimeout(() => navigate('/'), REDIRECT_DELAY)
    return () => window.clearTimeout(timer)
  }, [submitted, navigate])

  async function handleSubmit(event) {
    // Prevent the browser's default full-page form submission/reload —
    // this form is handled entirely in React state.
    event.preventDefault()
    if (sending) return

    // Validate that every field is non-empty (after trimming whitespace, so
    // a field containing only spaces still counts as "empty") and that the
    // contact field looks like an email or a phone number. Collected into a single object so we can set
    // all error messages in one state update.
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required.'
    if (!contact.trim()) nextErrors.contact = 'Email/Phone is required.'
    else if (!isValidContact(contact)) nextErrors.contact = 'Please enter a valid email or phone number.'
    if (!subject.trim()) nextErrors.subject = 'Subject is required.'
    if (!message.trim()) nextErrors.message = 'Message is required.'

    setErrors(nextErrors)
    setSendError(null)

    // Object.keys(...).length === 0 is the standard way to check "is this
    // plain object empty" in JS, since objects don't have a .length.
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, subject, message, website }),
      })
      if (!response.ok) {
        // A 404 means the email function isn't deployed at all (e.g. under
        // `npm run dev`, which doesn't run Netlify Functions).
        if (response.status === 404) {
          throw new Error('The contact service is unavailable right now. Please try again later.')
        }
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Could not send the message.')
      }
      setSubmitted(true)
    } catch (error) {
      setSendError(
        error instanceof TypeError
          ? 'Network error — please check your connection and try again.'
          : error.message,
      )
    } finally {
      setSending(false)
    }
  }

  const fadeInProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: ANIMATION_DURATION },
      }

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      {submitted ? (
        // Success state: shown instead of the form once all fields pass
        // validation. Animated in with a gentle scale + fade, per the
        // animation spec, and also respects prefers-reduced-motion.
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: ANIMATION_DURATION }}
          className="max-w-sm text-center"
        >
          <p className="text-sm text-chalk">
            Thanks! I&apos;ll get back to you soon.
          </p>
          <p className="mt-2 text-xs text-chalk-faint">Taking you back home…</p>
        </motion.div>
      ) : (
        <motion.form
          {...fadeInProps}
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-sm space-y-5"
        >
          <div className="space-y-1">
            <h1 className="text-lg font-medium text-chalk">Let&apos;s talk</h1>
            <p className="text-sm text-chalk-dim">
              Tell me a bit about what you have in mind.
            </p>
          </div>

          {/* Name field: a controlled input — its value always comes from
              React state (`name`), and every keystroke updates that state
              via onChange. This is the standard React pattern for forms:
              the DOM never holds the source of truth, the state does. */}
          <div>
            <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-widest text-chalk-dim">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-red"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red">{errors.name}</p>
            )}
          </div>

          {/* Email/Phone field: same controlled-input pattern as Name.
              Plain type="text" (not "email"/"tel") because it accepts
              either; validation happens in handleSubmit above. Only used
              to know who wrote and how to reply — the email itself is
              always sent from the site's own address. */}
          <div>
            <label htmlFor="contact" className="mb-1 block text-xs uppercase tracking-widest text-chalk-dim">
              Email/Phone
            </label>
            <input
              id="contact"
              type="text"
              autoComplete="email"
              maxLength={200}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-red"
            />
            {errors.contact && (
              <p className="mt-1 text-xs text-red">{errors.contact}</p>
            )}
          </div>

          {/* Subject field: same controlled pattern. Becomes the email's
              subject line (prefixed with "[Portfolio]" by the server). */}
          <div>
            <label htmlFor="subject" className="mb-1 block text-xs uppercase tracking-widest text-chalk-dim">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              maxLength={150}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-red"
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red">{errors.subject}</p>
            )}
          </div>

          {/* Message field: same controlled pattern, using a textarea
              instead of an input so longer messages have room to be typed
              and read back. */}
          <div>
            <label htmlFor="message" className="mb-1 block text-xs uppercase tracking-widest text-chalk-dim">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              maxLength={5000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full resize-none border border-border bg-transparent px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-red"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red">{errors.message}</p>
            )}
          </div>

          {/* Honeypot — visually hidden and skipped by keyboard/screen
              readers, so only bots fill it in. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="hidden"
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full border border-red bg-red/10 py-2 text-sm font-medium text-chalk transition-colors hover:bg-red/20 disabled:cursor-wait disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send Message'}
          </button>
          {sendError && (
            <p role="alert" className="text-center text-xs text-red">
              {sendError}
            </p>
          )}
        </motion.form>
      )}
    </div>
  )
}

export default LetsTalk
