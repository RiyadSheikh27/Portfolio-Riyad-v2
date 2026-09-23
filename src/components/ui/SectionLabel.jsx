// src/components/ui/SectionLabel.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: renders the "01  INTRODUCTION" style label that
// sits at the top of every section (Intro, Experience, Skills, CP, Projects,
// Education, Writing). Extracting this into one component means the numeral
// + uppercase-name styling only has to be defined once — every section that
// needs a heading just renders <SectionLabel num={...} name={...} />.
//
// Props:
//   num  (string) — the zero-padded section number, e.g. "01"
//   name (string) — the section title, e.g. "Introduction"
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'

function SectionLabel({ num, name }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium tracking-widest text-chalk-dim">
      <span className="text-red">{num}</span>
      <span className="uppercase">{name}</span>
    </div>
  )
}

SectionLabel.propTypes = {
  num: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default SectionLabel
