/**
 * Equation Component
 *
 * Renders a numbered equation with an optional label for cross-referencing.
 * Equations are numbered sequentially within a CitationProvider context.
 *
 * @module @uniweb/scholar/math/Equation
 */

import React, { useEffect, useState, useContext, useId } from 'react'
import { loadKatex } from './katex-loader.js'

/**
 * Context for tracking equation numbers
 * Exported for use by EquationRef
 */
export const EquationContext = React.createContext(null)

/**
 * Provider for equation numbering
 * Wrap your content with this to enable automatic equation numbering.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.startNumber=1] - Starting equation number
 */
export function EquationProvider({ children, startNumber = 1 }) {
  const [equations, setEquations] = useState(new Map())
  const counterRef = React.useRef(startNumber)

  const register = React.useCallback((id) => {
    setEquations((prev) => {
      if (prev.has(id)) return prev
      const next = new Map(prev)
      next.set(id, counterRef.current++)
      return next
    })
  }, [])

  const getNumber = React.useCallback(
    (id) => equations.get(id),
    [equations]
  )

  return (
    <EquationContext.Provider value={{ register, getNumber, equations }}>
      {children}
    </EquationContext.Provider>
  )
}

/**
 * Hook to access equation context
 */
export function useEquations() {
  return useContext(EquationContext)
}

/**
 * Equation - Numbered display equation with optional label
 *
 * @param {Object} props
 * @param {string} props.children - LaTeX expression
 * @param {string} [props.id] - Unique identifier for cross-referencing
 * @param {string} [props.label] - Custom label (defaults to equation number)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <EquationProvider>
 *   <Equation id="einstein">E = mc^2</Equation>
 *   <p>As shown in <EquationRef id="einstein" />, energy equals...</p>
 * </EquationProvider>
 */
export function Equation({ children, id, label, className, ...props }) {
  const [html, setHtml] = useState(null)
  const generatedId = useId()
  const equationId = id || generatedId
  const ctx = useContext(EquationContext)

  // Extract LaTeX string from children
  const latex = typeof children === 'string' ? children.trim() : ''

  // Register equation for numbering
  useEffect(() => {
    if (ctx) {
      ctx.register(equationId)
    }
  }, [ctx, equationId])

  // Get equation number
  const number = ctx?.getNumber(equationId)

  // Render LaTeX
  useEffect(() => {
    if (!latex) return

    let cancelled = false

    async function render() {
      const katex = await loadKatex()
      if (cancelled || !katex) return

      try {
        const rendered = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
        })
        if (!cancelled) {
          setHtml(rendered)
        }
      } catch (e) {
        console.warn('[Equation] Render error:', e.message)
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [latex])

  const displayLabel = label || (number ? `(${number})` : '')

  return (
    <div
      id={equationId}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0',
        position: 'relative',
      }}
      {...props}
    >
      {/* Equation content */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        {html ? (
          <span dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code>{latex}</code>
        )}
      </div>

      {/* Equation number */}
      {displayLabel && (
        <span
          style={{
            position: 'absolute',
            right: 0,
            fontStyle: 'normal',
          }}
        >
          {displayLabel}
        </span>
      )}
    </div>
  )
}

export default Equation
