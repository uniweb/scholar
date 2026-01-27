/**
 * Bibliography Module
 *
 * Utilities for formatting bibliographic references in various citation styles.
 *
 * @module @uniweb/scholar/bibliography
 */

// Formatters
export {
  formatReference,
  formatApa,
  formatMla,
  formatChicago,
  formatIeee,
  formatters,
} from './formatters/index.js'

// Parsers
export { parseBibtex, exportBibtex } from './parsers/index.js'

// Utilities
export {
  formatAuthors,
  parseAuthorName,
  parseAuthorString,
  getInitials,
  formatApaAuthors,
  formatMlaAuthors,
  formatChicagoAuthors,
  formatIeeeAuthors,
} from './utils/authors.js'

export {
  formatDate,
  parseDate,
  getYear,
  formatApaDate,
  formatMlaDate,
  formatChicagoDate,
  formatIeeeDate,
} from './utils/dates.js'
