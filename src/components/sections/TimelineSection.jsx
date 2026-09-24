// src/components/sections/TimelineSection.jsx
// -----------------------------------------------------------------------------
// KEY REUSE PATTERN: this single component renders BOTH the Experience
// section AND the Education section on the Portfolio page. It accepts one
// `data` prop — the full section object from portfolio.json (shape:
// { sectionNum, sectionName, items: [{ id, title, company, companyUrl,
// dateRange, description }] }) — and renders the same timeline UI (red
// circle marker, vertical connector line, title, date, company + external
// link icon, description) regardless of which data it's given. The caller
// decides which data to pass:
//   <TimelineSection data={experience} />   // Column 1
//   <TimelineSection data={education} />         // Column 2, below CPSection
//   <TimelineSection data={extracurricular} />   // Column 4, below Publications
// There is no experience-specific or education-specific branching inside
// this component — that's the whole point of the reuse: one component, two
// call sites, two different JSON payloads.
//
// Props:
//   data (object) — a section object shaped like above
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'
import { toSectionId } from '../../utils/helpers'

function TimelineSection({ data }) {
  // Skips the fade/slide-up animation entirely when the user's OS is set to
  // prefer reduced motion, so each entry just appears instead of animating.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div id={toSectionId(data.sectionName)} className="space-y-4 p-6 box-decoration-clone">
      <SectionLabel num={data.sectionNum} name={data.sectionName} />

      {/* The vertical connector line is a single border-l on this wrapper
          (rather than a separate line element per entry) — every entry's
          red dot is then absolutely positioned to sit exactly on that one
          continuous line. */}
      <div className="space-y-6 border-l border-border pl-5">
        {data.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION,
              delay: index * STAGGER_DELAY,
            }}
            className="relative break-inside-avoid space-y-1"
          >
            {/* The red circle marker, offset left so its center lands on
                the wrapper's border-l line (pl-5 = 20px + half the dot's
                own width = 24px, i.e. -left-6). */}
            <span className="absolute -left-6 top-1.5 h-2 w-2 rounded-full bg-red" />

            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base font-medium text-chalk">
                {item.title}
              </h3>
              {/* Date range uses the same muted color as the description,
                  so it reads as secondary info next to the title. */}
              <span className="flex-shrink-0 text-xs text-chalk-dim">
                {item.dateRange}
              </span>
            </div>

            {/* Company / school name uses the same red as SectionLabel's
                numeral, so the red accents in this column read as one
                system. Hover brightens it to chalk as the link affordance. */}
            {/* The organization links out only when it has a URL (Extracurricular
                entries may not), otherwise it's plain text in the same red. */}
            {item.companyUrl ? (
              <a
                href={item.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-red transition-colors hover:text-chalk"
              >
                {item.company}
                <ArrowUpRight size={12} strokeWidth={2} />
              </a>
            ) : (
              <div className="text-sm text-red">{item.company}</div>
            )}

            {item.description && (
              <p className="hyphens-auto text-justify text-sm leading-relaxed text-chalk-dim">
                {item.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

TimelineSection.propTypes = {
  data: PropTypes.shape({
    sectionNum: PropTypes.string.isRequired,
    sectionName: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        companyUrl: PropTypes.string,
        dateRange: PropTypes.string.isRequired,
        description: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
}

export default TimelineSection
