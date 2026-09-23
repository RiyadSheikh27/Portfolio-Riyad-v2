// src/components/ui/SectionLabel.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: renders the "01  INTRODUCTION" style label that
// sits at the top of every section (Intro, Experience, Skills, CP, Projects,
// Education, Writing). Extracting this into one component means the numeral
// + uppercase-name styling only has to be defined once — every section that
// needs a heading just renders <SectionLabel num={...} name={...} />.
//
// The numeral uses the brighter `red-glow` (not the regular `red` used for
// item numbers inside sections), so "06 Projects" never gets confused with
// the "01 / 02 / 03" of the projects listed under it.
//
// `break-after-avoid` keeps a label from being stranded at the bottom of a
// desktop column with its content starting in the next one — the browser
// moves the label along with its first entry instead.
//
// Props:
//   num  (string) — the zero-padded section number, e.g. "01"
//   name (string) — the section title, e.g. "Introduction"
// -----------------------------------------------------------------------------
import PropTypes from 'prop-types'

function SectionLabel({ num, name }) {
  return (
    <div className="flex break-after-avoid items-center gap-2 text-sm font-medium tracking-widest text-chalk-dim">
      <span className="text-red-glow">{num}</span>
      <span className="uppercase">{name}</span>
    </div>
  )
}

SectionLabel.propTypes = {
  num: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default SectionLabel
