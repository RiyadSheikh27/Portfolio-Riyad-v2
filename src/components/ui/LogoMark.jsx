// src/components/ui/LogoMark.jsx
// -----------------------------------------------------------------------------
// Tiny reusable primitive: the "{ }" brand mark — bright red-glow braces on
// the header background inside a faint rounded outline. It's the same
// drawing as public/favicon.svg (keep the two in sync), so the mark in the
// Header and the browser-tab icon always match. Colors come from the
// Tailwind theme via fill-/stroke- utilities rather than hardcoded hex.
//
// It fills whatever box its parent gives it, so size it from the outside.
// -----------------------------------------------------------------------------
function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="12"
        strokeWidth="2"
        className="fill-bg-header stroke-chalk/25"
      />
      <g
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-red-glow"
      >
        <path d="M27 12 C19 12 19 17 19 23 L19 26 C19 30 17 32 11 32 C17 32 19 34 19 38 L19 41 C19 47 19 52 27 52" />
        <path d="M37 12 C45 12 45 17 45 23 L45 26 C45 30 47 32 53 32 C47 32 45 34 45 38 L45 41 C45 47 45 52 37 52" />
      </g>
    </svg>
  )
}

export default LogoMark
