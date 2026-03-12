/**
 * Bibliography Formatters
 *
 * Delegates to @citestyle/* compiled styles for reference formatting.
 * Returns structured output: { html, text, parts, links }.
 *
 * @module @uniweb/scholar/bibliography/formatters
 */

import * as apa from '@citestyle/styles/apa'
import * as mla from '@citestyle/styles/mla'
import * as chicagoAD from '@citestyle/styles/chicago-author-date'
import * as ieee from '@citestyle/styles/ieee'
import * as harvard from '@citestyle/styles/harvard'
import * as vancouver from '@citestyle/styles/vancouver'
import { toCslJson } from '../normalize.js'

/**
 * Compiled styles keyed by short name.
 * Each value is a compiled style module with bibliography(), citation(), meta.
 */
export const compiledStyles = {
  apa,
  mla,
  chicago: chicagoAD,
  ieee,
  harvard,
  vancouver,
}

/**
 * Human-readable labels for each style.
 */
const styleLabels = {
  apa: 'APA (7th ed.)',
  mla: 'MLA (9th ed.)',
  chicago: 'Chicago (Author-Date)',
  ieee: 'IEEE',
  harvard: 'Harvard',
  vancouver: 'Vancouver',
}

/**
 * Format a reference in a specific citation style.
 *
 * Accepts Scholar-shaped publication objects OR CSL-JSON items.
 * Returns structured output from @citestyle — { html, text, parts, links }.
 *
 * @param {Object} publication - Publication data (Scholar or CSL-JSON)
 * @param {Object} [options]
 * @param {string} [options.style='apa'] - Citation style name
 * @returns {{ html: string, text: string, parts: Object, links: Object }}
 *
 * @example
 * const entry = formatReference({
 *   type: 'article',
 *   authors: [{ family: 'Smith', given: 'John' }],
 *   year: 2024,
 *   title: 'A Study of Something',
 *   journal: 'Journal of Studies',
 *   volume: '10',
 *   pages: '1-10',
 *   doi: '10.1234/example'
 * }, { style: 'apa' })
 *
 * entry.text  // "Smith, J. (2024). A Study of Something. ..."
 * entry.html  // "<span class=\"csl-entry\">Smith, J. (2024)..."
 */
export function formatReference(publication, options = {}) {
  const { style = 'apa' } = options

  const compiled = compiledStyles[style.toLowerCase()]
  if (!compiled) {
    throw new Error(
      `Unknown citation style: ${style}. Available: ${Object.keys(compiledStyles).join(', ')}`
    )
  }

  const item = toCslJson(publication)
  return compiled.bibliography(item, {})
}

/**
 * Get metadata for all available citation styles.
 * Useful for building UI style pickers.
 *
 * @returns {Array<{ id: string, label: string, class: string }>}
 */
export function getAvailableStyles() {
  return Object.entries(compiledStyles).map(([id, style]) => ({
    id,
    label: styleLabels[id] || style.meta?.title || id,
    class: style.meta?.class || 'in-text',
  }))
}
