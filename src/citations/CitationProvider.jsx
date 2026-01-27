/**
 * Citation Provider Component
 *
 * Provides context for managing citations throughout a document.
 * Tracks which references have been cited and their order.
 *
 * @module @uniweb/scholar/citations/CitationProvider
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { parseBibtex } from '../bibliography/parsers/bibtex.js'

/**
 * Citation context
 */
export const CitationContext = createContext(null)

/**
 * Hook to access citation context
 *
 * @returns {{ cite: Function, getCitation: Function, references: Array, style: string, cited: Map }}
 */
export function useCitation() {
  const ctx = useContext(CitationContext)
  if (!ctx) {
    throw new Error('useCitation must be used within a CitationProvider')
  }
  return ctx
}

/**
 * CitationProvider - Manages citation state for a document
 *
 * @param {Object} props
 * @param {Array|string} props.references - Array of reference objects or BibTeX string
 * @param {string} [props.style='apa'] - Citation style (apa, mla, chicago, ieee)
 * @param {React.ReactNode} props.children
 *
 * @example
 * <CitationProvider references={refs} style="apa">
 *   <p>According to <Citation id="smith2024" />, this is true.</p>
 *   <Bibliography />
 * </CitationProvider>
 */
export function CitationProvider({ references, style = 'apa', children }) {
  // Track cited references in order
  const [cited, setCited] = useState(new Map())

  // Parse references if BibTeX string
  const refs = useMemo(() => {
    if (!references) return []
    if (typeof references === 'string') {
      return parseBibtex(references)
    }
    if (Array.isArray(references)) {
      return references
    }
    return []
  }, [references])

  // Create a lookup map by id
  const refsById = useMemo(() => {
    const map = new Map()
    refs.forEach((ref) => {
      if (ref.id) map.set(ref.id, ref)
      if (ref.citationKey) map.set(ref.citationKey, ref)
    })
    return map
  }, [refs])

  /**
   * Cite a reference by id
   * Returns the citation number (order in which it was first cited)
   */
  const cite = useCallback(
    (id) => {
      // Check if already cited
      if (cited.has(id)) {
        return cited.get(id)
      }

      // Add to cited list
      const number = cited.size + 1
      setCited((prev) => {
        if (prev.has(id)) return prev
        const next = new Map(prev)
        next.set(id, number)
        return next
      })

      return number
    },
    [cited]
  )

  /**
   * Get citation info without citing
   */
  const getCitation = useCallback(
    (id) => {
      return {
        number: cited.get(id),
        reference: refsById.get(id),
        isCited: cited.has(id),
      }
    },
    [cited, refsById]
  )

  /**
   * Get reference by id
   */
  const getReference = useCallback(
    (id) => refsById.get(id),
    [refsById]
  )

  /**
   * Get all cited references in citation order
   */
  const getCitedReferences = useCallback(() => {
    const sorted = Array.from(cited.entries()).sort((a, b) => a[1] - b[1])
    return sorted.map(([id]) => refsById.get(id)).filter(Boolean)
  }, [cited, refsById])

  const value = useMemo(
    () => ({
      cite,
      getCitation,
      getReference,
      getCitedReferences,
      references: refs,
      refsById,
      style,
      cited,
    }),
    [cite, getCitation, getReference, getCitedReferences, refs, refsById, style, cited]
  )

  return (
    <CitationContext.Provider value={value}>
      {children}
    </CitationContext.Provider>
  )
}

export default CitationProvider
