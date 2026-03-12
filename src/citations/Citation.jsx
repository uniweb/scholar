/**
 * Citation Component
 *
 * Renders an inline citation using @citestyle/registry for proper
 * author-date formatting, year-suffix disambiguation, numeric citations,
 * and cite collapsing.
 *
 * @module @uniweb/scholar/citations/Citation
 */

import React, { useMemo } from 'react'
import { useCitation } from './CitationProvider.jsx'

/**
 * Citation - Inline citation component
 *
 * @param {Object} props
 * @param {string} [props.id] - Single reference ID to cite
 * @param {Array<string>} [props.ids] - Multiple reference IDs to cite
 * @param {string} [props.locator] - Page, chapter, or other locator
 * @param {string} [props.label] - Locator label (e.g., 'page', 'chapter')
 * @param {string} [props.prefix] - Text before citation (e.g., "see")
 * @param {string} [props.suffix] - Text after citation
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * // Parenthetical citation: (Smith, 2024)
 * <Citation id="smith2024" />
 *
 * @example
 * // With page locator: (Smith, 2024, p. 42)
 * <Citation id="smith2024" locator="42" label="page" />
 *
 * @example
 * // Multiple sources: (Smith, 2024; Jones, 2023)
 * <Citation ids={['smith2024', 'jones2023']} />
 *
 * @example
 * // With prefix: (see Smith, 2024)
 * <Citation id="smith2024" prefix="see" />
 */
export function Citation({
  id,
  ids,
  locator,
  label = 'page',
  prefix,
  suffix,
  className,
  ...props
}) {
  const { cite } = useCitation()

  // Build cite references array
  const citeRefs = useMemo(() => {
    const allIds = ids?.length ? ids : id ? [id] : []
    return allIds.map((refId, i) => ({
      id: refId,
      // Only the first cite gets the locator/prefix/suffix
      ...(i === 0 && locator ? { locator, label } : {}),
      ...(i === 0 && prefix ? { prefix } : {}),
      ...(i === allIds.length - 1 && suffix ? { suffix } : {}),
    }))
  }, [id, ids, locator, label, prefix, suffix])

  // Format through the registry — handles disambiguation, collapsing, numbering
  const result = useMemo(() => {
    if (!citeRefs.length) return { text: '??', html: '??' }
    return cite(citeRefs)
  }, [citeRefs, cite])

  // Link to bibliography entry
  const firstId = citeRefs[0]?.id

  return (
    <a
      href={firstId ? `#ref-${firstId}` : undefined}
      className={className}
      style={{ textDecoration: 'none' }}
      dangerouslySetInnerHTML={{ __html: result.html }}
      {...props}
    />
  )
}

export default Citation
