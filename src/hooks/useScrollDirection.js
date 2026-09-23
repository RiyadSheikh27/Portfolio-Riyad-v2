// src/hooks/useScrollDirection.js
// -----------------------------------------------------------------------------
// Custom hook: tracks which way a scrollable element last scrolled
// horizontally ('left' | 'right' | null). Not required for the core
// Portfolio layout (which just redirects vertical wheel input to horizontal
// scroll), but kept available for optional UI touches — e.g. showing/hiding
// a "scroll for more" hint, or fading a directional arrow — without every
// consumer re-implementing scroll-position bookkeeping.
//
// Usage: pass the ref of the scrollable container.
//   const direction = useScrollDirection(scrollContainerRef)
// -----------------------------------------------------------------------------
import { useState, useEffect, useRef } from 'react'

export function useScrollDirection(scrollRef) {
  // Holds the last detected scroll direction, read by consumers that want to
  // react to it (e.g. toggling a "scroll for more" affordance).
  const [direction, setDirection] = useState(null)

  // Remembers the previous scrollLeft value between scroll events so we can
  // diff against it. A ref (not state) because updating it should never by
  // itself trigger a re-render — it's just bookkeeping.
  const lastScrollLeft = useRef(0)

  useEffect(() => {
    // Side effect: attach a scroll listener to the given container and
    // recompute direction whenever it fires. Depends on `scrollRef` — if a
    // different ref/element is passed in, we re-subscribe to that one.
    const node = scrollRef.current
    if (!node) return

    function handleScroll() {
      const current = node.scrollLeft
      if (current > lastScrollLeft.current) {
        setDirection('right')
      } else if (current < lastScrollLeft.current) {
        setDirection('left')
      }
      lastScrollLeft.current = current
    }

    node.addEventListener('scroll', handleScroll)
    return () => node.removeEventListener('scroll', handleScroll)
  }, [scrollRef])

  return direction
}
