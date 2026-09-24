// src/constants/index.js
// -----------------------------------------------------------------------------
// App-wide "magic numbers" collected in one place. Anything that would
// otherwise be a hardcoded number sprinkled across components (breakpoints,
// animation timings, layout sizes) lives here instead, so there is exactly
// one place to look when tuning behavior and no risk of two components
// silently disagreeing about, say, what "mobile" means.
// -----------------------------------------------------------------------------

// Matches Tailwind's default `md` breakpoint. useIsMobile compares
// window.innerWidth against this to decide desktop vs. mobile layout.
export const MOBILE_BREAKPOINT = 768

// Base duration (seconds) for Framer Motion fade/slide-up transitions.
export const ANIMATION_DURATION = 0.4

// Per-item stagger delay (seconds) used when animating a list of columns or
// timeline entries so they appear one after another instead of all at once.
export const STAGGER_DELAY = 0.08

// Seconds of stillness between each "attention" nudge on the footer's
// Let's talk call-to-action (the nudge itself lasts ATTENTION_DURATION).
export const ATTENTION_INTERVAL = 3
export const ATTENTION_DURATION = 0.8

// Milliseconds between each character when the ChatBot "types" an answer.
export const TYPING_SPEED = 18

// Matches Tailwind's `xl` breakpoint. From here up, the Header's section
// nav and social links expand INLINE in the header row; below it, they
// open as dropdowns instead (there isn't room for them inline).
export const HEADER_INLINE_BREAKPOINT = 1280
