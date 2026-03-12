/**
 * Citation Provider Component
 *
 * Provides citation context powered by @citestyle/registry.
 * Handles year-suffix disambiguation, bibliography sorting, cite collapsing,
 * and numeric citation numbering — all automatically.
 *
 * @module @uniweb/scholar/citations/CitationProvider
 */

import React, { createContext, useContext, useMemo, useCallback } from 'react'
import { createRegistry } from '@citestyle/registry'
import { parseBibtex } from '../bibliography/parsers/index.js'
import { compiledStyles } from '../bibliography/formatters/index.js'
import { toCslJson } from '../bibliography/normalize.js'

/**
 * Citation context
 */
export const CitationContext = createContext(null)

/**
 * Hook to access citation context
 *
 * @returns {{
 *   registry: Object,
 *   cite: Function,
 *   getBibliography: Function,
 *   getReference: Function,
 *   references: Array,
 *   style: string,
 *   styleMeta: Object
 * }}
 */
export function useCitation() {
  const ctx = useContext(CitationContext)
  if (!ctx) {
    throw new Error('useCitation must be used within a CitationProvider')
  }
  return ctx
}

/**
 * Normalize references to CSL-JSON items.
 * Accepts: BibTeX string, array of Scholar pubs, array of CSL-JSON items.
 */
function normalizeReferences(references) {
  if (!references) return []

  // BibTeX string → parse to CSL-JSON
  if (typeof references === 'string') {
    return parseBibtex(references)
  }

  if (!Array.isArray(references)) return []

  // Detect if items are already CSL-JSON (have `issued` or `container-title`)
  // or Scholar-shaped (have `authors`, `journal`, `year` as number)
  return references.map((ref) => {
    if (ref.issued || ref['container-title'] || ref['date-parts']) {
      // Already CSL-JSON — ensure it has an id
      return { id: ref.id || ref.citationKey || 'unknown', ...ref }
    }
    // Scholar-shaped → convert
    return toCslJson(ref)
  })
}

/**
 * CitationProvider - Manages citation state for a document
 *
 * Uses @citestyle/registry for proper disambiguation, sorting, and numbering.
 *
 * @param {Object} props
 * @param {Array|string} props.references - Array of publications (Scholar or CSL-JSON) or BibTeX string
 * @param {string} [props.style='apa'] - Citation style name
 * @param {React.ReactNode} props.children
 *
 * @example
 * <CitationProvider references={pubs} style="apa">
 *   <p>According to <Citation id="smith2024" />, this is true.</p>
 *   <Bibliography />
 * </CitationProvider>
 */
export function CitationProvider({ references, style = 'apa', children }) {
  // Resolve compiled style
  const compiled = useMemo(
    () => compiledStyles[style.toLowerCase()] || compiledStyles.apa,
    [style]
  )

  // Normalize all references to CSL-JSON
  const cslItems = useMemo(
    () => normalizeReferences(references),
    [references]
  )

  // Create registry — handles disambiguation, sorting, numbering
  const registry = useMemo(() => {
    const reg = createRegistry(compiled)
    if (cslItems.length) {
      reg.addItems(cslItems)
    }
    return reg
  }, [compiled, cslItems])

  // Convenience: format an inline citation cluster
  const cite = useCallback(
    (cites, ctx) => registry.cite(cites, ctx),
    [registry]
  )

  // Convenience: get the full formatted bibliography
  const getBibliography = useCallback(
    (ctx) => registry.getBibliography(ctx),
    [registry]
  )

  // Look up a CSL-JSON item by id
  const getReference = useCallback(
    (id) => registry.getItem(id),
    [registry]
  )

  const value = useMemo(
    () => ({
      registry,
      cite,
      getBibliography,
      getReference,
      references: cslItems,
      style,
      styleMeta: compiled.meta,
    }),
    [registry, cite, getBibliography, getReference, cslItems, style, compiled]
  )

  return (
    <CitationContext.Provider value={value}>
      {children}
    </CitationContext.Provider>
  )
}

export default CitationProvider
