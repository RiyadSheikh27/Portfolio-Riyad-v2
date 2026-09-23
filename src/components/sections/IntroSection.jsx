// src/components/sections/IntroSection.jsx
// -----------------------------------------------------------------------------
// Renders the "01 Introduction" block: a SectionLabel, the intro body
// paragraph, and then (when `intro.quote` is set) a highlighted quote card.
// The quote has no title or subtitle — just the text wrapped in large red
// quotation marks, set in the same `hand` font as the Header's name. Data comes from src/api/index.js's `intro` export (never
// hardcoded here), so editing the bio only ever means editing portfolio.json.
// Lives at the top of Column 1 on the desktop Portfolio layout, above
// TimelineSection(experience).
// -----------------------------------------------------------------------------
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { intro } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'

function IntroSection() {
  // Framer Motion's hook for the OS-level "prefers reduced motion" setting.
  // When true, the fade/slide-up below is skipped so the section just
  // appears instantly instead of animating in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION }}
      className="space-y-4 p-6 box-decoration-clone"
    >
      <SectionLabel num={intro.sectionNum} name={intro.sectionName} />
      {/* hyphens-auto lets the browser split long words at line ends, which
          keeps justified text from opening wide gaps on narrow phones. */}
      <p className="hyphens-auto text-justify text-base leading-relaxed text-chalk-dim">{intro.body}</p>

      {intro.quote && (
        <motion.blockquote
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATION, delay: STAGGER_DELAY }}
          className="break-inside-avoid rounded-lg border border-red/40 bg-red/5 px-5 py-4"
        >
          <p className="text-center font-hand text-lg leading-relaxed text-chalk">
            <span className="mr-1 text-2xl leading-none text-red">&ldquo;</span>
            {intro.quote}
            <span className="ml-1 text-2xl leading-none text-red">&rdquo;</span>
          </p>
        </motion.blockquote>
      )}
    </motion.div>
  )
}

export default IntroSection
