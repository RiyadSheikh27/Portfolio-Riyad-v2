// src/components/ui/AttentionLabel.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: the inner content of the Footer's call-to-action
// triggers ("Let's talk" and the ChatBot's "Ask Riyad") — a glowing red-glow
// icon, the label, and an optional trailing icon. Every few seconds the
// whole thing hops and the leading icon wiggles, to catch the eye; that
// loop is skipped entirely when the user prefers reduced motion.
//
// It renders only the animated content — the caller wraps it in whatever
// element fits (a router <Link>, a <button>) and supplies the text styling,
// so both triggers share one animation without sharing markup.
//
// Props:
//   icon     (component) — Lucide icon shown before the label (wiggles)
//   label    (string)    — the visible text
//   trailing (node)      — optional element after the label (e.g. an arrow)
//   delay    (number)    — seconds before the first nudge; used to offset
//                          one trigger from another so they take turns
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'
import { motion, useReducedMotion } from 'framer-motion'
import { ATTENTION_INTERVAL, ATTENTION_DURATION } from '../../constants'

function AttentionLabel({ icon: Icon, label, trailing = null, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion()

  // Shared timing for the two nudge animations below, so the hop and the
  // wiggle always fire together, then rest for ATTENTION_INTERVAL seconds.
  // `delay` only applies before the first nudge; since every cycle has the
  // same length afterwards, an offset between two triggers is preserved.
  const transition = {
    duration: ATTENTION_DURATION,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatDelay: ATTENTION_INTERVAL,
    delay,
  }

  return (
    <motion.span
      className="inline-flex items-center gap-1.5"
      animate={shouldReduceMotion ? undefined : { y: [0, -4, 0, -2, 0] }}
      transition={transition}
    >
      <motion.span
        className="inline-flex"
        animate={
          shouldReduceMotion
            ? undefined
            : { rotate: [0, -18, 14, -10, 6, 0], scale: [1, 1.2, 1.2, 1.1, 1, 1] }
        }
        transition={transition}
      >
        <Icon size={16} strokeWidth={2} className="text-red-glow drop-shadow-glow" />
      </motion.span>
      {label}
      {trailing}
    </motion.span>
  )
}

AttentionLabel.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  trailing: PropTypes.node,
  delay: PropTypes.number,
}

export default AttentionLabel
