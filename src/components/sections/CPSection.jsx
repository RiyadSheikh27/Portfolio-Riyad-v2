// src/components/sections/CPSection.jsx
// -----------------------------------------------------------------------------
// Renders the "04 Competitive Programming" block: a SectionLabel followed by
// one HyphenItem per achievement. Data comes from src/api/index.js's
// `competitiveProgramming` export — never hardcoded here. Lives at the
// bottom of Column 2 on the desktop Portfolio layout, below SkillsSection.
// -----------------------------------------------------------------------------
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import HyphenItem from '../ui/HyphenItem'
import { competitiveProgramming } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'

function CPSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — rows just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-4 p-6">
      <SectionLabel
        num={competitiveProgramming.sectionNum}
        name={competitiveProgramming.sectionName}
      />
      <div className="space-y-2">
        {competitiveProgramming.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION,
              delay: index * STAGGER_DELAY,
            }}
          >
            <HyphenItem text={item.text} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CPSection
