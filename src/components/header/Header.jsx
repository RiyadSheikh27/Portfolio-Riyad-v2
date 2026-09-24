// src/components/header/Header.jsx
// -----------------------------------------------------------------------------
// The persistent top bar shown on every page (rendered once by AppLayout).
// Laid out as distinct blocks, left to right:
//   1. Logo mark + name/role      — who this is (logo = "back to start")
//   2. Availability + location    — status + where (glowing bullet)
//   3. Social links               — collapsed behind a toggle (SocialLinks.jsx)
//   4. Section navigator          — jump to any section (SectionNav.jsx),
//                                   at the far right
// Blocks 3 and 4 are expandable panels. Only one is open at a time — this
// component owns that state — so on wide screens the section list always
// has the room it needs.
// All of the text and links come from src/api/index.js (meta + socialLinks)
// — nothing here is hardcoded, so updating contact info only ever means
// editing portfolio.json.
// -----------------------------------------------------------------------------
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import LogoMark from '../ui/LogoMark'
import SectionNav from './SectionNav'
import SocialLinks from './SocialLinks'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useHideOnScroll } from '../../hooks/useHideOnScroll'
import { meta } from '../../api'

function Header() {
  // Which expandable panel is open: 'nav', 'links', or null. Opening one
  // closes the other.
  const [openPanel, setOpenPanel] = useState(null)
  const togglePanel = (name) => setOpenPanel((prev) => (prev === name ? null : name))
  // Stable identity, since useDismiss re-subscribes whenever it changes.
  const closePanel = useCallback(() => setOpenPanel(null), [])

  // Phones only: slide the header away while scrolling down and bring it
  // back on scroll up, so reading gets the full screen height. Never hides
  // while one of its dropdowns is open.
  const isMobile = useIsMobile()
  const hidden = useHideOnScroll(isMobile && openPanel === null)

  // The header's current height, so hiding can pull it up by exactly that
  // much (its height varies as its rows wrap on narrow screens).
  const headerRef = useRef(null)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    // Side effect: keep `height` in sync with the rendered header.
    const node = headerRef.current
    if (!node) return undefined
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    // The blocks sit in a wrapping flex row, so they reflow by themselves
    // as space runs out instead of being hidden:
    //   - lg and up: one fixed-height row (never wraps); the toggles group
    //     takes the remaining width, social toggle pushed to the far right
    //   - md–lg:     name + availability on row 1 (when they fit), the two
    //     toggles on row 2, right-aligned
    //   - phones:    name on row 1; availability + both toggles on row 2
    //     (toggles right-aligned), wrapping to a 3rd row on very narrow
    //     screens
    // `relative` makes the header the anchor for the phone dropdowns.
    // Hiding uses a negative top margin (not a transform), so <main> below
    // actually grows into the freed space instead of leaving a gap. The
    // inline style is unavoidable here because the height is measured at
    // runtime.
    <header
      ref={headerRef}
      style={{ marginTop: hidden ? -height : 0 }}
      className="relative z-20 flex w-full flex-shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-bg-header px-4 py-3 transition-[margin] duration-300 ease-out motion-reduce:transition-none md:px-6 lg:h-20 lg:flex-nowrap lg:py-0"
    >
      {/* Left group: logo mark + Section 1 (name/role). */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo mark — h-11 matches the name + role stack beside it
            (text-2xl leading-none 24px + mt-1 4px + text-xs 16px = 44px),
            so the square and the text block share the same height. On
            phones the name drops to text-xl, so the mark shrinks to h-10.
            It's the same drawing as the browser-tab icon, and doubles as a
            "back to start" link: from another page it navigates home, and
            on the Portfolio page itself each click creates a fresh router
            location, which Portfolio.jsx reacts to by scrolling back to
            the first column. */}
        <Link
          to="/"
          aria-label="Back to start"
          className="block h-10 w-10 flex-shrink-0 transition-transform hover:scale-105 hover:drop-shadow-glow md:h-11 md:w-11"
        >
          <LogoMark />
        </Link>

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

      {/* Sections 3 + 4 — the two panel toggles, grouped so they stay
          side by side and right-aligned when they wrap onto their own row.
          From lg up the group fills the rest of the row, right after the
          availability block with a hairline divider (same gap as between
          the blocks before it): SocialLinks comes first (its icons expand
          rightwards), SectionNav takes the remaining width with its toggle
          at the far right (its list expands leftwards). Below lg the group
          is pushed right, away from the availability block, so no divider. */}
      <div className="ml-auto flex min-w-0 items-center gap-2 lg:ml-0 lg:flex-1 lg:border-l lg:border-border lg:pl-6">
        <SocialLinks
          open={openPanel === 'links'}
          onToggle={() => togglePanel('links')}
          onClose={closePanel}
        />
        <SectionNav
          open={openPanel === 'nav'}
          onToggle={() => togglePanel('nav')}
          onClose={closePanel}
        />
      </div>
    </header>
  )
}

export default Header
