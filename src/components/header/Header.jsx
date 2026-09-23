// src/components/header/Header.jsx
// -----------------------------------------------------------------------------
// The persistent top bar shown on every page (rendered once by AppLayout).
// Laid out as three distinct info blocks, left to right:
//   1. Logo mark + name/role      — who this is
//   2. Availability + location    — status + where (glowing bullet)
//   3. Social icons               — links
// All of the text and links come from src/api/index.js (meta + socialLinks)
// — nothing here is hardcoded, so updating contact info only ever means
// editing portfolio.json.
// -----------------------------------------------------------------------------
import { Mail, Github, Linkedin, MapPin } from 'lucide-react'
import IconButton from '../ui/IconButton'
import WhatsAppIcon from '../ui/WhatsAppIcon'
import { meta, socialLinks } from '../../api'

// Maps the icon name strings stored in portfolio.json (socialLinks[].icon)
// to the actual Lucide icon components. Only importing the handful of icons
// actually used (instead of `import * as LucideIcons`) keeps the production
// bundle from pulling in the entire icon library. WhatsApp isn't in Lucide,
// so it maps to a local brand-icon component with the same `size` API.
const ICON_MAP = { Mail, Github, Linkedin, WhatsApp: WhatsAppIcon }

function Header() {
  return (
    // The three blocks sit in a wrapping flex row, so they reflow by
    // themselves as space runs out instead of being hidden:
    //   - lg and up: everything on one fixed-height row, icons pushed right
    //   - tablets:   name + availability on row 1, icons on row 2
    //   - phones:    name, availability, and icons each on their own row
    <header className="flex w-full flex-shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-bg-header px-4 py-3 md:px-6 lg:h-20 lg:py-0">
      {/* Left group: logo mark + Section 1 (name/role). */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo mark — h-11 matches the name + role stack beside it
            (text-2xl leading-none 24px + mt-1 4px + text-xs 16px = 44px),
            so the square and the text block share the same height. On
            phones the name drops to text-xl, so the mark shrinks to h-10. */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border text-base text-chalk-dim md:h-11 md:w-11 md:text-lg">
          {'{ }'}
        </div>

        {/* Section 1 — name on top, role/designation underneath. The name
            uses the `hand` display font (Permanent Marker, registered in
            tailwind.config.js) and is sized well above the role, which
            stays on the default Space Grotesk font so it still reads clearly at
            a small size. */}
        <div>
          <div className="whitespace-nowrap font-hand text-xl leading-none text-chalk md:text-2xl">
            {meta.name}
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-red-glow">
            {meta.role}
          </div>
        </div>
      </div>

      {/* Section 2 — a glowing bullet on the left, vertically centered
          against a two-line stack: availability status on top, location
          underneath. Shown at every size; the hairline divider only
          appears from `md` up, where this block sits beside the name
          (on phones it starts its own row, so a divider would look odd).
          The bullet is a glowing "status light": a bright red-glow core
          with a `shadow-glow` halo, sitting inside a larger translucent
          ring, plus a softly pinging ring that only animates when the
          user hasn't asked for reduced motion. */}
      <div className="flex items-center gap-2.5 md:border-l md:border-border md:pl-6">
        <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-red-glow/20" />
          <span className="absolute inset-1 rounded-full bg-red-glow/50 motion-safe:animate-ping" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-red-glow shadow-glow" />
        </span>
        <div>
          <div className="text-sm font-semibold text-chalk">
            {meta.availability}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-chalk-dim">
            <MapPin size={12} strokeWidth={1.75} />
            {meta.location}
          </div>
        </div>
      </div>

      {/* Section 3 — social icon row, pushed to the far right on the
          single-row (lg) layout. */}
      <div className="flex items-center gap-2 lg:ml-auto">
        {socialLinks.map((link) => {
          const Icon = link.icon ? ICON_MAP[link.icon] : null
          return (
            <IconButton
              key={link.id}
              href={link.href}
              icon={Icon}
              label={link.label}
              external={!link.href.startsWith('mailto:')}
            />
          )
        })}
      </div>
    </header>
  )
}

export default Header
