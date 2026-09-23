// src/hooks/useIsMobile.js
// -----------------------------------------------------------------------------
// Custom hook: tells components whether the viewport is "mobile" width
// (< MOBILE_BREAKPOINT). The Portfolio page uses this to switch between the
// desktop horizontal-scroll column layout and a simple vertical mobile
// layout. Extracting this into a hook (instead of checking window.innerWidth
// inline in every component) means the breakpoint logic — and the resize
// listener that keeps it live — is written once and reused anywhere.
// -----------------------------------------------------------------------------
import { useState, useEffect } from 'react'
import { MOBILE_BREAKPOINT } from '../constants'

export function useIsMobile() {
  // Holds the current true/false "is mobile" reading. Initialized eagerly
  // from window.innerWidth (rather than defaulting to false) so the very
  // first render already reflects the real viewport instead of flashing
  // the wrong layout for a frame.
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT,
  )

  useEffect(() => {
    // Side effect: subscribe to the window resize event so isMobile stays
    // accurate as the user resizes the browser or rotates their device.
    // Empty dependency array — this listener is set up once on mount and
    // torn down on unmount; it doesn't need to re-run on every render.
    function handleResize() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}
