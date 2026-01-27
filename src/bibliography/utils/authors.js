/**
 * Author Name Utilities
 *
 * Functions for parsing and formatting author names in various citation styles.
 *
 * @module @uniweb/scholar/bibliography/utils/authors
 */

/**
 * Parse a single author name string into structured parts
 *
 * @param {string} name - Author name (e.g., "Smith, John A." or "John A. Smith")
 * @returns {{ family: string, given: string, suffix?: string }}
 */
export function parseAuthorName(name) {
  if (!name || typeof name !== 'string') {
    return { family: '', given: '' }
  }

  const trimmed = name.trim()

  // Check for "Last, First" format
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map((p) => p.trim())
    const family = parts[0]
    const givenAndSuffix = parts.slice(1).join(' ').trim()

    // Check for suffix (Jr., Sr., III, etc.)
    const suffixMatch = givenAndSuffix.match(/\s+(Jr\.?|Sr\.?|III?|IV|V)$/i)
    if (suffixMatch) {
      return {
        family,
        given: givenAndSuffix.slice(0, suffixMatch.index).trim(),
        suffix: suffixMatch[1],
      }
    }

    return { family, given: givenAndSuffix }
  }

  // "First Last" format - last word is family name
  const words = trimmed.split(/\s+/)
  if (words.length === 1) {
    return { family: words[0], given: '' }
  }

  // Check if last word is a suffix
  const lastWord = words[words.length - 1]
  if (/^(Jr\.?|Sr\.?|III?|IV|V)$/i.test(lastWord)) {
    return {
      family: words[words.length - 2] || '',
      given: words.slice(0, -2).join(' '),
      suffix: lastWord,
    }
  }

  return {
    family: words[words.length - 1],
    given: words.slice(0, -1).join(' '),
  }
}

/**
 * Parse a string of multiple authors
 *
 * @param {string} authorString - Authors separated by "and", ";", or "&"
 * @returns {Array<{ family: string, given: string, suffix?: string }>}
 */
export function parseAuthorString(authorString) {
  if (!authorString || typeof authorString !== 'string') {
    return []
  }

  // Split by "and", ";", or "&"
  const authors = authorString
    .split(/\s+and\s+|;\s*|&\s*/i)
    .map((a) => a.trim())
    .filter(Boolean)

  return authors.map(parseAuthorName)
}

/**
 * Get author initials
 *
 * @param {string} given - Given name(s)
 * @param {Object} [options]
 * @param {boolean} [options.periods=true] - Include periods after initials
 * @param {boolean} [options.spaces=true] - Include spaces between initials
 * @returns {string}
 */
export function getInitials(given, options = {}) {
  const { periods = true, spaces = true } = options

  if (!given) return ''

  const names = given.split(/\s+/)
  const initials = names
    .map((name) => name.charAt(0).toUpperCase())
    .map((initial) => (periods ? `${initial}.` : initial))

  return initials.join(spaces ? ' ' : '')
}

/**
 * Format authors for APA style
 *
 * @param {Array} authors - Array of parsed author objects
 * @param {number} [maxAuthors=20] - Maximum authors before using et al.
 * @returns {string}
 */
export function formatApaAuthors(authors, maxAuthors = 20) {
  if (!authors?.length) return ''

  const formatOne = (author) => {
    const initials = getInitials(author.given, { periods: true, spaces: true })
    const suffix = author.suffix ? `, ${author.suffix}` : ''
    return initials
      ? `${author.family}${suffix}, ${initials}`
      : author.family + suffix
  }

  if (authors.length === 1) {
    return formatOne(authors[0])
  }

  if (authors.length === 2) {
    return `${formatOne(authors[0])} & ${formatOne(authors[1])}`
  }

  if (authors.length <= maxAuthors) {
    const allButLast = authors.slice(0, -1).map(formatOne).join(', ')
    return `${allButLast}, & ${formatOne(authors[authors.length - 1])}`
  }

  // More than maxAuthors: first 19, ..., last
  const first19 = authors.slice(0, 19).map(formatOne).join(', ')
  return `${first19}, ... ${formatOne(authors[authors.length - 1])}`
}

/**
 * Format authors for MLA style
 *
 * @param {Array} authors - Array of parsed author objects
 * @returns {string}
 */
export function formatMlaAuthors(authors) {
  if (!authors?.length) return ''

  const formatFirst = (author) => {
    const suffix = author.suffix ? `, ${author.suffix}` : ''
    return author.given
      ? `${author.family}${suffix}, ${author.given}`
      : author.family + suffix
  }

  const formatSubsequent = (author) => {
    const suffix = author.suffix ? `, ${author.suffix}` : ''
    return author.given
      ? `${author.given} ${author.family}${suffix}`
      : author.family + suffix
  }

  if (authors.length === 1) {
    return formatFirst(authors[0])
  }

  if (authors.length === 2) {
    return `${formatFirst(authors[0])}, and ${formatSubsequent(authors[1])}`
  }

  if (authors.length === 3) {
    return `${formatFirst(authors[0])}, ${formatSubsequent(authors[1])}, and ${formatSubsequent(authors[2])}`
  }

  // 4+ authors: first author et al.
  return `${formatFirst(authors[0])}, et al.`
}

/**
 * Format authors for Chicago style (author-date)
 *
 * @param {Array} authors - Array of parsed author objects
 * @returns {string}
 */
export function formatChicagoAuthors(authors) {
  if (!authors?.length) return ''

  const formatOne = (author, isFirst = false) => {
    const suffix = author.suffix ? `, ${author.suffix}` : ''
    if (isFirst) {
      return author.given
        ? `${author.family}${suffix}, ${author.given}`
        : author.family + suffix
    }
    return author.given
      ? `${author.given} ${author.family}${suffix}`
      : author.family + suffix
  }

  if (authors.length === 1) {
    return formatOne(authors[0], true)
  }

  if (authors.length === 2) {
    return `${formatOne(authors[0], true)} and ${formatOne(authors[1])}`
  }

  if (authors.length === 3) {
    return `${formatOne(authors[0], true)}, ${formatOne(authors[1])}, and ${formatOne(authors[2])}`
  }

  // 4+ authors: first author et al.
  return `${formatOne(authors[0], true)} et al.`
}

/**
 * Format authors for IEEE style
 *
 * @param {Array} authors - Array of parsed author objects
 * @returns {string}
 */
export function formatIeeeAuthors(authors) {
  if (!authors?.length) return ''

  const formatOne = (author) => {
    const initials = getInitials(author.given, { periods: true, spaces: true })
    const suffix = author.suffix ? ` ${author.suffix}` : ''
    return initials
      ? `${initials} ${author.family}${suffix}`
      : author.family + suffix
  }

  if (authors.length === 1) {
    return formatOne(authors[0])
  }

  if (authors.length === 2) {
    return `${formatOne(authors[0])} and ${formatOne(authors[1])}`
  }

  // 3+ authors in IEEE: first author et al. in citations, all in references
  const allButLast = authors.slice(0, -1).map(formatOne).join(', ')
  return `${allButLast}, and ${formatOne(authors[authors.length - 1])}`
}

/**
 * Format authors for a specific style
 *
 * @param {Array|string} authors - Authors array or string
 * @param {Object} [options]
 * @param {string} [options.style='apa'] - Citation style
 * @param {number} [options.max=20] - Max authors before et al.
 * @returns {string}
 */
export function formatAuthors(authors, options = {}) {
  const { style = 'apa', max = 20 } = options

  // Parse if string
  const parsed =
    typeof authors === 'string' ? parseAuthorString(authors) : authors

  if (!parsed?.length) return ''

  switch (style) {
    case 'apa':
      return formatApaAuthors(parsed, max)
    case 'mla':
      return formatMlaAuthors(parsed)
    case 'chicago':
      return formatChicagoAuthors(parsed)
    case 'ieee':
      return formatIeeeAuthors(parsed)
    default:
      return formatApaAuthors(parsed, max)
  }
}
