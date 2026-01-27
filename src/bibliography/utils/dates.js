/**
 * Date Formatting Utilities
 *
 * Functions for formatting dates in various citation styles.
 *
 * @module @uniweb/scholar/bibliography/utils/dates
 */

/**
 * Month names for formatting
 */
const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTHS_SHORT = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May',
  'June',
  'July',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.',
]

/**
 * Parse a date from various formats
 *
 * @param {string|number|Date|Object} date - Date input
 * @returns {{ year?: number, month?: number, day?: number }}
 */
export function parseDate(date) {
  if (!date) return {}

  // Already structured
  if (typeof date === 'object' && !(date instanceof Date)) {
    return {
      year: date.year ?? date.Year,
      month: date.month ?? date.Month,
      day: date.day ?? date.Day,
    }
  }

  // JavaScript Date
  if (date instanceof Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    }
  }

  // Number (year only)
  if (typeof date === 'number') {
    return { year: date }
  }

  // String parsing
  const str = String(date).trim()

  // ISO format: YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?/)
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: isoMatch[2] ? parseInt(isoMatch[2], 10) : undefined,
      day: isoMatch[3] ? parseInt(isoMatch[3], 10) : undefined,
    }
  }

  // Year only
  const yearMatch = str.match(/^\d{4}$/)
  if (yearMatch) {
    return { year: parseInt(str, 10) }
  }

  // Month Year: "January 2024", "Jan 2024"
  const monthYearMatch = str.match(
    /^(\w+)\s+(\d{4})$/
  )
  if (monthYearMatch) {
    const monthName = monthYearMatch[1].toLowerCase()
    const monthIndex = MONTHS_FULL.findIndex(
      (m) => m.toLowerCase().startsWith(monthName.slice(0, 3))
    )
    return {
      year: parseInt(monthYearMatch[2], 10),
      month: monthIndex !== -1 ? monthIndex + 1 : undefined,
    }
  }

  return {}
}

/**
 * Format date for APA style
 *
 * @param {Object} date - Parsed date object
 * @returns {string}
 */
export function formatApaDate(date) {
  const parsed = parseDate(date)

  if (!parsed.year) return 'n.d.'

  if (parsed.month && parsed.day) {
    return `${parsed.year}, ${MONTHS_FULL[parsed.month - 1]} ${parsed.day}`
  }

  if (parsed.month) {
    return `${parsed.year}, ${MONTHS_FULL[parsed.month - 1]}`
  }

  return String(parsed.year)
}

/**
 * Format date for MLA style
 *
 * @param {Object} date - Parsed date object
 * @returns {string}
 */
export function formatMlaDate(date) {
  const parsed = parseDate(date)

  if (!parsed.year) return ''

  if (parsed.month && parsed.day) {
    return `${parsed.day} ${MONTHS_SHORT[parsed.month - 1]} ${parsed.year}`
  }

  if (parsed.month) {
    return `${MONTHS_SHORT[parsed.month - 1]} ${parsed.year}`
  }

  return String(parsed.year)
}

/**
 * Format date for Chicago style
 *
 * @param {Object} date - Parsed date object
 * @returns {string}
 */
export function formatChicagoDate(date) {
  const parsed = parseDate(date)

  if (!parsed.year) return 'n.d.'

  if (parsed.month && parsed.day) {
    return `${MONTHS_FULL[parsed.month - 1]} ${parsed.day}, ${parsed.year}`
  }

  if (parsed.month) {
    return `${MONTHS_FULL[parsed.month - 1]} ${parsed.year}`
  }

  return String(parsed.year)
}

/**
 * Format date for IEEE style
 *
 * @param {Object} date - Parsed date object
 * @returns {string}
 */
export function formatIeeeDate(date) {
  const parsed = parseDate(date)

  if (!parsed.year) return ''

  if (parsed.month) {
    return `${MONTHS_SHORT[parsed.month - 1]} ${parsed.year}`
  }

  return String(parsed.year)
}

/**
 * Format date for a specific style
 *
 * @param {any} date - Date input
 * @param {Object} [options]
 * @param {string} [options.style='apa'] - Citation style
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  const { style = 'apa' } = options

  switch (style) {
    case 'apa':
      return formatApaDate(date)
    case 'mla':
      return formatMlaDate(date)
    case 'chicago':
      return formatChicagoDate(date)
    case 'ieee':
      return formatIeeeDate(date)
    default:
      return formatApaDate(date)
  }
}

/**
 * Get year from date
 *
 * @param {any} date - Date input
 * @returns {number|undefined}
 */
export function getYear(date) {
  return parseDate(date).year
}
