// tailwind.config.js
// -----------------------------------------------------------------------------
// This file is the single source of truth for the portfolio's design tokens.
// Instead of hardcoding hex colors / pixel widths inside components, every
// component reads from these theme values via Tailwind utility classes
// (e.g. `bg-bg-header`, `text-red`). This keeps the visual language
// consistent and means a redesign only requires editing this file.
//
// Desktop column widths (how many Portfolio columns fit on screen at once)
// are NOT defined here as fixed pixel widths — they're responsive fractions
// set directly on the column elements in Portfolio.jsx (`w-1/2 lg:w-1/3`),
// so the visible column count adapts to viewport size using Tailwind's
// standard fraction utilities instead of a magic pixel number.
//
// The wavy column border (`bg-wavy-border`, used instead of `border-r` on
// the Portfolio desktop columns) is a hand-drawn-looking squiggle rather
// than a straight line. Tailwind has no built-in "wavy border" utility, so
// per the "custom value in tailwind.config.js" rule, it's expressed as a
// tiny repeating SVG background image (a gentle S-curve stroke) instead of
// a CSS border — that SVG is generated once, below, from template values
// rather than hardcoded as an opaque data string.
// -----------------------------------------------------------------------------

// One tile of the wavy border: a single S-curve stroke in a narrow,
// vertically-repeatable box. Tiling this vertically (`bg-repeat-y`) produces
// a continuous hand-drawn-looking squiggle down the whole column height.
const wavyBorderTile = `
  <svg xmlns='http://www.w3.org/2000/svg' width='10' height='28'>
    <path d='M5 0 C9 7 1 21 5 28' stroke='rgba(232,228,220,0.4)' stroke-width='1.5' fill='none' />
  </svg>
`

/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind scans these files for class names so it can generate only the
  // CSS that is actually used (keeps the production bundle small).
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base app background + a slightly darker shade for the header bar.
        bg: {
          DEFAULT: '#111110',
          header: '#0d0d0c',
        },
        // "chalk" = the off-white text color family used for body copy.
        // `dim` and `faint` are used for secondary/tertiary text so we never
        // have to hand-roll opacity values inline.
        chalk: {
          DEFAULT: '#e8e4dc',
          dim: '#9a9488',
          faint: '#525048',
        },
        // The single accent color used for eyebrows, status dot, and links.
        red: {
          DEFAULT: '#c0392b',
          dim: '#922b21',
          // A brighter, lamp-like red for top-level accents: the header's
          // availability "status light" (paired with `shadow-glow` below),
          // the designation under the name, and every section numeral —
          // so those read one step brighter than the regular `red` used for
          // item-level details (project/publication numbers, dates, links).
          glow: '#ff4d3a',
        },
        // Shared hairline border color used across cards, columns, header/footer.
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        // Space Grotesk becomes the default sans font everywhere (see
        // index.html for the Google Fonts <link> that actually loads the
        // font files).
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        // A casual, hand-marker display face used ONLY for the header's
        // name and the intro quote — everything else stays on Space
        // Grotesk. Loaded via Google Fonts in index.html alongside it.
        hand: ['"Permanent Marker"', 'cursive'],
      },
      // Custom fixed heights referenced by the sticky Footer bar.
      height: {
        footer: '42px',
      },
      // Soft halo around the availability status light, so the dot reads
      // as a glowing lamp rather than a flat circle.
      boxShadow: {
        glow: '0 0 8px 2px rgba(255,77,58,0.95), 0 0 18px 6px rgba(255,77,58,0.4)',
      },
      // Same glow, as a filter, for SVG icons (box-shadow would draw a
      // square around the icon's bounding box instead of tracing its shape).
      // Used on the footer's "Let's talk" icon.
      dropShadow: {
        glow: '0 0 4px rgba(255,77,58,0.9)',
      },
      // The wavy column border, as a repeatable background image (see the
      // comment above `wavyBorderTile`) rather than a straight CSS border.
      backgroundImage: {
        'wavy-border': `url("data:image/svg+xml,${encodeURIComponent(wavyBorderTile)}")`,
      },
    },
  },
  plugins: [],
}
