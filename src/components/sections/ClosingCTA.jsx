// src/components/sections/ClosingCTA.jsx
// -----------------------------------------------------------------------------
// The page's closing "grand finale", right after the last section: a glowing
// card with a playful eyebrow, a hand-lettered heading whose last word gets a
// red squiggle underline that draws itself in, and two buttons —
//   - Let's talk → the /lets-talk contact form (filled, primary)
//   - Ask Riyad  → opens the Footer's ChatBot panel via openChatBot()
// Both buttons do the Footer triggers' periodic hop-and-wiggle
// (ui/AttentionLabel), offset so they take turns. A few sparkles twinkle in
// the corners. All motion is skipped for users who prefer reduced motion.
//
// Copy comes from portfolio.json's `closing` object
// ({ eyebrow, title, highlight, text }), never hardcoded here.
// -----------------------------------------------------------------------------
import { Link } from 'react-router-dom'
import { ArrowUpRight, Bot, MessageCircle, Sparkle } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import AttentionLabel from '../ui/AttentionLabel'
import { openChatBot } from './ChatBot'
import { closing } from '../../api'
import { ANIMATION_DURATION, ATTENTION_DURATION, ATTENTION_INTERVAL } from '../../constants'

// Half a nudge cycle, so the two buttons wiggle alternately.
const NUDGE_OFFSET = (ATTENTION_DURATION + ATTENTION_INTERVAL) / 2

// Decorative sparkles: position, size and twinkle timing for each.
const SPARKLES = [
  { className: 'right-5 top-5', size: 14, delay: 0 },
  { className: 'right-12 top-10', size: 8, delay: 0.8 },
  { className: 'bottom-6 right-8', size: 10, delay: 1.6 },
]

function ClosingCTA() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="break-inside-avoid px-6 py-5">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: ANIMATION_DURATION }}
        // A soft red glow bleeding in from the top-left corner.
        className="relative overflow-hidden rounded-lg border border-red/30 bg-[radial-gradient(ellipse_at_top_left,rgba(255,77,58,0.16),transparent_60%)] p-6"
      >
        {SPARKLES.map((sparkle) => (
          <motion.span
            key={sparkle.className}
            aria-hidden="true"
            className={`pointer-events-none absolute text-red-glow ${sparkle.className}`}
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [0.2, 1, 0.2], scale: [0.8, 1.15, 0.8], rotate: [0, 45, 0] }
            }
            transition={{ duration: 2.4, repeat: Infinity, delay: sparkle.delay, ease: 'easeInOut' }}
          >
            <Sparkle size={sparkle.size} strokeWidth={2} fill="currentColor" />
          </motion.span>
        ))}

        <div className="text-xs font-semibold uppercase tracking-widest text-red-glow">
          {closing.eyebrow} ✦
        </div>

        {/* Hand-lettered heading (same `hand` font as the Header's name).
            The highlighted word sits on a squiggle that draws in once the
            card scrolls into view. */}
        <h2 className="mt-3 font-hand text-2xl leading-snug text-chalk">
          {closing.title}{' '}
          <span className="relative inline-block whitespace-nowrap">
            {closing.highlight}
            <svg
              aria-hidden="true"
              viewBox="0 0 120 12"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-3 w-full overflow-visible text-red-glow"
            >
              <motion.path
                d="M2 8 C 20 2, 35 12, 55 6 S 90 2, 118 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={shouldReduceMotion ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              />
            </svg>
          </span>
        </h2>

        <p className="mt-4 text-sm leading-normal text-chalk-dim">{closing.text}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/lets-talk"
            className="group inline-flex items-center border border-red-glow bg-red-glow px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-bg shadow-glow transition-colors hover:bg-transparent hover:text-red-glow"
          >
            <AttentionLabel
              icon={MessageCircle}
              label="Let's talk"
              iconClassName="text-current"
              trailing={
                <ArrowUpRight
                  size={14}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              }
            />
          </Link>
          <button
            type="button"
            onClick={openChatBot}
            className="inline-flex items-center border border-red/50 bg-red/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-glow transition-colors hover:border-red-glow hover:bg-red/20 hover:text-chalk"
          >
            <AttentionLabel icon={Bot} label="Ask Riyad" delay={NUDGE_OFFSET} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ClosingCTA
