// src/components/header/SocialLinks.jsx
// -----------------------------------------------------------------------------
// The Header's social links (Email, WhatsApp, GitHub, LinkedIn, CF…),
// collapsed behind a toggle so the header stays uncluttered no matter how
// many links portfolio.json lists. The toggle sits right after the
// availability block; it mirrors SectionNav:
//   - xl and up: the link icons expand INLINE to the RIGHT of the toggle.
//     They stay until the toggle is clicked again (or Escape).
//   - below xl:  a DROPDOWN under the toggle listing each link with its
//     icon and name; it also closes on a click/tap outside.
//
// Open/closed state lives in Header (so opening this closes SectionNav and
// vice versa); this component just receives it. Links come from
// src/api/index.js's `socialLinks` export.
//
// Props:
//   open     (bool) — whether the links are showing
//   onToggle (func) — flips `open`
//   onClose  (func) — closes the links
//   compact  (bool) — shrink the "Connect" toggle to icon-only on xl+,
//                     while an inline panel (this one's icons or
//                     SectionNav's list) needs the room
// -----------------------------------------------------------------------------
import { useRef } from 'react'
import PropTypes from 'prop-types'
import { Facebook, Github, Instagram, Linkedin, Mail, PenLine, Share2 } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import IconButton from '../ui/IconButton'
import PanelToggle from '../ui/PanelToggle'
import WhatsAppIcon from '../ui/WhatsAppIcon'
import { useDismiss } from '../../hooks/useDismiss'
import { socialLinks } from '../../api'
import { ANIMATION_DURATION, STAGGER_DELAY } from '../../constants'

// Maps the icon name strings stored in portfolio.json (socialLinks[].icon)
// to the actual icon components. Only importing the handful of icons
// actually used (instead of `import * as LucideIcons`) keeps the production
// bundle from pulling in the entire icon library. WhatsApp isn't in Lucide,
// so it maps to a local brand-icon component with the same `size` API.
// Links with no matching icon (Codeforces, LeetCode) set `icon: null` and a
// `short` text code ("CF", "LC") that's shown in the icon's place.
const ICON_MAP = {
  Mail,
  WhatsApp: WhatsAppIcon,
  Github,
  Linkedin,
  PenLine,
  Facebook,
  Instagram,
}

// mailto:/tel: links open the mail/phone app in place; everything else
// opens a new tab.
function isExternal(link) {
  return !/^(mailto|tel):/.test(link.href)
}

function SocialLinks({ open, onToggle, onClose, compact = false }) {
  const shouldReduceMotion = useReducedMotion()

  // Wraps the toggle + dropdown, so a click outside it closes the dropdown.
  const wrapperRef = useRef(null)
  useDismiss(open, onClose, wrapperRef)

  return (
    <div className="flex flex-shrink-0 items-center gap-2">
      {/* Only a positioning context from md up: on phones the dropdown is
          anchored to the Header itself (full width under it). */}
      <div ref={wrapperRef} className="md:relative">
        {/* Captioned "Connect" with a share (linked-nodes) icon: an icon
            alone was read as a single link, not a menu of several. */}
        <PanelToggle
          open={open}
          onClick={onToggle}
          icon={Share2}
          label="social links"
          text="Connect"
          compact={compact}
        />

        {/* Dropdown (below xl). Right-aligned under the toggle on md, where
            both toggles sit at the header's right edge; left-aligned from
            lg, where this toggle sits mid-header after the availability
            block. */}
        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Social links"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: ANIMATION_DURATION / 2 }}
              className="absolute left-4 right-4 top-full z-50 mt-2 border border-border bg-bg-header py-1 shadow-2xl md:left-auto md:right-0 md:w-56 lg:left-0 lg:right-auto xl:hidden"
            >
              {socialLinks.map((link) => {
                const Icon = link.icon ? ICON_MAP[link.icon] : null
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target={isExternal(link) ? '_blank' : undefined}
                    rel={isExternal(link) ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 px-4 py-2 text-xs font-medium uppercase tracking-widest text-chalk-dim transition-colors hover:bg-chalk/5 hover:text-chalk"
                  >
                    {/* Fixed-width icon slot so labels line up even for
                        links without a Lucide icon (e.g. Codeforces). */}
                    <span className="flex w-4 justify-center text-red-glow">
                      {Icon ? (
                        <Icon size={16} strokeWidth={1.75} />
                      ) : (
                        <span className="text-[10px] font-bold">{link.short ?? link.label.slice(0, 2)}</span>
                      )}
                    </span>
                    {link.label}
                  </a>
                )
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Inline icon row (xl and up), revealed to the right of the toggle. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: ANIMATION_DURATION / 2 }}
            className="hidden items-center gap-2 xl:flex"
          >
            {socialLinks.map((link, index) => (
              <motion.span
                key={link.id}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: ANIMATION_DURATION / 2,
                  // Reveal left-to-right, starting next to the toggle.
                  delay: index * (STAGGER_DELAY / 2),
                }}
              >
                <IconButton
                  href={link.href}
                  icon={link.icon ? ICON_MAP[link.icon] : null}
                  label={link.label}
                  short={link.short}
                  external={isExternal(link)}
                />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

SocialLinks.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  compact: PropTypes.bool,
}

export default SocialLinks
