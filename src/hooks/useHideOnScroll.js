// src/hooks/useHideOnScroll.js
// -----------------------------------------------------------------------------
// Custom hook: reports whether the Header should be hidden because the
// visitor is scrolling DOWN the page (and shown again as soon as they
// scroll UP, or get back near the top). Used on phones only, to give the
// content the full screen height while reading.
//
// The page doesn't scroll the window: on mobile, Portfolio.jsx renders its
// own `overflow-y-auto` wrapper as the direct child of <main>. Scroll
// events don't bubble, so this listens in the CAPTURE phase on document
// and only reacts to that wrapper (a direct child of <main>) — scrolling
// inside other things, like the ChatBot's message list, is ignored.
//
// Usage:
//   const hidden = useHideOnScroll(enabled)
//   // enabled — false forces the header visible (e.g. desktop, or while
//   //           one of its dropdowns is open)
// -----------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react'

// Ignore scroll jitter smaller than this (px) before changing direction.
const THRESHOLD = 8

// Always show the header within this many px of the top.
const TOP_ZONE = 16

export function useHideOnScroll(enabled) {
  const [hidden, setHidden] = useState(false)

  // Last scrollTop a direction decision was based on. A ref, not state:
  // updating it should never trigger a re-render by itself.
  const lastTop = useRef(0)

  useEffect(() => {
    // Side effect: subscribe to page scrolling while enabled. Re-runs when
    // `enabled` flips.
    if (!enabled) return undefined

    function handleScroll(event) {
      const target = event.target
      if (!(target instanceof Element) || target.parentElement?.tagName !== 'MAIN') return

      const top = target.scrollTop
      if (top <= TOP_ZONE) {
        setHidden(false)
        lastTop.current = top
        return
      }
      const delta = top - lastTop.current
      if (Math.abs(delta) < THRESHOLD) return
      setHidden(delta > 0)
      lastTop.current = top
    }

    document.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    return () => document.removeEventListener('scroll', handleScroll, { capture: true })
  }, [enabled])

  // Disabled always means visible — derived here rather than reset in the
  // effect, so re-enabling starts from the last real scroll direction.
  return enabled && hidden
}
