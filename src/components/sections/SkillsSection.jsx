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
import { toSectionId } from '../../utils/helpers'

function SkillsSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — rows just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div id={toSectionId(skills.sectionName)} className="space-y-4 p-6 box-decoration-clone">
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
                category name is. From md up the label never wraps (w-44
                fits the longest names). On phones the column is narrower
                (w-36) to leave the values more room, so a long name like
                "Payment Gateways" wraps onto a second line instead of
                running into its values; pr-3 keeps a gap between the two. */}
            <span className="flex w-36 flex-shrink-0 pr-3 text-base text-white md:w-44 md:whitespace-nowrap">
              {/* The dash is its own flex item, so a wrapped category name
                  lines up under its first word, not under the dash. */}
              <span className="flex-shrink-0 whitespace-pre text-red">— </span>
              <span>{item.category}</span>
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
