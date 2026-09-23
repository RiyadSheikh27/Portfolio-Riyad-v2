// src/components/sections/IntroSection.jsx
// -----------------------------------------------------------------------------
// Renders the "01 Introduction" block: a SectionLabel followed by the intro
// body paragraph. Data comes from src/api/index.js's `intro` export (never
// hardcoded here), so editing the bio only ever means editing portfolio.json.
// Lives at the top of Column 1 on the desktop Portfolio layout, above
// TimelineSection(experience).
// -----------------------------------------------------------------------------
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { intro } from '../../api'
import { ANIMATION_DURATION } from '../../constants'

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
      className="space-y-4 p-6"
    >
      <SectionLabel num={intro.sectionNum} name={intro.sectionName} />
      <p className="text-base leading-relaxed text-chalk-dim">{intro.body}</p>
    </motion.div>
  )
}

export default IntroSection
