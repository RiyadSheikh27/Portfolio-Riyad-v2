// src/components/sections/SkillsSection.jsx
// -----------------------------------------------------------------------------
// Renders the "03 Skills" block: a SectionLabel followed by one row per
// skill category, each showing "— Category" (title case, as stored in the
// JSON — not forced to uppercase) and its values. Data comes from
// src/api/index.js's `skills` export — never hardcoded here. Lives at the
// top of Column 2 on the desktop Portfolio layout, above CPSection.
//
// Rows use a fixed-width label column (rather than HyphenItem's single
// concatenated string) so every category's values line up in the same
// horizontal position regardless of how long the category name is —
// "Languages" and "Infrastructure" both start their values at the same x
// position, like a two-column table. The "—" itself is colored to match
// SectionLabel's numeral, so every section's red accents read as one system.
// -----------------------------------------------------------------------------
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { skills } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'

function SkillsSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — rows just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-4 p-6 box-decoration-clone">
      <SectionLabel num={skills.sectionNum} name={skills.sectionName} />
      <div className="space-y-2.5">
        {skills.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION,
              delay: index * STAGGER_DELAY,
            }}
            className="flex break-inside-avoid items-baseline"
          >
            {/* Fixed-width label column — every row's value column starts
                at the exact same x position no matter how long the
                category name is. whitespace-nowrap guarantees the longest
                category ("Infrastructure") never wraps onto a second line
                and throws that alignment off. It's narrower on phones
                (w-36 still fits "— Infrastructure") to leave the values
                more room. */}
            <span className="w-36 flex-shrink-0 whitespace-nowrap md:w-44 text-base text-white">
              <span className="text-red">— </span>
              {item.category}
            </span>
            <span className="text-sm leading-relaxed text-chalk-dim">
              {item.values}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SkillsSection
