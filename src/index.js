/**
 * @uniweb/scholar - Academic content utilities for Uniweb
 *
 * Provides math rendering, bibliographic references, and inline citations
 * for academic and scientific content.
 *
 * @module @uniweb/scholar
 */

// Math components
export { Math, Equation, EquationRef, loadKatex } from './math/index.js'

// Bibliography utilities
export {
  formatReference,
  formatAuthors,
  parseBibtex,
  exportBibtex,
} from './bibliography/index.js'

// Citation system
export {
  CitationProvider,
  Citation,
  Bibliography,
  useCitation,
} from './citations/index.js'

// UI components
export {
  CiteButton,
  BibtexBlock,
  AuthorList,
  DoiLink,
} from './components/index.js'
