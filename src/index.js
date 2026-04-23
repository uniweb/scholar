/**
 * @uniweb/scholar - Academic content utilities for Uniweb
 *
 * Provides math rendering, bibliographic references, and inline citations
 * for academic and scientific content.
 *
 * Bibliography formatting is powered by @citestyle/* compiled styles,
 * giving access to 6 citation styles with structured HTML output,
 * year-suffix disambiguation, and cite collapsing.
 *
 * @module @uniweb/scholar
 */

// Math components — scholar no longer ships a math renderer. Plain
// LaTeX in markdown (`$x$`, `$$x$$`, fenced ```math) is compiled to
// MathML by the content pipeline and rendered natively by the browser.
// <Equation> / <EquationRef> cover numbered cross-referenceable
// equations, consuming pre-compiled MathML via `content.math`.
export { Equation, EquationRef } from './math/index.js'

// Bibliography — formatting, parsing, normalization
export {
  formatReference,
  getAvailableStyles,
  parseBibtex,
  exportBibtex,
  toCslJson,
  fromCslJson,
} from './bibliography/index.js'

// Citation system — registry-powered
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
