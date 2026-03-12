/**
 * Bibliography Parsers
 *
 * Delegates to @citestyle/bibtex for BibTeX parsing and export.
 * Returns CSL-JSON items directly — no scholar-shaped wrapper.
 *
 * @module @uniweb/scholar/bibliography/parsers
 */

import {
  parseBibtex as csParseBibtex,
  exportBibtex as csExportBibtex,
} from '@citestyle/bibtex'
import { toCslJson } from '../normalize.js'

/**
 * Parse a BibTeX string into an array of CSL-JSON items.
 *
 * @param {string} bibtex - BibTeX source string
 * @returns {Array<Object>} Array of CSL-JSON items
 */
export const parseBibtex = csParseBibtex

/**
 * Export a single publication (Scholar or CSL-JSON) to BibTeX format.
 *
 * Wraps @citestyle/bibtex's exportBibtex, which expects an array of
 * CSL-JSON items. This accepts a single Scholar-shaped pub for convenience.
 *
 * @param {Object} publication - Publication data (Scholar or CSL-JSON)
 * @returns {string} BibTeX string
 */
export function exportBibtex(publication) {
  if (!publication) return ''

  // If it's a string, it's already BibTeX — pass through
  if (typeof publication === 'string') return publication

  const item = toCslJson(publication)
  return csExportBibtex([item])
}
