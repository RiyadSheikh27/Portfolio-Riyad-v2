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
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'
import { X } from 'lucide-react'

function PanelToggle({ open, onClick, icon: Icon, label }) {
  const ShownIcon = open ? X : Icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${open ? 'Close' : 'Open'} ${label}`}
      aria-expanded={open}
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center border text-red-glow transition-colors md:h-10 md:w-10 ${
        open ? 'border-red-glow' : 'border-border hover:border-red-glow'
      }`}
    >
      <ShownIcon size={18} strokeWidth={1.75} />
    </button>
  )
}

PanelToggle.propTypes = {
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
}

export default PanelToggle
