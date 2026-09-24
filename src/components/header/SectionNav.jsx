// src/components/header/SectionNav.jsx
// -----------------------------------------------------------------------------
// The Header's section navigator: a toggle that reveals a list of every page
// section (… Skills ‹ Experience ‹ Introduction). Picking one scrolls it
// into view and briefly flashes a red-glow highlight on it, so the eye lands
// in the right place — useful on the desktop layout, where sections are
// spread across horizontally scrolling columns.
//
// The toggle sits at the header's far right. Two presentations of the list:
//   - xl and up: the list expands INLINE to the LEFT of the toggle as a
//     compact breadcrumb in exactly two rows (first half of the sections on
//     top, second half below), right-aligned against the toggle and read
//     right-to-left, starting next to it:
//       COMPETITIVE PROGRAMMING ‹ SKILLS ‹ EXPERIENCE ‹ INTRODUCTION  [✕]
//                 WRITING ‹ PUBLICATIONS ‹ PROJECTS ‹ EDUCATION
//     It stays open until the toggle is clicked again (or Escape).
//   - below xl:  a DROPDOWN under the toggle, which also closes after a pick
//     or a click/tap outside, as dropdowns are expected to.
//
// Open/closed state lives in Header (so opening this closes SocialLinks and
// vice versa); this component just receives it.
//
// The section list comes from src/api/index.js's `sections` export, and
// each section element's id comes from toSectionId() — the same helper the
// section components use — so the nav and the page can't drift apart.
//
// Props:
//   open     (bool) — whether the list is showing
//   onToggle (func) — flips `open`
//   onClose  (func) — closes the list
// -----------------------------------------------------------------------------
import { useRef } from 'react'
import PropTypes from 'prop-types'
import { ChevronLeft, Menu } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import PanelToggle from '../ui/PanelToggle'
import { useDismiss } from '../../hooks/useDismiss'
import { sections } from '../../api'
import { toSectionId } from '../../utils/helpers'
import {
  ANIMATION_DURATION,
  HEADER_INLINE_BREAKPOINT,
  MOBILE_BREAKPOINT,
  STAGGER_DELAY,
} from '../../constants'

// How long (ms) a section keeps its highlight after being picked.
const HIGHLIGHT_DURATION = 1200

// Tailwind classes toggled on a section to flash it. Listed here in full
// (not built from pieces) so Tailwind's scanner generates them.
const HIGHLIGHT_CLASSES = ['bg-red-glow/10', 'transition-colors', 'duration-700']

// The inline breadcrumb is always split into two rows: the first half of the
// sections on top (the extra one when the count is odd), the rest below.
const SPLIT = Math.ceil(sections.length / 2)
const SECTION_ROWS = [sections.slice(0, SPLIT), sections.slice(SPLIT)]

function SectionNav({ open, onToggle, onClose }) {
  const shouldReduceMotion = useReducedMotion()

  // Wraps the toggle + dropdown, so a click outside it closes the dropdown.
  const wrapperRef = useRef(null)
  useDismiss(open, onClose, wrapperRef)

  function goTo(sectionName) {
    const element = document.getElementById(toSectionId(sectionName))
    if (!element) return

    // Desktop columns scroll horizontally inside a container whose parents
    // have overflow hidden, so only align on the inline (horizontal) axis
    // there — `block: 'start'` would nudge those hidden-overflow parents.
    // The mobile layout scrolls vertically, so align on the block axis.
    const isMobileLayout = window.innerWidth < MOBILE_BREAKPOINT
    element.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: isMobileLayout ? 'start' : 'nearest',
      inline: isMobileLayout ? 'nearest' : 'start',
    })

    element.classList.add(...HIGHLIGHT_CLASSES)
    window.setTimeout(() => element.classList.remove('bg-red-glow/10'), HIGHLIGHT_DURATION)

    // The dropdown closes after a pick; the inline row stays open until
    // the toggle is clicked again.
    if (window.innerWidth < HEADER_INLINE_BREAKPOINT) onClose()
  }

  return (
    // flex-1 + min-w-0 + justify-end: takes whatever width is left between
    // the social links and the header's right edge, with the toggle pinned
    // to the right and the inline list growing leftwards from it.
    <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
      {/* Inline breadcrumb (xl and up) — always two right-aligned rows,
          each laid out right-to-left with flex-row-reverse. The DOM keeps
          the natural order (Introduction first), so keyboard and
          screen-reader order stays logical. */}
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Sections"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
            transition={{ duration: ANIMATION_DURATION / 2 }}
            className="hidden min-w-0 flex-col items-end gap-1.5 xl:flex"
          >
            {SECTION_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row-reverse items-center">
                {row.map((section, index) => {
                  const overall = rowIndex * SPLIT + index
                  return (
                    <motion.span
                      key={section.sectionNum}
                      initial={shouldReduceMotion ? false : { opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: ANIMATION_DURATION / 2,
                        delay: overall * (STAGGER_DELAY / 2),
                      }}
                      className="flex items-center"
                    >
                      <button
                        type="button"
                        onClick={() => goTo(section.sectionName)}
                        className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-chalk-dim transition-colors hover:text-red-glow 2xl:tracking-wider"
                      >
                        {section.navLabel}
                      </button>
                      {/* "‹" separator on the right of every item except the
                          first in its row — i.e. between it and the item it
                          follows — so each row reads "… SKILLS ‹ EXPERIENCE
                          ‹ INTRODUCTION" with no stray arrow at either end. */}
                      {index > 0 && (
                        <ChevronLeft size={12} strokeWidth={2} className="mx-0.5 text-chalk-faint 2xl:mx-1" />
                      )}
                    </motion.span>
                  )
                })}
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Only a positioning context from md up: on phones the dropdown is
          anchored to the Header itself (full width under it), because the
          toggle may wrap to either edge of a narrow screen. */}
      <div ref={wrapperRef} className="md:relative">
        <PanelToggle open={open} onClick={onToggle} icon={Menu} label="section navigation" />

        {/* Dropdown (below xl), right-aligned under the toggle. */}
        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Sections"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: ANIMATION_DURATION / 2 }}
              className="absolute left-4 right-4 top-full z-50 mt-2 border border-border bg-bg-header py-1 shadow-2xl md:left-auto md:right-0 md:w-64 xl:hidden"
            >
              {sections.map((section) => (
                <button
                  key={section.sectionNum}
                  type="button"
                  onClick={() => goTo(section.sectionName)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-xs font-medium uppercase tracking-widest text-chalk-dim transition-colors hover:bg-chalk/5 hover:text-chalk"
                >
                  <span className="text-red-glow">{section.sectionNum}</span>
                  {section.navLabel}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

SectionNav.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SectionNav
