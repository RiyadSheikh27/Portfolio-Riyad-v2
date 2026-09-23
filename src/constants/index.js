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
