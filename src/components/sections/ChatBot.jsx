// src/components/sections/ChatBot.jsx
// -----------------------------------------------------------------------------
// A scripted "chat" with pre-written questions and answers — no free text,
// no backend. Visitors can't type; they pick one of the question chips
// (styled like the project stack Tags) and the matching answer is "typed"
// out letter by letter, ChatGPT-style. All content comes from
// src/api/index.js's `chatbot` export (backed by api/chatbot.json), so
// adding or editing a Q&A only ever means editing that JSON file.
//
// Answers may contain links written Markdown-style: `[link text](url)`.
//   - "/lets-talk"-style paths navigate in-app (React Router) and close the
//     panel, so it doesn't cover the page you just opened
//   - "mailto:" / "tel:" links open the mail / phone app
//   - anything else (https://…) opens in a new tab
// Link text is typed out like the rest of the answer and becomes a
// clickable link as it appears.
//
// Renders two things:
//   1. The trigger — "Ask Riyad" with a glowing bot icon, styled and
//      animated exactly like the Footer's "Let's talk" (ui/AttentionLabel),
//      placed next to it in the Footer.
//   2. The chat panel — a fixed popover that opens just above the footer.
//
// Accessibility: the panel closes on Escape, the trigger exposes
// aria-expanded, and users who prefer reduced motion get answers instantly
// (no typing effect) and no open/close animation.
// -----------------------------------------------------------------------------
import { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Bot, ChevronUp, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import AttentionLabel from '../ui/AttentionLabel'
import { chatbot } from '../../api'
import {
  ANIMATION_DURATION,
  ATTENTION_DURATION,
  ATTENTION_INTERVAL,
  TYPING_SPEED,
} from '../../constants'

// The id of the opening bot message, so it can be typed out on first open
// just like any other answer.
const GREETING_ID = 'greeting'

// Half of one nudge cycle, so the trigger's nudge lands midway between the
// Footer's "Let's talk" nudges and the two take turns.
const NUDGE_OFFSET = (ATTENTION_DURATION + ATTENTION_INTERVAL) / 2

// Matches Markdown-style links: [text](url)
const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g

// Splits an answer into plain-text and link segments, e.g.
//   "Mail [me](mailto:x@y.z)!" ->
//   [{ text: 'Mail ' }, { text: 'me', href: 'mailto:x@y.z' }, { text: '!' }]
// Pure function: string in, array out.
function parseSegments(text) {
  const segments = []
  let lastIndex = 0
  for (const match of text.matchAll(LINK_PATTERN)) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) })
    }
    segments.push({ text: match[1], href: match[2] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex) })
  return segments
}

// Total number of visible characters (link text only, not the URL syntax)
// — what the typing effect counts up to.
function visibleLength(segments) {
  return segments.reduce((sum, segment) => sum + segment.text.length, 0)
}

// Renders parsed segments, showing only the first `visible` characters so
// the typing effect can reveal links mid-word too. `onNavigate` fires when
// an in-app link is clicked (the panel uses it to close itself).
function RichText({ segments, visible = Infinity, onNavigate }) {
  let remaining = visible
  return segments.map((segment, index) => {
    if (remaining <= 0) return null
    const shown = segment.text.slice(0, remaining)
    remaining -= segment.text.length
    if (!segment.href) return <Fragment key={index}>{shown}</Fragment>

    const className =
      'text-red-glow underline decoration-red-glow/40 underline-offset-2 transition-colors hover:text-chalk hover:decoration-chalk'
    if (segment.href.startsWith('/')) {
      return (
        <Link key={index} to={segment.href} onClick={onNavigate} className={className}>
          {shown}
        </Link>
      )
    }
    const isExternal = /^https?:/.test(segment.href)
    return (
      <a
        key={index}
        href={segment.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {shown}
      </a>
    )
  })
}

RichText.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string.isRequired, href: PropTypes.string }),
  ).isRequired,
  visible: PropTypes.number,
  onNavigate: PropTypes.func,
}

// Reveals `text` (which may contain [links](url)) one visible character at
// a time (every TYPING_SPEED ms), with a blinking caret while it's still
// typing. `onTick` fires after every new
// character (the parent uses it to keep the chat scrolled to the bottom),
// and `onDone` fires once the whole text is visible. With `instant`, the
// full text shows immediately — used for reduced-motion users.
function TypingText({ text, instant, onTick, onDone, onNavigate }) {
  const segments = parseSegments(text)
  const total = visibleLength(segments)
  const [count, setCount] = useState(instant ? total : 0)

  useEffect(() => {
    // Side effect: schedule the next character. Re-runs after every
    // character (count changes), so each run only ever sets one timer;
    // the cleanup cancels it if the message unmounts mid-typing.
    onTick?.()
    if (count >= total) {
      onDone?.()
      return undefined
    }
    const timer = setTimeout(() => setCount((c) => c + 1), TYPING_SPEED)
    return () => clearTimeout(timer)
  }, [count]) // eslint-disable-line react-hooks/exhaustive-deps

  const isTyping = count < total

  return (
    <>
      <RichText segments={segments} visible={count} onNavigate={onNavigate} />
      {isTyping && (
        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-red-glow align-middle" />
      )}
    </>
  )
}

TypingText.propTypes = {
  text: PropTypes.string.isRequired,
  instant: PropTypes.bool,
  onTick: PropTypes.func,
  onDone: PropTypes.func,
  onNavigate: PropTypes.func,
}

function ChatBot() {
  const shouldReduceMotion = useReducedMotion()

  // Whether the chat panel is open.
  const [open, setOpen] = useState(false)

  // The conversation so far, oldest first. Each message is
  // { id, from: 'bot' | 'user', text }. Starts with the greeting.
  const [messages, setMessages] = useState([
    { id: GREETING_ID, from: 'bot', text: chatbot.greeting },
  ])

  // The id of the bot message currently being typed out (or null). While
  // an answer is typing, the question chips are disabled so answers can't
  // overlap.
  const [typingId, setTypingId] = useState(GREETING_ID)

  // A running counter for unique message ids. A ref, not state, because
  // bumping it should never trigger a re-render by itself.
  const nextId = useRef(0)

  // The scrollable message list, kept pinned to the newest message.
  const listRef = useRef(null)

  function scrollToBottom() {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }

  function ask(item) {
    if (typingId) return
    nextId.current += 1
    const botId = `bot-${nextId.current}`
    setMessages((prev) => [
      ...prev,
      { id: `user-${nextId.current}`, from: 'user', text: item.question },
      { id: botId, from: 'bot', text: item.answer },
    ])
    setTypingId(botId)
  }

  useEffect(() => {
    // Side effect: scroll to the newest message whenever one is added or
    // the panel opens (the list remounts at the top on every open).
    if (open) scrollToBottom()
  }, [messages, open])

  useEffect(() => {
    // Side effect: close the panel on Escape. Only listens while open.
    if (!open) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="group whitespace-nowrap text-xs font-bold uppercase tracking-widest text-red transition-colors hover:text-chalk"
      >
        <AttentionLabel
          icon={Bot}
          label={chatbot.title}
          delay={NUDGE_OFFSET}
          trailing={
            // Points up while closed (the panel opens upward), flips down
            // while open to hint that clicking again closes it.
            <ChevronUp
              size={14}
              strokeWidth={2}
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            />
          }
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={chatbot.title}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: ANIMATION_DURATION / 2 }}
            // Anchored just above the footer (bottom-14 clears its 42px
            // height), left-aligned with the footer's own padding, and never
            // wider than the screen minus its side gutters on phones.
            className="fixed bottom-14 left-4 z-50 flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col rounded-lg border border-border bg-bg-header text-sm shadow-2xl md:left-6"
          >
            {/* Panel header — bot icon, title/subtitle, close button. */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-glow/15 text-red-glow">
                  <Bot size={16} strokeWidth={2} />
                </span>
                <div>
                  <div className="font-semibold text-chalk">{chatbot.title}</div>
                  <div className="text-xs text-chalk-faint">{chatbot.subtitle}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-chalk-dim transition-colors hover:text-chalk"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Message list — bot bubbles on the left, the visitor's picked
                questions on the right in the accent color. */}
            <div
              ref={listRef}
              aria-live="polite"
              className="scrollbar-thin min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) =>
                message.from === 'bot' ? (
                  <div
                    key={message.id}
                    className="max-w-[85%] rounded-lg rounded-tl-sm bg-chalk/5 px-3 py-2 leading-relaxed text-chalk"
                  >
                    {message.id === typingId ? (
                      <TypingText
                        text={message.text}
                        instant={shouldReduceMotion}
                        onTick={scrollToBottom}
                        onDone={() => setTypingId(null)}
                        onNavigate={() => setOpen(false)}
                      />
                    ) : (
                      <RichText
                        segments={parseSegments(message.text)}
                        onNavigate={() => setOpen(false)}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    key={message.id}
                    className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm border border-red/30 bg-red/15 px-3 py-2 leading-relaxed text-chalk"
                  >
                    {message.text}
                  </div>
                ),
              )}
            </div>

            {/* Question chips — the only way to "talk". Disabled while an
                answer is still typing. */}
            <div className="border-t border-border px-4 py-3">
              <div className="mb-2 text-xs uppercase tracking-widest text-chalk-faint">
                Questions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chatbot.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => ask(item)}
                    disabled={Boolean(typingId)}
                    className="border border-border px-2 py-0.5 text-xs text-chalk-dim transition-colors hover:border-red hover:text-chalk disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-chalk-dim"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatBot
