// src/components/sections/CertificatesSection.jsx
// -----------------------------------------------------------------------------
// Renders the "09 Achievements and Certificates" block: a SectionLabel followed by one entry
// per certificate — its Roman numeral, name (linking out to the credential `url`
// when one is set), and "issuer · date" underneath. Same visual pattern as
// PublicationsSection. Data comes from src/api/index.js's `certificates`
// export — never hardcoded here, so adding a certificate only means
// appending an item in portfolio.json.
// -----------------------------------------------------------------------------
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import { certificates } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'
import { toRoman, toSectionId } from '../../utils/helpers'

function CertificatesSection() {
  // Skips the fade/slide-up animation when the user's OS prefers reduced
  // motion — entries just appear instead of staggering in.
  const shouldReduceMotion = useReducedMotion()

  return (
    <div id={toSectionId(certificates.sectionName)} className="space-y-4 p-6 box-decoration-clone">
      <SectionLabel num={certificates.sectionNum} name={certificates.sectionName} />

      <div className="space-y-4">
        {certificates.items.map((item, index) => (
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
            {/* Fixed-width numeral column, so titles line up whether the
                numeral is "I" or "VIII". */}
            <span className="w-7 flex-shrink-0 text-sm font-semibold text-red">{toRoman(index + 1)}.</span>

            <div className="space-y-1">
              {/* Only render a link when the certificate has a credential
                  URL, so one without an online record still shows as text. */}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium leading-snug text-chalk transition-colors hover:text-red"
                >
                  {item.name}
                  <ArrowUpRight size={12} strokeWidth={2} className="ml-1 inline align-baseline" />
                </a>
              ) : (
                <h3 className="text-base font-medium leading-snug text-chalk">{item.name}</h3>
              )}

              <div className="text-xs uppercase tracking-widest text-chalk-faint">
                {item.issuer} · {item.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CertificatesSection
