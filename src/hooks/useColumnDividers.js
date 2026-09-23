// src/hooks/useColumnDividers.js
// -----------------------------------------------------------------------------
// Custom hook: measures a CSS multi-column element (`columns-*`) so the
// Portfolio page can draw one wavy divider per column. CSS `column-rule`
// only supports plain line styles (solid/dashed/dotted), not the
// hand-drawn squiggle used across this design, and the browser creates
// extra overflow columns on its own when content doesn't fit the height —
// so the only way to know how many dividers to draw, and where, is to
// measure after layout.
//
// Usage:
//   const { count, width } = useColumnDividers(columnsRef, enabled)
//   // count — how many columns currently exist (visible + overflow)
//   // width — the width of each column in px
// -----------------------------------------------------------------------------
import { useState, useEffect } from 'react'

export function useColumnDividers(columnsRef, enabled) {
  // The latest measurement. Starts empty so nothing is drawn until the
  // first real layout has been measured.
  const [layout, setLayout] = useState({ count: 0, width: 0 })

  useEffect(() => {
    // Side effect: measure now, and re-measure whenever the columns element
    // resizes (viewport width/height changes) or web fonts finish loading
    // (a font swap can re-flow text into more or fewer columns). Re-runs
    // when `enabled` flips, i.e. when switching between mobile/desktop.
    if (!enabled) return undefined
    const columns = columnsRef.current
    if (!columns) return undefined

    function measure() {
      const perScreen = parseInt(getComputedStyle(columns).columnCount, 10) || 1
      const width = columns.clientWidth / perScreen
      // Overflow columns extend the columns element's own scrollWidth, so
      // dividing by one column's width gives the total column count. This
      // deliberately reads `columns`, not `scroller`: the dividers live in
      // the scroller, so measuring it would count the previous render's
      // dividers as content and ratchet the count up on every resize (an
      // endless horizontal scroll). The small epsilon absorbs sub-pixel
      // rounding so we never draw a phantom extra divider.
      const count = Math.ceil(columns.scrollWidth / width - 0.01)
      setLayout((prev) =>
        prev.count === count && prev.width === width ? prev : { count, width },
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(columns)
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [columnsRef, enabled])

  return layout
}
