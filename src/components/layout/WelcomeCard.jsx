// src/components/layout/WelcomeCard.jsx
// -----------------------------------------------------------------------------
// The first thing a visitor sees: Riyad's photo, "dealt" onto the screen
// like a playing card before the portfolio is revealed.
//
// The sequence:
//   1. The page dims and blurs behind a backdrop.
//   2. A face-down card (the "{ }" LogoMark on its back) flies in from the
//      bottom-right corner, spinning one and a half turns so it lands
//      face-up in the centre.
//   3. On landing, warm embers burst out from behind its edges (the photo's
//      golden-hour tones), a glint of light sweeps across the photo, and
//      small four-point stars keep twinkling at its corners.
//   4. The close button appears, attached to the card, with a one-line note
//      under it on what kind of portfolio this is. Pressing it — or Escape,
//      or clicking the backdrop — flips the card away toward the top-left
//      and the portfolio is free to use.
// On a mouse, the landed card tilts slightly toward the cursor.
//
// The deal waits for the photo to load (with a timeout fallback) so the
// flip never reveals a half-painted image. Users who prefer reduced motion
// get a plain fade instead of the flight, flip and particles.
//
// Rendered once by AppLayout, which decides whether to show it at all.
//
// Props:
//   onClose (func) — called after the exit animation, to unmount the card
// -----------------------------------------------------------------------------
import { useEffect, useId, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { X } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import LogoMark from '../ui/LogoMark'
import riyadPhoto from '../../assets/riyad.jpg'
import {
  WELCOME_DEAL_DURATION,
  WELCOME_EMBER_COUNT,
  WELCOME_IMAGE_TIMEOUT,
} from '../../constants'

// Warm ember colours: gold from the photo's lighting, plus the site's
// red-glow and chalk accents (kept as literals because framer-motion
// animates the inline background, not a Tailwind class).
const EMBER_COLORS = ['#f5d48a', '#ffb347', '#ff4d3a', '#e8e4dc']

// The card's flight: in from just past the bottom-right corner, 1.5 turns,
// landing flat; out past the top-left corner with another half turn.
// No opacity here on purpose — opacity below 1 flattens a 3D element
// (it forces `transform-style: flat`), which would show a mirrored photo
// instead of the card's back mid-flip. Starting off-screen hides it instead.
const DEAL_FROM = { x: '55vw', y: '65vh', rotateY: 540, rotateZ: -28, scale: 0.15 }
const DEAL_TO = { x: 0, y: 0, rotateY: 0, rotateZ: 0, scale: 1 }
const DEAL_AWAY = { x: '-60vw', y: '-70vh', rotateY: -180, rotateZ: 24, scale: 0.15 }

// The flight decelerates hard so the card "settles", but the spin runs on
// a gentler curve — on the same ease it would finish in the first few
// frames and the flip would barely be seen.
const DEAL_IN = {
  duration: WELCOME_DEAL_DURATION,
  ease: [0.16, 1, 0.3, 1],
  rotateY: { duration: WELCOME_DEAL_DURATION, ease: [0.4, 0.1, 0.2, 1] },
  rotateZ: { duration: WELCOME_DEAL_DURATION, ease: [0.4, 0.1, 0.2, 1] },
}
const DEAL_OUT = { duration: 0.7, ease: 'easeIn' }

// Reduced motion: the card just fades in and out in place.
const FADE_FROM = { opacity: 0 }
const FADE_TO = { opacity: 1 }
const FADE_OUT = { duration: 0.3 }

// Deterministic pseudo-random in [0, 1), so ember layouts are stable
// across renders without calling Math.random() during render.
function seeded(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

// One burst of embers, fanned evenly around a circle with a little jitter.
const EMBERS = Array.from({ length: WELCOME_EMBER_COUNT }, (_, i) => {
  const angle = (i / WELCOME_EMBER_COUNT) * Math.PI * 2 + seeded(i, 1) * 0.4
  const distance = 38 + seeded(i, 2) * 30 // vmin
  return {
    id: i,
    x: `${Math.cos(angle) * distance}vmin`,
    y: `${Math.sin(angle) * distance}vmin`,
    size: 3 + seeded(i, 3) * 5,
    color: EMBER_COLORS[i % EMBER_COLORS.length],
    delay: seeded(i, 4) * 0.15,
    duration: 0.9 + seeded(i, 5) * 0.7,
  }
})

// Four-point stars that keep twinkling around the landed card.
const TWINKLES = [
  { id: 'tl', className: '-left-4 -top-4 h-7 w-7', delay: 0 },
  { id: 'tr', className: '-right-3 top-[18%] h-4 w-4', delay: 0.7 },
  { id: 'br', className: '-bottom-5 -right-5 h-8 w-8', delay: 1.3 },
  { id: 'bl', className: '-left-3 bottom-[22%] h-5 w-5', delay: 2 },
]

function Twinkle({ className, delay }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`pointer-events-none absolute fill-[#f5d48a] drop-shadow-glow ${className}`}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 90] }}
      transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
    >
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
    </motion.svg>
  )
}

Twinkle.propTypes = {
  className: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
}

function WelcomeCard({ onClose }) {
  const shouldReduceMotion = useReducedMotion()

  // `ready`: the photo has loaded (or we gave up waiting) — start the deal.
  // `landed`: the card has arrived — burst, glint, show the close button.
  // `closing`: dismissed — the card flies off, then the backdrop fades and
  // onClose unmounts everything. (Driven by state rather than
  // AnimatePresence exits so the backdrop can reliably wait for the card.)
  const [ready, setReady] = useState(false)
  const [landed, setLanded] = useState(false)
  const [closing, setClosing] = useState(false)
  const close = () => setClosing(true)
  const closeRef = useRef(null)
  const captionId = useId()

  // Pointer tilt for the landed card, sprung so it eases rather than snaps.
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const springX = useSpring(tiltX, { stiffness: 150, damping: 15 })
  const springY = useSpring(tiltY, { stiffness: 150, damping: 15 })

  useEffect(() => {
    // Side effect: preload the photo, starting the deal once it's decoded
    // or after WELCOME_IMAGE_TIMEOUT, whichever comes first.
    const image = new Image()
    const start = () => setReady(true)
    image.onload = start
    image.onerror = start
    image.src = riyadPhoto
    const timer = window.setTimeout(start, WELCOME_IMAGE_TIMEOUT)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Side effect: Escape dismisses the card (until it's already closing).
    if (closing) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') setClosing(true)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closing])

  useEffect(() => {
    // Side effect: move focus to the close button once it appears, so
    // keyboard and screen-reader users land on the way out.
    if (landed) closeRef.current?.focus({ preventScroll: true })
  }, [landed])

  function handlePointerMove(event) {
    if (!landed || closing || shouldReduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    tiltX.set(-py * 14)
    tiltY.set(px * 14)
  }

  function handlePointerLeave() {
    tiltX.set(0)
    tiltY.set(0)
  }

  const cardFrom = shouldReduceMotion ? FADE_FROM : DEAL_FROM
  const cardTo = shouldReduceMotion ? FADE_TO : DEAL_TO
  const cardAway = shouldReduceMotion ? FADE_FROM : DEAL_AWAY

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome — a photo of Riyad"
      aria-describedby={landed ? captionId : undefined}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 [perspective:1600px]"
    >
      {/* Backdrop. Its own element so it can linger while the card
          flies away, then fade — otherwise the card ghosts over the page. */}
      <motion.div
        className="absolute inset-0 bg-bg-header/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={closing ? { duration: 0.45, delay: shouldReduceMotion ? 0 : 0.35 } : { duration: 0.4 }}
        onAnimationComplete={() => {
          if (closing) onClose()
        }}
        onClick={close}
      />

      {/* pointer-events-none on the flying wrapper: when the card tilts
          toward the cursor, its near corner (where the close button sits)
          dips behind this wrapper's flat plane, and the wrapper — invisible
          but still hit-testable — would swallow clicks meant for the
          button. Only the card itself takes pointer input. */}
      {ready && (
        <motion.div
          className="pointer-events-none relative [transform-style:preserve-3d]"
          initial={cardFrom}
          animate={closing ? cardAway : cardTo}
          transition={shouldReduceMotion ? FADE_OUT : closing ? DEAL_OUT : DEAL_IN}
          onAnimationComplete={() => {
            if (!closing) setLanded(true)
          }}
        >
          {/* Embers sit BEHIND the card, so they appear to spill out
              from under its edges rather than over the photo. */}
          {landed && !shouldReduceMotion && (
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 [transform:translateZ(-2px)]">
              {EMBERS.map((ember) => (
                <motion.span
                  key={ember.id}
                  className="absolute rounded-full"
                  style={{
                    width: ember.size,
                    height: ember.size,
                    background: ember.color,
                    boxShadow: `0 0 ${ember.size * 2}px ${ember.color}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: ember.x, y: ember.y, opacity: 0, scale: 0.2 }}
                  transition={{ duration: ember.duration, delay: ember.delay, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}

          <motion.div
            className="pointer-events-auto relative aspect-[1122/1402] w-[min(86vw,60vh)] [transform-style:preserve-3d]"
            style={{ rotateX: springX, rotateY: springY }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            {/* Back face — what you see mid-flip. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-[#f5d48a]/40 bg-bg-header [backface-visibility:hidden] [background-image:repeating-linear-gradient(45deg,rgba(245,212,138,0.06)_0_2px,transparent_2px_14px)] [transform:rotateY(180deg)]">
              <div className="absolute inset-3 rounded-xl border border-[#f5d48a]/25" />
              <div className="h-20 w-20">
                <LogoMark />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.4em] text-chalk-dim">Riyad</span>
            </div>

            {/* Front face — the photo. */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-[#f5d48a]/40 bg-bg-header shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(245,180,90,0.45)] [backface-visibility:hidden]">
              <img
                src={riyadPhoto}
                alt="MD. Fazle Rabbi Riyad sitting in a leather armchair, with the caption: turns coffee into code, dreams into reality."
                className="h-full w-full select-none object-cover"
                draggable="false"
              />
              {/* The glint: a soft band of light that sweeps across
                  once on landing, like light catching a glossy card. */}
              {landed && !shouldReduceMotion && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent mix-blend-overlay"
                  initial={{ left: '-60%', skewX: -18 }}
                  animate={{ left: '130%' }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                />
              )}
            </div>

            {/* The close button and corner stars ride on a layer lifted off
                the card's surface, inside the tilting element, so they move
                with the card and stay in front of it at any tilt. The lift
                lives on this plain wrapper because framer-motion's inline
                transform (the button's pop-in) would override it on the
                motion elements themselves. */}
            {landed && (
              <div className="pointer-events-none absolute inset-0 [transform-style:preserve-3d] [transform:translateZ(30px)]">
                {!shouldReduceMotion &&
                  TWINKLES.map((twinkle) => <Twinkle key={twinkle.id} className={twinkle.className} delay={twinkle.delay} />)}

                <motion.button
                  ref={closeRef}
                  type="button"
                  aria-label="Close and enter the portfolio"
                  title="Enter the portfolio"
                  className="pointer-events-auto absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#f5d48a]/50 bg-bg-header text-chalk shadow-glow outline-none transition-colors hover:border-red-glow hover:text-red-glow focus-visible:ring-2 focus-visible:ring-red-glow md:-right-4 md:-top-4"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.25 }}
                  onClick={close}
                >
                  <X size={18} strokeWidth={2} />
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* What to expect from the portfolio behind the card. */}
          {landed && (
            <motion.p
              id={captionId}
              className="absolute inset-x-2 top-full mt-4 text-balance text-center text-xs leading-relaxed tracking-wide text-chalk-dim"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              A résumé-grade portfolio — Less flashy design, more meaningful information, <span className="text-chalk">experiences matter more than unnecessary decoration.</span>
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  )
}

WelcomeCard.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default WelcomeCard
