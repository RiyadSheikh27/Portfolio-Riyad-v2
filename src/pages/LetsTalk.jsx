// src/pages/LetsTalk.jsx
// -----------------------------------------------------------------------------
// The contact page, reachable only via the Footer's "Let's talk ↗" link
// (see components/footer/Footer.jsx). Renders a small vertically-centered
// form (Name, Email, Message) that validates on submit and, once valid,
// swaps to a success message. There is no backend here — this is a purely
// client-side form, useful as a teaching example of React's core patterns:
// controlled inputs, useState, and conditional rendering.
// -----------------------------------------------------------------------------
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ANIMATION_DURATION } from '../constants'

function LetsTalk() {
  // Each form field gets its own piece of state rather than one combined
  // object. This is a deliberate teaching choice: with three independent
  // useState calls, updating one field never risks accidentally clobbering
  // the others (a common bug with a single `setState({...prev, field})`
  // object when a beginner forgets to spread `prev`). It also means each
  // input's onChange handler is a trivial one-liner.
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

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

  function handleSubmit(event) {
    // Prevent the browser's default full-page form submission/reload —
    // this form is handled entirely in React state.
    event.preventDefault()

    // Validate that all three fields are non-empty (after trimming
    // whitespace, so a field containing only spaces still counts as
    // "empty"). Collected into a single object so we can set all error
    // messages in one state update instead of three separate ones.
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required.'
    if (!email.trim()) nextErrors.email = 'Email is required.'
    if (!message.trim()) nextErrors.message = 'Message is required.'

    setErrors(nextErrors)

    // Only mark the form as submitted if validation produced no errors.
    // Object.keys(...).length === 0 is the standard way to check "is this
    // plain object empty" in JS, since objects don't have a .length.
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
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

          {/* Email field: same controlled-input pattern as Name. Uses
              type="email" for a small UX win (mobile keyboards, basic
              browser format hinting) but real validation still happens in
              handleSubmit above, not via the browser's built-in checks
              (hence noValidate on the form). */}
          <div>
            <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-widest text-chalk-dim">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-red"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red">{errors.email}</p>
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
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full resize-none border border-border bg-transparent px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-red"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full border border-red bg-red/10 py-2 text-sm font-medium text-chalk transition-colors hover:bg-red/20"
          >
            Send Message
          </button>
        </motion.form>
      )}
    </div>
  )
}

export default LetsTalk
