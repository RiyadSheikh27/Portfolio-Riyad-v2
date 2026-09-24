// src/utils/helpers.js
// -----------------------------------------------------------------------------
// Pure helper functions: no React, no side effects, just data-in/data-out
// transforms. Kept separate from components so components stay focused on
// rendering, and so these functions are trivially testable/reusable on their
// own (they take arguments and return values, nothing else).
// -----------------------------------------------------------------------------

/**
 * Truncates a string to a max length, appending an ellipsis if it was cut.
 * Used anywhere a column has limited vertical space and a description could
 * otherwise overflow (e.g. Projects, Writing).
 */
export function truncateText(text, maxLength = 140) {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

/**
 * Formats a "start — end" date range consistently. The portfolio JSON
 * already stores pre-formatted ranges like "2023 — Present", but this
 * exists so any future data source that provides separate start/end values
 * can still produce the same on-screen format without touching components.
 */
export function formatDateRange(start, end = 'Present') {
  return `${start} — ${end}`
}

/**
 * Turns a section name into the DOM id its section element carries, e.g.
 * "Competitive Programming" -> "section-competitive-programming". Both the
 * section components (to set the id) and the Header's SectionNav (to find
 * the element to scroll to) call this, so the two can never disagree.
 */
export function toSectionId(sectionName) {
  return `section-${sectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

/**
 * Converts a positive integer to an uppercase Roman numeral, e.g. 1 -> "I",
 * 4 -> "IV", 12 -> "XII". Used for entry numbering inside sections
 * (projects, publications, certificates, writing), so it reads as a
 * different level from the "01"-style section numbers.
 */
export function toRoman(value) {
  const numerals = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let remaining = value
  let result = ''
  for (const [amount, numeral] of numerals) {
    while (remaining >= amount) {
      result += numeral
      remaining -= amount
    }
  }
  return result
}
