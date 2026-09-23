// src/components/ui/Divider.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: a single horizontal rule used to visually
// separate stacked sections, most importantly on mobile where columns
// collapse into one vertical flow (desktop uses vertical border-r column
// dividers instead, so this is mainly a mobile-layout building block).
//
// No props — it's purely presentational and stateless.
// -----------------------------------------------------------------------------
function Divider() {
  return <hr className="border-t border-border" />
}

export default Divider
