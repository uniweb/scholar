/**
 * Citation Component
 *
 * Renders an inline citation that links to the bibliography.
 *
 * @module @uniweb/scholar/citations/Citation
 */

import React, { useMemo } from 'react'
import { useCitation } from './CitationProvider.jsx'
import { getYear } from '../bibliography/utils/dates.js'

/**
 * Format author names for inline citation
 *
 * @param {Array} authors - Array of author objects
 * @param {string} style - Citation style
 * @returns {string}
 */
function formatInlineAuthors(authors, style) {
  if (!authors?.length) return ''

  const getName = (a) => {
    if (typeof a === 'string') return a.split(',')[0].trim()
    return a.family || a.lastName || ''
  }

  if (authors.length === 1) {
    return getName(authors[0])
  }

  if (authors.length === 2) {
    if (style === 'apa') {
      return `${getName(authors[0])} & ${getName(authors[1])}`
    }
    return `${getName(authors[0])} and ${getName(authors[1])}`
  }

  // 3+ authors
  return `${getName(authors[0])} et al.`
}

/**
 * Citation - Inline citation component
 *
 * @param {Object} props
 * @param {string} [props.id] - Single reference ID to cite
 * @param {Array<string>} [props.ids] - Multiple reference IDs to cite
 * @param {string} [props.page] - Page number(s)
 * @param {string} [props.prefix] - Text before citation (e.g., "see")
 * @param {string} [props.suffix] - Text after citation
 * @param {boolean} [props.suppressAuthor] - Show only year (for narrative citations)
 * @param {string} [props.format='parenthetical'] - Format: 'parenthetical', 'narrative', or 'numeric'
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * // Parenthetical citation: (Smith, 2024)
 * <Citation id="smith2024" />
 *
 * @example
 * // Narrative citation: Smith (2024)
 * <Citation id="smith2024" format="narrative" />
 *
 * @example
 * // With page number: (Smith, 2024, p. 42)
 * <Citation id="smith2024" page="42" />
 *
 * @example
 * // Multiple sources: (Smith, 2024; Jones, 2023)
 * <Citation ids={['smith2024', 'jones2023']} />
 *
 * @example
 * // IEEE-style numeric: [1]
 * <Citation id="smith2024" format="numeric" />
 */
export function Citation({
  id,
  ids,
  page,
  prefix,
  suffix,
  suppressAuthor = false,
  format = 'parenthetical',
  className,
  ...props
}) {
  const { cite, getReference, style } = useCitation()

  // Get all IDs to cite
  const allIds = useMemo(() => {
    if (ids?.length) return ids
    if (id) return [id]
    return []
  }, [id, ids])

  // Cite all references and get their info
  const citations = useMemo(() => {
    return allIds.map((refId) => {
      const number = cite(refId)
      const reference = getReference(refId)
      return { id: refId, number, reference }
    })
  }, [allIds, cite, getReference])

  // Format the citation text
  const citationText = useMemo(() => {
    if (!citations.length) return '??'

    // Numeric format (IEEE style)
    if (format === 'numeric' || style === 'ieee') {
      const numbers = citations.map((c) => c.number).join(', ')
      return `[${numbers}]`
    }

    // Author-date formats
    const parts = citations.map((c) => {
      if (!c.reference) return c.id

      const authors = c.reference.authors || []
      const year = getYear(c.reference.year || c.reference.date)
      const authorStr = formatInlineAuthors(authors, style)

      if (suppressAuthor) {
        return year || 'n.d.'
      }

      if (!year) {
        return authorStr || c.id
      }

      return `${authorStr}, ${year}`
    })

    let text = parts.join('; ')

    // Add page number
    if (page) {
      const pagePrefix = page.includes('-') || page.includes('–') ? 'pp.' : 'p.'
      text += `, ${pagePrefix} ${page}`
    }

    // Add prefix/suffix
    if (prefix) text = `${prefix} ${text}`
    if (suffix) text = `${text}, ${suffix}`

    // Wrap in parentheses for parenthetical format
    if (format === 'parenthetical') {
      return `(${text})`
    }

    return text
  }, [citations, format, style, suppressAuthor, page, prefix, suffix])

  // For narrative format, we need to split author and year
  if (format === 'narrative' && citations.length === 1 && citations[0].reference) {
    const c = citations[0]
    const authors = c.reference.authors || []
    const year = getYear(c.reference.year || c.reference.date)
    const authorStr = formatInlineAuthors(authors, style)

    let yearPart = year || 'n.d.'
    if (page) {
      const pagePrefix = page.includes('-') || page.includes('–') ? 'pp.' : 'p.'
      yearPart += `, ${pagePrefix} ${page}`
    }

    return (
      <span className={className} {...props}>
        {prefix && `${prefix} `}
        {authorStr}{' '}
        <a
          href={`#ref-${c.id}`}
          style={{ textDecoration: 'none' }}
        >
          ({yearPart})
        </a>
        {suffix && ` ${suffix}`}
      </span>
    )
  }

  // Single link for all citations
  const firstId = citations[0]?.id
  return (
    <a
      href={firstId ? `#ref-${firstId}` : undefined}
      className={className}
      style={{ textDecoration: 'none' }}
      {...props}
    >
      {citationText}
    </a>
  )
}

export default Citation
