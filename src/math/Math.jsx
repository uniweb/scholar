/**
 * Math Component
 *
 * Renders LaTeX math expressions using KaTeX.
 * Supports both inline and display (block) modes.
 *
 * @module @uniweb/scholar/math/Math
 */

import React, { useEffect, useState } from 'react'
import { loadKatex } from './katex-loader.js'

/**
 * Math - Render LaTeX math expressions
 *
 * @param {Object} props
 * @param {string} props.children - LaTeX expression to render
 * @param {boolean} [props.display=false] - Display mode (block) vs inline
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * // Inline math
 * <Math>E = mc^2</Math>
 *
 * @example
 * // Display (block) math
 * <Math display>
 *   \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
 * </Math>
 */
export function Math({ children, display = false, className, ...props }) {
  const [html, setHtml] = useState(null)
  const [error, setError] = useState(null)

  // Extract LaTeX string from children
  const latex = typeof children === 'string' ? children.trim() : ''

  useEffect(() => {
    if (!latex) return

    let cancelled = false

    async function render() {
      const katex = await loadKatex()
      if (cancelled || !katex) return

      try {
        const rendered = katex.renderToString(latex, {
          displayMode: display,
          throwOnError: false,
          errorColor: '#cc0000',
        })
        if (!cancelled) {
          setHtml(rendered)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message)
          setHtml(null)
        }
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [latex, display])

  // Error state
  if (error) {
    return (
      <span
        className={className}
        style={{ color: '#cc0000', fontFamily: 'monospace' }}
        title={error}
        {...props}
      >
        {latex}
      </span>
    )
  }

  // Loading state - show raw LaTeX in code format
  if (!html) {
    return (
      <code className={className} {...props}>
        {latex}
      </code>
    )
  }

  // Rendered math
  if (display) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    )
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}

export default Math
