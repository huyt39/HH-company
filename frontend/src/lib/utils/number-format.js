/**
 * Canonical number formatting: every user-facing number goes through here.
 * Vietnamese convention, dot as thousands separator (45.103.262.902). Never
 * call `toLocaleString()` without a locale in a component — the result would
 * depend on the browser's locale.
 */
const VND_FORMATTER = new Intl.NumberFormat('vi-VN')

const BILLION_FORMATTER = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const EMPTY = '—'

/** @example formatNumber(45103262902) // "45.103.262.902" */
export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY
  return VND_FORMATTER.format(value)
}

/** VND amount. Same format as `formatNumber`, named for the context. */
export const formatVnd = formatNumber

/**
 * Convert to billions of VND, one decimal place.
 * @example formatBillion(45103262902) // "45,1"
 */
export function formatBillion(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY
  return BILLION_FORMATTER.format(value / 1_000_000_000)
}
