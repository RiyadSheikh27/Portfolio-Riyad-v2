// src/pages/Portfolio.jsx
// -----------------------------------------------------------------------------
// STUB — the full horizontal 4-column layout, wheel-to-horizontal-scroll
// handling, mobile stacking, and Framer Motion stagger animations will be
// built in the next session. For now this renders the four columns using
// the (stubbed) section components so the routing + layout skeleton is
// already wired up and visually verifiable.
//
// Planned column layout (desktop, left to right):
//   Col 1 — IntroSection + TimelineSection(experience)
//   Col 2 — SkillsSection + CPSection
//   Col 3 — ProjectsSection
//   Col 4 — TimelineSection(education) + WritingSection
// On mobile (useIsMobile), columns will stack vertically with Dividers
// between them instead of sitting side by side.
//
// Desktop column widths are responsive fractions of the viewport rather
// than a fixed pixel width, so the number of columns visible without
// scrolling shrinks gracefully as the window narrows: 3 columns fit at lg
// and up, 2 fit at the default (md-and-up, since <768px switches to the
// mobile branch entirely). Whatever doesn't fit is still reachable via
// horizontal scroll.
// -----------------------------------------------------------------------------
import { useEffect, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import IntroSection from '../components/sections/IntroSection'
import TimelineSection from '../components/sections/TimelineSection'
import SkillsSection from '../components/sections/SkillsSection'
import CPSection from '../components/sections/CPSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import WritingSection from '../components/sections/WritingSection'
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

  // Each column has a stable id (rather than relying on array index) so
  // React's reconciliation/key warnings stay clean even though the content
  // is currently a stub.
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
      id: 'col-skills-cp',
      content: (
        <>
          <SkillsSection />
          <CPSection />
        </>
      ),
    },
    { id: 'col-projects', content: <ProjectsSection /> },
    {
      id: 'col-education-writing',
      content: (
        <>
          <TimelineSection data={education} />
          <WritingSection />
        </>
      ),
    },
  ]

  if (isMobile) {
    return (
      <div className="h-auto overflow-y-auto">
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
      className="scrollbar-thin flex h-full w-full overflow-x-auto overflow-y-hidden"
    >
      {columns.map((col) => (
        <div
          key={col.id}
          // The vertical divider between columns is a `bg-wavy-border`
          // tile (a repeating hand-drawn squiggle SVG registered in
          // tailwind.config.js) instead of a straight `border-r`, so
          // columns read as hand-separated rather than ruled off.
          className="h-full w-1/2 flex-shrink-0 overflow-hidden bg-wavy-border bg-right bg-repeat-y bg-[length:10px_28px] lg:w-1/3"
        >
          {col.content}
        </div>
      ))}
    </div>
  )
}

export default Portfolio
