// src/pages/Portfolio.jsx
// -----------------------------------------------------------------------------
// The main page: a horizontally scrolling, newspaper-style column layout on
// desktop, and a simple vertical stack on mobile.
//
// Content order (desktop flows it left to right, column by column):
//   Col 1 — IntroSection + TimelineSection(experience)
//   Col 2 — SkillsSection + CPSection + TimelineSection(education)
//   Col 3 — ProjectsSection
//   Col 4 — PublicationsSection + WritingSection
// On mobile (useIsMobile), columns will stack vertically with Dividers
// between them instead of sitting side by side.
//
// Desktop uses CSS multi-column layout (`columns-2 lg:columns-3`) with a
// fixed height, so when a column runs out of vertical space its text FLOWS
// into the next column instead of being clipped — the browser adds extra
// overflow columns to the right as needed, reachable via horizontal
// scroll. Sections flow continuously (the next one starts right where
// the previous ends, no forced column breaks), while individual entries
// (a job, a project, a skill row…) use `break-inside-avoid` inside their
// section components so a single entry is never split across two columns.
// -----------------------------------------------------------------------------
import { useEffect, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useColumnDividers } from '../hooks/useColumnDividers'
import IntroSection from '../components/sections/IntroSection'
import TimelineSection from '../components/sections/TimelineSection'
import SkillsSection from '../components/sections/SkillsSection'
import CPSection from '../components/sections/CPSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import WritingSection from '../components/sections/WritingSection'
import PublicationsSection from '../components/sections/PublicationsSection'
import Divider from '../components/ui/Divider'
import { experience, education } from '../api'

function Portfolio() {
  // Determines whether to render the vertical (mobile) or horizontal
  // (desktop) column layout.
  const isMobile = useIsMobile()

  // The desktop scroll container. A wheel listener on it redirects normal
  // (vertical) mouse-wheel input into horizontal scrolling, since the whole
  // point of this layout is that it scrolls sideways, not down.
  const scrollRef = useRef(null)

  // The multi-column element inside the scroller, measured by
  // useColumnDividers so a wavy divider can be drawn at every column edge
  // (including overflow columns the browser created on its own).
  const columnsRef = useRef(null)
  const dividers = useColumnDividers(columnsRef, !isMobile)

  useEffect(() => {
    // Side effect: attach a native wheel listener (rather than React's
    // onWheel) so we can call preventDefault() reliably — React's synthetic
    // wheel handler is passive by default and can't stop the page's normal
    // vertical scroll. Skipped on mobile, where the layout scrolls normally
    // (vertically) instead. Re-runs only if `isMobile` changes.
    if (isMobile) return undefined
    const node = scrollRef.current
    if (!node) return undefined

    function handleWheel(event) {
      event.preventDefault()
      node.scrollLeft += event.deltaY
    }

    node.addEventListener('wheel', handleWheel, { passive: false })
    return () => node.removeEventListener('wheel', handleWheel)
  }, [isMobile])

  // Each column group has a stable id (rather than relying on array index)
  // so React's reconciliation/key warnings stay clean.
  const columns = [
    {
      id: 'col-intro-experience',
      content: (
        <>
          <IntroSection />
          <TimelineSection data={experience} />
        </>
      ),
    },
    {
      id: 'col-skills-cp-education',
      content: (
        <>
          <SkillsSection />
          <CPSection />
          <TimelineSection data={education} />
        </>
      ),
    },
    { id: 'col-projects', content: <ProjectsSection /> },
    {
      id: 'col-publications-writing',
      content: (
        <>
          <PublicationsSection />
          <WritingSection />
        </>
      ),
    },
  ]

  if (isMobile) {
    return (
      // h-full (not h-auto) is what makes this scroll: body/#root have
      // overflow hidden (see styles/index.css), so the wrapper must be
      // capped at <main>'s height for overflow-y-auto to kick in —
      // otherwise the content just spills out under the footer.
      <div className="h-full overflow-y-auto">
        {columns.map((col, i) => (
          <div key={col.id}>
            {col.content}
            {i < columns.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      className="scrollbar-thin relative h-full w-full overflow-x-auto overflow-y-hidden"
    >
      {/* column-fill: auto fills each column top-to-bottom before moving on
          (the default, `balance`, would spread content evenly instead).
          Tailwind has no utility for it, hence the arbitrary property. */}
      <div
        ref={columnsRef}
        className="h-full w-full columns-2 gap-0 [column-fill:auto] lg:columns-3"
      >
        {columns.map((col) => (
          <div key={col.id}>{col.content}</div>
        ))}
      </div>

      {/* The vertical divider at the right edge of every column is a
          `bg-wavy-border` tile (a repeating hand-drawn squiggle SVG
          registered in tailwind.config.js) instead of a straight rule, so
          columns read as hand-separated rather than ruled off. Positions
          come from useColumnDividers; the inline style is unavoidable here
          because they're measured at runtime. */}
      {Array.from({ length: dividers.count }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-full w-2.5 bg-wavy-border bg-right bg-repeat-y bg-[length:10px_28px]"
          style={{ left: (i + 1) * dividers.width - 10 }}
        />
      ))}
    </div>
  )
}

export default Portfolio
