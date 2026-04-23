/**
 * Math Module
 *
 * Numbered equations and cross-references, rendered from pre-compiled
 * MathML produced by Uniweb's content pipeline.
 *
 * Plain inline and display math (`$x$`, `$$x$$`, fenced ```math) is
 * handled entirely by the content pipeline — authors write LaTeX in
 * markdown and the browser renders real MathML natively. No component
 * wrapper needed. The former `<Math>` component (KaTeX-based) was
 * removed in an earlier release.
 *
 * `<Equation>` and `<EquationRef>` remain for the distinct feature of
 * numbered cross-referenceable equations. They consume `content.math`
 * entries (which carry pre-compiled MathML and an optional id); scholar
 * no longer ships a math renderer.
 *
 * @module @uniweb/scholar/math
 */

export {
  Equation,
  EquationProvider,
  EquationContext,
  useEquations,
} from './Equation.jsx'
export { EquationRef } from './EquationRef.jsx'
