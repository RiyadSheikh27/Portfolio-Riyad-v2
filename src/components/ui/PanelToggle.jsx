// src/components/ui/PanelToggle.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: the square toggle button that opens/closes one of
// the Header's expandable panels (section nav, social links). Same size and
// hairline border as IconButton, but the icon is in the bright `red-glow`
// accent — matching the designation, section numerals and availability
// bullet — and the border turns red-glow while its panel is open. While
// open, the icon swaps to an X.
//
// Props:
//   open   (bool)      — whether the panel is open
//   onClick(func)      — toggles the panel
//   icon   (component) — Lucide icon shown while closed
//   label  (string)    — what the panel is, for screen readers ("section
//                        navigation" → "Open/Close section navigation")
//   text   (string)    — optional visible caption beside the icon, for
//                        toggles whose icon alone doesn't say what's inside
//                        (e.g. "Connect" for the social links). The button
//                        widens to fit it from `lg` up; below that it stays
//                        an icon-only square, since phone and tablet header
//                        rows have no spare width (and their dropdowns
//                        label every item anyway).
//   strokeWidth(number)— icon line weight (default 1.75). Thin-line icons
//                        like the ≡ menu read dimmer than ring-heavy ones
//                        in the same color, so they can be drawn heavier
//                        to match.
//   compact(bool)      — hide the caption on xl+ (icon-only square), used
//                        while the other panel's inline list needs the room
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'
import { X } from 'lucide-react'

function PanelToggle({ open, onClick, icon: Icon, label, text, strokeWidth = 1.75, compact = false }) {
  const ShownIcon = open ? X : Icon
  // Square when icon-only; widens to fit the caption from lg up (and back
  // to a square on xl+ while `compact`).
  let shape = 'w-9 md:w-10'
  if (text) shape = `w-9 md:w-10 lg:w-auto lg:gap-2 lg:px-3 ${compact ? 'xl:w-10 xl:gap-0 xl:px-0' : ''}`
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${open ? 'Close' : 'Open'} ${label}`}
      aria-expanded={open}
      className={`flex h-9 flex-shrink-0 items-center justify-center border text-red-glow transition-colors md:h-10 ${shape} ${
        open ? 'border-red-glow' : 'border-border hover:border-red-glow'
      }`}
    >
      <ShownIcon size={18} strokeWidth={strokeWidth} />
      {text && (
        <span
          className={`hidden whitespace-nowrap text-xs font-bold uppercase tracking-widest lg:inline ${
            compact ? 'xl:hidden' : ''
          }`}
        >
          {text}
        </span>
      )}
    </button>
  )
}

PanelToggle.propTypes = {
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  strokeWidth: PropTypes.number,
  compact: PropTypes.bool,
}

export default PanelToggle
