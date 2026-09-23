// src/components/sections/WritingSection.jsx
// -----------------------------------------------------------------------------
// Renders the "07 Writing" block: a SectionLabel followed by one entry per
// piece of writing — its title and body text. Data comes from
// src/api/index.js's `writing` export — never hardcoded here. Lives in
// Column 4 of the desktop Portfolio layout, below TimelineSection(education).
// -----------------------------------------------------------------------------
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { writing } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'

function WritingSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — entries just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-4 p-6">
      <SectionLabel num={writing.sectionNum} name={writing.sectionName} />

      <div className="space-y-4">
        {writing.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION,
              delay: index * STAGGER_DELAY,
            }}
            className="space-y-1"
          >
            <h3 className="text-base font-medium text-chalk">{item.title}</h3>
            <p className="text-sm leading-relaxed text-chalk-dim">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WritingSection
