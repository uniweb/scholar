/**
 * Bibliography Module
 *
 * Reference formatting powered by @citestyle/* compiled styles,
 * BibTeX parsing and export, and data normalization utilities.
 *
 * @module @uniweb/scholar/bibliography
 */

// Formatters — citestyle-powered
export {
  formatReference,
  getAvailableStyles,
  compiledStyles,
} from './formatters/index.js'

// Parsers — delegated to @citestyle/bibtex
export { parseBibtex, exportBibtex } from './parsers/index.js'

// Normalization — Scholar ↔ CSL-JSON bridge
export { toCslJson, fromCslJson, mapType, unmapType } from './normalize.js'
