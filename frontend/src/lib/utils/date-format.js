/**
 * Canonical date formatting: every user-facing date goes through here so the
 * whole site reads `dd/MM/yyyy` and 24-hour `HH:mm`. Input is ISO from the API.
 */
const EMPTY = '—'

const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

// The API sends UTC timestamps without a zone ("2026-09-05T16:35:03"), which
// `Date` would read as local time — seven hours off in Vietnam, enough to
// show the wrong day. Mark them as UTC; date-only values are left alone.
const NAIVE_TIMESTAMP = /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/

export function toDate(value) {
  if (!value) return null
  const date = new Date(typeof value === 'string' && NAIVE_TIMESTAMP.test(value) ? `${value}Z` : value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** @example formatDate('2025-03-14') // "14/03/2025" */
export function formatDate(value) {
  const date = toDate(value)
  return date ? DATE_FORMATTER.format(date) : EMPTY
}

/** @example formatDateTime('2025-03-14T09:30:00Z') // "14/03/2025 16:30" */
export function formatDateTime(value) {
  const date = toDate(value)
  return date ? DATE_TIME_FORMATTER.format(date) : EMPTY
}
