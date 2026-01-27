/**
 * EquationRef Component
 *
 * Creates a reference link to a numbered equation.
 *
 * @module @uniweb/scholar/math/EquationRef
 */

import React, { useContext } from 'react'
import { EquationContext } from './Equation.jsx'

/**
 * EquationRef - Reference to a numbered equation
 *
 * @param {Object} props
 * @param {string} props.id - ID of the equation to reference
 * @param {string} [props.format='parentheses'] - Format: 'parentheses', 'plain', or 'equation'
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <EquationRef id="einstein" />                    // "(1)"
 * <EquationRef id="einstein" format="plain" />    // "1"
 * <EquationRef id="einstein" format="equation" /> // "Equation 1"
 */
export function EquationRef({ id, format = 'parentheses', className, ...props }) {
  const ctx = useContext(EquationContext)
  const number = ctx?.getNumber(id)

  if (!number) {
    // Equation not found or not yet registered
    return (
      <span className={className} style={{ color: '#cc0000' }} {...props}>
        ??
      </span>
    )
  }

  let display
  switch (format) {
    case 'plain':
      display = String(number)
      break
    case 'equation':
      display = `Equation ${number}`
      break
    case 'parentheses':
    default:
      display = `(${number})`
  }

  return (
    <a
      href={`#${id}`}
      className={className}
      style={{ textDecoration: 'none' }}
      {...props}
    >
      {display}
    </a>
  )
}

export default EquationRef
