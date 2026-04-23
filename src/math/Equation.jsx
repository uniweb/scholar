/**
 * Equation Component
 *
 * Renders a numbered display equation from pre-compiled MathML.
 *
 * The MathML is produced by Uniweb's content pipeline at build time
 * (see @uniweb/content-reader/math). This component does no math
 * rendering of its own — it wraps the MathML string with numbering and
 * cross-reference machinery, which means it is fully SSR-safe and adds
 * zero runtime math library cost to sites.
 *
 * Authors write labeled display equations in markdown:
 *
 *   ```math:einstein
 *   E = mc^2
 *   ```
 *
 * A foundation's section component then iterates `content.math` and
 * renders each labeled entry through <Equation>:
 *
 *   <EquationProvider>
 *     {content.math.map(m => (
 *       <Equation key={m.id} id={m.id} mathml={m.mathml} />
 *     ))}
 *   </EquationProvider>
 *
 * @module @uniweb/scholar/math/Equation
 */

import React, { useContext, useEffect, useId } from 'react'

/**
 * Context for tracking equation numbers. Exported for use by EquationRef.
 */
export const EquationContext = React.createContext(null)

/**
 * Provider for equation numbering. Wrap section content with this to
 * enable automatic sequential numbering across all <Equation> instances.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.startNumber=1] - Starting equation number
 */
export function EquationProvider({ children, startNumber = 1 }) {
  const [equations, setEquations] = React.useState(new Map())
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
    [equations],
  )

  return (
    <EquationContext.Provider value={{ register, getNumber, equations }}>
      {children}
    </EquationContext.Provider>
  )
}

/**
 * Hook for foundation code that needs direct access to the numbering
 * context (e.g., to render a list of all equations on a page).
 */
export function useEquations() {
  return useContext(EquationContext)
}

/**
 * Equation — numbered display equation rendered from pre-compiled MathML.
 *
 * @param {Object} props
 * @param {string} [props.id] - Identifier for cross-referencing. If omitted,
 *   a stable React id is generated but will not be discoverable by <EquationRef>.
 * @param {string} props.mathml - Pre-compiled MathML HTML string from the
 *   content pipeline (e.g., `content.math[i].mathml`).
 * @param {string} [props.label] - Override the auto-number with a custom label.
 * @param {string} [props.className] - Additional CSS classes on the wrapper.
 */
export function Equation({ id, mathml, label, className, ...props }) {
  const ctx = useContext(EquationContext)
  const generatedId = useId()
  const equationId = id || generatedId

  useEffect(() => {
    if (ctx) ctx.register(equationId)
  }, [ctx, equationId])

  const number = ctx?.getNumber(equationId)
  const displayLabel = label !== undefined ? label : number ? `(${number})` : ''

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
      <div
        style={{ flex: 1, textAlign: 'center' }}
        dangerouslySetInnerHTML={{ __html: mathml || '' }}
      />
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
