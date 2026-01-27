/**
 * Bibliography Formatters
 *
 * @module @uniweb/scholar/bibliography/formatters
 */

export { formatApa } from './apa.js'
export { formatMla } from './mla.js'
export { formatChicago } from './chicago.js'
export { formatIeee } from './ieee.js'

import { formatApa } from './apa.js'
import { formatMla } from './mla.js'
import { formatChicago } from './chicago.js'
import { formatIeee } from './ieee.js'

/**
 * Available citation style formatters
 */
export const formatters = {
  apa: formatApa,
  mla: formatMla,
  chicago: formatChicago,
  ieee: formatIeee,
}

/**
 * Format a reference in a specific style
 *
 * @param {Object} publication - Publication data
 * @param {Object} [options]
 * @param {string} [options.style='apa'] - Citation style (apa, mla, chicago, ieee)
 * @returns {string} Formatted reference string
 *
 * @example
 * const ref = formatReference({
 *   type: 'article',
 *   authors: [{ family: 'Smith', given: 'John' }],
 *   year: 2024,
 *   title: 'A Study of Something',
 *   journal: 'Journal of Studies',
 *   volume: '10',
 *   pages: '1-10',
 *   doi: '10.1234/example'
 * }, { style: 'apa' })
 */
export function formatReference(publication, options = {}) {
  const { style = 'apa' } = options

  const formatter = formatters[style.toLowerCase()]
  if (!formatter) {
    throw new Error(`Unknown citation style: ${style}. Available: ${Object.keys(formatters).join(', ')}`)
  }

  return formatter(publication, options)
}
