/**
 * Bibliography Component
 *
 * Renders a formatted list of references that have been cited in the document.
 *
 * @module @uniweb/scholar/citations/Bibliography
 */

import React, { useMemo } from 'react'
import { useCitation } from './CitationProvider.jsx'
import { formatReference } from '../bibliography/formatters/index.js'

/**
 * Bibliography - Renders the list of cited references
 *
 * @param {Object} props
 * @param {string} [props.title='References'] - Section title
 * @param {boolean} [props.showTitle=true] - Whether to show the title
 * @param {boolean} [props.showAll=false] - Show all references, not just cited ones
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.itemClassName] - CSS classes for each item
 *
 * @example
 * <Bibliography title="Works Cited" />
 *
 * @example
 * // Show all references including uncited ones
 * <Bibliography showAll />
 */
export function Bibliography({
  title = 'References',
  showTitle = true,
  showAll = false,
  className,
  itemClassName,
  ...props
}) {
  const { getCitedReferences, references, style, cited } = useCitation()

  // Get references to display
  const refsToShow = useMemo(() => {
    if (showAll) {
      return references
    }
    return getCitedReferences()
  }, [showAll, references, getCitedReferences])

  // Format references
  const formattedRefs = useMemo(() => {
    return refsToShow.map((ref) => {
      const number = cited.get(ref.id) || cited.get(ref.citationKey)
      return {
        id: ref.id || ref.citationKey,
        number,
        formatted: formatReference(ref, { style }),
        reference: ref,
      }
    })
  }, [refsToShow, style, cited])

  if (!formattedRefs.length) {
    return null
  }

  // Use numbered list for IEEE style
  const isNumeric = style === 'ieee'

  return (
    <section className={className} {...props}>
      {showTitle && (
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}
        >
          {title}
        </h2>
      )}

      {isNumeric ? (
        <ol
          style={{
            listStyleType: 'decimal',
            paddingLeft: '2rem',
            lineHeight: '1.8',
          }}
        >
          {formattedRefs.map((ref) => (
            <li
              key={ref.id}
              id={`ref-${ref.id}`}
              className={itemClassName}
              style={{
                marginBottom: '0.75rem',
              }}
            >
              {ref.formatted}
            </li>
          ))}
        </ol>
      ) : (
        <div
          style={{
            lineHeight: '1.8',
          }}
        >
          {formattedRefs.map((ref) => (
            <p
              key={ref.id}
              id={`ref-${ref.id}`}
              className={itemClassName}
              style={{
                marginBottom: '0.75rem',
                paddingLeft: '2rem',
                textIndent: '-2rem',
              }}
            >
              {ref.formatted}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

export default Bibliography
