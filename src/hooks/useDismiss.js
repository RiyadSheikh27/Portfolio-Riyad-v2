// src/hooks/useDismiss.js
// -----------------------------------------------------------------------------
// Custom hook: closes one of the Header's expandable panels (SectionNav,
// SocialLinks) the ways people expect —
//   - Escape closes it, in both presentations
//   - a click/tap outside `ref` closes it, but only while it's showing as a
//     dropdown (below HEADER_INLINE_BREAKPOINT). The inline row on wide
//     screens stays put until its own toggle is clicked again.
// Listeners are only attached while the panel is open.
//
// Usage:
//   useDismiss(open, onClose, wrapperRef)
// -----------------------------------------------------------------------------
import { useEffect } from 'react'
import { HEADER_INLINE_BREAKPOINT } from '../constants'

export function useDismiss(open, onClose, ref) {
  useEffect(() => {
    // Side effect: subscribe to Escape + outside pointer presses while open.
    // Re-subscribes if `open` or `onClose` changes.
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    function handlePointerDown(event) {
      if (window.innerWidth >= HEADER_INLINE_BREAKPOINT) return
      if (!ref.current?.contains(event.target)) onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open, onClose, ref])
}
