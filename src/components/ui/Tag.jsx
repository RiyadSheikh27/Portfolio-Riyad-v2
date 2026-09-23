// src/components/ui/Tag.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: a small pill/chip label. Used on ProjectsSection
// to render each entry in a project's "stack" string (e.g. "FastAPI",
// "Redis", "PostgreSQL") as its own visually distinct tag.
//
// Props:
//   text (string) — the label text to display inside the tag
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'

function Tag({ text }) {
  return (
    <span className="border border-border px-2 py-0.5 text-xs text-chalk-dim">
      {text}
    </span>
  )
}

Tag.propTypes = {
  text: PropTypes.string.isRequired,
}

export default Tag
