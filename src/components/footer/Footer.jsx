// src/components/footer/Footer.jsx
// -----------------------------------------------------------------------------
// The persistent bottom bar shown on every page (rendered once by AppLayout).
// Left side shows the footer tagline from portfolio.json; right side is the
// ONLY navigation link to the /lets-talk page in the whole app. Using
// React Router's <Link> (instead of a plain <a>) means this navigates
// client-side without a full page reload.
// -----------------------------------------------------------------------------
import { Link } from 'react-router-dom'
import { meta } from '../../api'

function Footer() {
  return (
    <footer className="flex h-footer w-full flex-shrink-0 items-center justify-between border-t border-border bg-bg-header px-6 text-xs text-chalk-dim">
      <span>{meta.footerTagline}</span>
      <Link
        to="/lets-talk"
        className="text-chalk-dim transition-colors hover:text-red"
      >
        Let&apos;s talk ↗
      </Link>
    </footer>
  )
}

export default Footer
