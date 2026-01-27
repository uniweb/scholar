/**
 * Math Module
 *
 * Components for rendering LaTeX math expressions using KaTeX.
 *
 * @module @uniweb/scholar/math
 */

export { Math } from './Math.jsx'
export { Equation, EquationProvider, EquationContext, useEquations } from './Equation.jsx'
export { EquationRef } from './EquationRef.jsx'
export { loadKatex, isKatexLoaded, renderLatex } from './katex-loader.js'
