// src/components/sections/ProjectsSection.jsx
// -----------------------------------------------------------------------------
// Renders the "06 Projects" block: a SectionLabel followed by one entry per
// project — its Roman numeral, name (linking out to `url`), type, description, and
// its stack string split into individual Tag chips. Data comes from
// src/api/index.js's `projects` export — never hardcoded here.
//
// Unlike other sections' entries, a project entry is allowed to split
// across two desktop columns: entries are tall, and keeping each one whole
// could leave a large empty gap at the bottom of a column. To keep the
// split readable, the name + type lines stay together and with what
// follows (`break-after-avoid`), and the tag row never splits.
// -----------------------------------------------------------------------------
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import Tag from '../ui/Tag'
import { projects } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'
import { toRoman, toSectionId } from '../../utils/helpers'

function ProjectsSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — entries just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div id={toSectionId(projects.sectionName)} className="space-y-6 p-6 box-decoration-clone">
      <SectionLabel num={projects.sectionNum} name={projects.sectionName} />

      <div className="space-y-6">
        {projects.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION,
              delay: index * STAGGER_DELAY,
            }}
            className="space-y-2"
          >
            <div className="flex break-after-avoid items-baseline gap-2">
              <span className="text-sm font-semibold text-red">{toRoman(index + 1)}.</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-base font-medium text-chalk transition-colors hover:text-red"
              >
                {item.name}
                <ArrowUpRight size={12} strokeWidth={2} />
              </a>
            </div>

            <div className="break-after-avoid text-sm uppercase tracking-widest text-chalk-faint">
              {item.type}
            </div>

            <p className="hyphens-auto text-justify text-sm leading-relaxed text-chalk-dim">
              {item.description}
            </p>

            <div className="flex break-inside-avoid flex-wrap gap-1.5 pt-1">
              {item.stack.split(' · ').map((tech) => (
                <Tag key={tech} text={tech} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsSection
