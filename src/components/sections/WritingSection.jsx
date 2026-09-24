// src/components/sections/WritingSection.jsx
// -----------------------------------------------------------------------------
// Renders the "10 Writing" block: a SectionLabel followed by one entry per
// piece of writing — its title (linking out to `url` when one is set) and
// body text. Data comes from src/api/index.js's `writing` export — never
// hardcoded here. Last section on the page, after CertificatesSection.
// -----------------------------------------------------------------------------
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { writing } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'
import { toSectionId } from '../../utils/helpers'

function WritingSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — entries just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div id={toSectionId(writing.sectionName)} className="space-y-4 p-6 box-decoration-clone">
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
            className="break-inside-avoid space-y-1"
          >
            {/* Only render a link when the item actually has a URL, so a
                piece that isn't published anywhere still shows as text. */}
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-base font-medium text-chalk transition-colors hover:text-red"
              >
                {item.title}
                <ArrowUpRight size={12} strokeWidth={2} className="ml-1 inline align-baseline" />
              </a>
            ) : (
              <h3 className="text-base font-medium text-chalk">{item.title}</h3>
            )}
            <p className="hyphens-auto text-justify text-sm leading-relaxed text-chalk-dim">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WritingSection
