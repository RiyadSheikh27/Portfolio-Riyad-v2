// src/components/header/Header.jsx
// -----------------------------------------------------------------------------
// The persistent top bar shown on every page (rendered once by AppLayout).
// Laid out as three distinct info blocks, left to right:
//   1. Logo mark + name/role      — who this is
//   2. Email / phone / location   — how to reach them
//   3. Availability + social icons — status + links
// All of the text and links come from src/api/index.js (meta + socialLinks)
// — nothing here is hardcoded, so updating contact info only ever means
// editing portfolio.json.
// -----------------------------------------------------------------------------
import { Mail, Github, Linkedin } from 'lucide-react'
import IconButton from '../ui/IconButton'
import { meta, socialLinks } from '../../api'

// Maps the icon name strings stored in portfolio.json (socialLinks[].icon)
// to the actual Lucide icon components. Only importing the handful of icons
// actually used (instead of `import * as LucideIcons`) keeps the production
// bundle from pulling in the entire icon library.
const ICON_MAP = { Mail, Github, Linkedin }

function Header() {
  return (
    <header className="flex h-24 w-full flex-shrink-0 items-center justify-between border-b border-border bg-bg-header px-6">
      {/* Left group: logo mark, then Section 1 (name/role) and Section 2
          (email/phone/location) side by side, separated by a hairline. */}
      <div className="flex items-center gap-6">
        <div className="flex h-8 w-8 items-center justify-center border border-border text-sm text-chalk-dim">
          {'{ }'}
        </div>

        {/* Section 1 — name on top, role/designation underneath. The name
            uses the `hand` display font (Permanent Marker, registered in
            tailwind.config.js) and is sized well above the role, which
            stays on the default Inter font so it still reads clearly at
            a small size. */}
        <div>
          <div className="font-hand text-2xl leading-none text-chalk">
            {meta.name}
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-red">
            {meta.role}
          </div>
        </div>

        {/* Section 2 — email (clickable), phone, then location, stacked.
            Hidden on narrow viewports so the header doesn't get cramped;
            this info is still reachable via the Let's Talk page / socials. */}
        <div className="hidden flex-col gap-0.5 border-l border-border pl-6 text-xs md:flex">
          <a
            href={`mailto:${meta.email}`}
            className="text-chalk-dim transition-colors hover:text-chalk"
          >
            {meta.email}
          </a>
          <span className="text-chalk-dim">{meta.phone}</span>
          <span className="text-chalk-faint">{meta.location}</span>
        </div>
      </div>

      {/* Section 3 — availability status on top, social icon row below. */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 text-xs text-chalk-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-red" />
          <span>{meta.availability}</span>
        </div>
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  )
}

export default Header
