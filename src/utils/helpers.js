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
