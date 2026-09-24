// src/components/footer/Footer.jsx
// -----------------------------------------------------------------------------
// The persistent bottom bar shown on every page (rendered once by AppLayout).
// Left side is the ONLY navigation link to the /lets-talk page in the whole
// app, then — after a hairline divider, like the Header's name | availability
// split — the ChatBot's "Ask Riyad" trigger (components/sections/ChatBot.jsx).
// Right side shows the footer tagline from portfolio.json. Using
// React Router's <Link> (instead of a plain <a>) means this navigates
// client-side without a full page reload.
//
// Both footer triggers ("Let's talk" and the ChatBot's "Ask Riyad") share
// the Header designation's styling (red, bold, uppercase, wide tracking) and
// the same periodic eye-catching nudge, via ui/AttentionLabel. The ChatBot's
// nudge is offset by half a cycle so the two take turns instead of jumping
// in unison.
// -----------------------------------------------------------------------------
import { Link } from 'react-router-dom'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import AttentionLabel from '../ui/AttentionLabel'
import ChatBot from '../sections/ChatBot'
import { meta } from '../../api'

function Footer() {
  return (
    <footer className="flex h-footer w-full flex-shrink-0 items-center justify-between border-t border-border bg-bg-header px-4 text-xs md:px-6 text-chalk-dim">
      <div className="flex items-center gap-4">
        <Link
          to="/lets-talk"
          className="group whitespace-nowrap text-xs font-bold uppercase tracking-widest text-red transition-colors hover:text-chalk"
        >
          <AttentionLabel
            icon={MessageCircle}
            label="Let's talk"
            trailing={
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            }
          />
        </Link>

        {/* Hairline divider + chat trigger. */}
        <div className="flex h-5 items-center border-l border-border pl-4">
          <ChatBot />
        </div>
      </div>

      {/* The tagline is decorative, so it's dropped on phones (< sm) where
          Let's talk + the chat trigger need the whole footer width. */}
      <span className="hidden truncate pl-4 sm:inline">{meta.footerTagline}</span>
    </footer>
  )
}

export default Footer
