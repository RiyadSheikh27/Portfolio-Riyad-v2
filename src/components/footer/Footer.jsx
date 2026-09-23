// src/components/footer/Footer.jsx
// -----------------------------------------------------------------------------
// The persistent bottom bar shown on every page (rendered once by AppLayout).
// Left side shows the footer tagline from portfolio.json; right side is the
// ONLY navigation link to the /lets-talk page in the whole app. Using
// React Router's <Link> (instead of a plain <a>) means this navigates
// client-side without a full page reload.
//
// Because it's the app's only call-to-action, the link is highlighted: it
// reuses the Header designation's styling (red, semibold, uppercase, wide
// tracking) and leads with a glowing chat icon in the brighter `red-glow`.
// Every few seconds the link hops and the chat icon wiggles, to catch the
// eye; that loop is skipped entirely when the user prefers reduced motion.
// -----------------------------------------------------------------------------
import { Link } from 'react-router-dom'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { meta } from '../../api'
import { ATTENTION_INTERVAL, ATTENTION_DURATION } from '../../constants'

// Shared timing for the two nudge animations below, so the hop and the
// wiggle always fire together, then rest for ATTENTION_INTERVAL seconds.
const ATTENTION_TRANSITION = {
  duration: ATTENTION_DURATION,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatDelay: ATTENTION_INTERVAL,
}

function Footer() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <footer className="flex h-footer w-full flex-shrink-0 items-center justify-between border-t border-border bg-bg-header px-4 text-xs md:px-6 text-chalk-dim">
      <span>{meta.footerTagline}</span>
      <Link
        to="/lets-talk"
        className="group text-xs font-bold uppercase tracking-widest text-red transition-colors hover:text-chalk"
      >
        <motion.span
          className="inline-flex items-center gap-1.5"
          animate={shouldReduceMotion ? undefined : { y: [0, -4, 0, -2, 0] }}
          transition={ATTENTION_TRANSITION}
        >
          <motion.span
            className="inline-flex"
            animate={
              shouldReduceMotion
                ? undefined
                : { rotate: [0, -18, 14, -10, 6, 0], scale: [1, 1.2, 1.2, 1.1, 1, 1] }
            }
            transition={ATTENTION_TRANSITION}
          >
            <MessageCircle
              size={16}
              strokeWidth={2}
              className="text-red-glow drop-shadow-glow"
            />
          </motion.span>
          Let&apos;s talk
          <ArrowUpRight
            size={14}
            strokeWidth={2}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </motion.span>
      </Link>
    </footer>
  )
}

export default Footer
