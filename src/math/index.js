/**
 * Math Module
 *
 * Numbered equations and cross-references.
 *
 * Note: the former `<Math>` component (KaTeX-based inline/display math
 * rendering) was removed. Authors now write LaTeX directly in markdown
 * using `$x$`, `$$x$$`, or ```math fences — content-reader compiles the
 * expression to MathML Core at build time and the browser renders it
 * natively. No runtime math library, no KaTeX CSS dependency.
 *
 * `<Equation>` / `<EquationRef>` stay because numbered equations and
 * cross-references are a distinct feature from plain math rendering.
 * A follow-up will refactor them to consume pre-compiled MathML from
 * the content pipeline rather than calling KaTeX at render time.
 *
 * @module @uniweb/scholar/math
 */

export { Equation, EquationProvider, EquationContext, useEquations } from './Equation.jsx'
export { EquationRef } from './EquationRef.jsx'
export { loadKatex, isKatexLoaded, renderLatex } from './katex-loader.js'
