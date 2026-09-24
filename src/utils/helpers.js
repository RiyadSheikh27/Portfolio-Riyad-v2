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
