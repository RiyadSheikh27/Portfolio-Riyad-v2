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
//   label    (string)          — accessible label / fallback text
//   external (bool)            — whether to open in a new tab
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'

function IconButton({ href, icon: Icon, label, external }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex h-8 w-8 items-center justify-center border border-border text-chalk-dim transition-colors hover:border-red hover:text-chalk"
    >
      {Icon ? <Icon size={14} strokeWidth={1.75} /> : <span className="text-[10px] font-medium">{label}</span>}
    </a>
  )
}

IconButton.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  external: PropTypes.bool,
}

IconButton.defaultProps = {
  icon: null,
  external: true,
}

export default IconButton
