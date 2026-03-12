/**
 * Bibliography Component
 *
 * Renders a formatted list of references using @citestyle/registry.
 * The registry handles sorting, year-suffix disambiguation, and
 * subsequent-author-substitute (em-dash for repeated authors).
 *
 * @module @uniweb/scholar/citations/Bibliography
 */

import React, { useMemo } from 'react'
import { useCitation } from './CitationProvider.jsx'

/**
 * Bibliography - Renders the list of references
 *
 * @param {Object} props
 * @param {string} [props.title='References'] - Section title
 * @param {boolean} [props.showTitle=true] - Whether to show the title
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.itemClassName] - CSS classes for each item
 *
 * @example
 * <Bibliography title="Works Cited" />
 */
export function Bibliography({
  title = 'References',
  showTitle = true,
  className,
  itemClassName,
  ...props
}) {
  const { getBibliography, styleMeta } = useCitation()

  // Get the fully formatted bibliography from the registry.
  // The registry applies: sorting, subsequent-author-substitute,
  // year-suffix disambiguation, and citation numbering.
  const entries = useMemo(() => getBibliography(), [getBibliography])

  if (!entries.length) {
    return null
  }

  // Use numbered list for numeric styles (IEEE, Vancouver, etc.)
  const isNumeric = styleMeta?.class === 'note' ||
    styleMeta?.collapse === 'citation-number'

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
          {entries.map((entry, i) => (
            <li
              key={entry.parts?.id || i}
              id={`ref-${entry.parts?.id || i}`}
              className={itemClassName}
              style={{ marginBottom: '0.75rem' }}
              dangerouslySetInnerHTML={{ __html: entry.html }}
            />
          ))}
        </ol>
      ) : (
        <div style={{ lineHeight: '1.8' }}>
          {entries.map((entry, i) => (
            <div
              key={entry.parts?.id || i}
              id={`ref-${entry.parts?.id || i}`}
              className={itemClassName}
              style={{
                marginBottom: '0.75rem',
                paddingLeft: '2rem',
                textIndent: '-2rem',
              }}
              dangerouslySetInnerHTML={{ __html: entry.html }}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Bibliography
