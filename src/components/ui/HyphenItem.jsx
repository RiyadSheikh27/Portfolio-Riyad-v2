// src/components/ui/HyphenItem.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: renders a single "— some text" row. Used by
// CPSection (one row per achievement), so the "hyphen bullet" visual
// pattern lives in exactly one place instead of being copy-pasted.
//
// The "—" is colored to match SectionLabel's numeral (red), so every
// section's red accents — numeral, dates, hyphens — read as one system.
//
// Props:
//   text (string) — the text to render after the hyphen
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'

function HyphenItem({ text }) {
  return (
    <p className="text-base leading-relaxed text-chalk-dim">
      <span className="text-red">— </span>
      {text}
    </p>
  )
}

HyphenItem.propTypes = {
  text: PropTypes.string.isRequired,
}

export default HyphenItem
