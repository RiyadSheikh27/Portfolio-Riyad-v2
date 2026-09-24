// src/components/ui/IconButton.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: the square bordered icon button used in the
// Header's social links row. It renders a Lucide icon component when one is
// given, or falls back to plain label text (used for links like Codeforces
// that don't have a matching Lucide icon in socialLinks.icon === null).
//
// Props:
//   href     (string)          — link target (mailto:, https://, etc.)
//   icon     (component | null)— a Lucide icon component, or null
//   label    (string)          — accessible label (and tooltip)
//   short    (string)          — text shown instead of an icon when there's
//                                no icon (e.g. "CF"); falls back to label
//   external (bool)            — whether to open in a new tab
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'

function IconButton({ href, icon: Icon = null, label, short, external = true }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex h-9 w-9 items-center justify-center border border-border text-chalk-dim transition-colors hover:border-red hover:text-chalk md:h-10 md:w-10"
    >
      {Icon ? <Icon size={18} strokeWidth={1.75} /> : <span className="text-xs font-medium">{short ?? label}</span>}
    </a>
  )
}

IconButton.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  short: PropTypes.string,
  external: PropTypes.bool,
}

export default IconButton
