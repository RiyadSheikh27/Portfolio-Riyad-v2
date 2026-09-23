// src/components/sections/PublicationsSection.jsx
// -----------------------------------------------------------------------------
// Renders the "07 Publications" block: a SectionLabel followed by one entry
// per publication — its number, the paper title (linking out to `url` when
// one is set), the journal/conference it appeared in, and the publisher. Data comes from
// src/api/index.js's `publications` export — never hardcoded here, so adding
// a publication only means appending an item in portfolio.json. Lives in
// Column 4 of the desktop Portfolio layout, above WritingSection.
// -----------------------------------------------------------------------------
import { ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { publications } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'

function PublicationsSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — entries just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-4 p-6 box-decoration-clone">
      <SectionLabel
        num={publications.sectionNum}
        name={publications.sectionName}
      />

      <div className="space-y-4">
        {publications.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION,
              delay: index * STAGGER_DELAY,
            }}
            className="flex break-inside-avoid gap-2"
          >
            <span className="text-sm text-red">{item.number}</span>

            <div className="space-y-1">
              {/* Only render a link when the item actually has a URL, so a
                  publication that isn't online yet still shows as text. */}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium leading-snug text-chalk transition-colors hover:text-red"
                >
                  {item.title}
                  <ExternalLink
                    size={10}
                    strokeWidth={1.75}
                    className="ml-1 inline align-baseline"
                  />
                </a>
              ) : (
                <h3 className="text-base font-medium leading-snug text-chalk">
                  {item.title}
                </h3>
              )}

              <p className="text-sm leading-relaxed text-chalk-dim">
                {item.journal}
              </p>

              <div className="text-xs uppercase tracking-widest text-chalk-faint">
                Publisher: {item.publisher}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PublicationsSection
