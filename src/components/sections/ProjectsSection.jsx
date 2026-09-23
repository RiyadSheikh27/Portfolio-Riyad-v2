// src/components/sections/ProjectsSection.jsx
// -----------------------------------------------------------------------------
// Renders the "05 Projects" block: a SectionLabel followed by one entry per
// project — its number, name (linking out to `url`), type, description, and
// its stack string split into individual Tag chips. Data comes from
// src/api/index.js's `projects` export — never hardcoded here. Lives alone
// in Column 3 of the desktop Portfolio layout.
// -----------------------------------------------------------------------------
import { ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import Tag from '../ui/Tag'
import { projects } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'

function ProjectsSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — entries just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-6 p-6">
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
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-red">{item.number}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-base font-medium text-chalk transition-colors hover:text-red"
              >
                {item.name}
                <ExternalLink size={10} strokeWidth={1.75} />
              </a>
            </div>

            <div className="text-sm uppercase tracking-widest text-chalk-faint">
              {item.type}
            </div>

            <p className="text-sm leading-relaxed text-chalk-dim">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
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
