/**
 * <EquationRef> unit tests.
 *
 * EquationRef is pure context lookup + anchor link — no math library
 * involvement, no async, no rendering of LaTeX. The tests verify its
 * three output formats and its fallback when the id is unknown.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import React from 'react'
import {
  Equation,
  EquationProvider,
} from '../../src/math/Equation.jsx'
import { EquationRef } from '../../src/math/EquationRef.jsx'

afterEach(() => cleanup())

const MATHML =
  '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>'

describe('<EquationRef>', () => {
  it('resolves to (N) by default', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="einstein" mathml={MATHML} />
        <EquationRef id="einstein" />
      </EquationProvider>,
    )
    const link = container.querySelector('a[href="#einstein"]')
    expect(link?.textContent).toBe('(1)')
  })

  it('renders plain format as the bare number', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="a" mathml={MATHML} />
        <Equation id="b" mathml={MATHML} />
        <EquationRef id="b" format="plain" />
      </EquationProvider>,
    )
    const link = container.querySelector('a[href="#b"]')
    expect(link?.textContent).toBe('2')
  })

  it('renders equation format with the "Equation" prefix', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="e1" mathml={MATHML} />
        <EquationRef id="e1" format="equation" />
      </EquationProvider>,
    )
    const link = container.querySelector('a[href="#e1"]')
    expect(link?.textContent).toBe('Equation 1')
  })

  it('falls back to ?? when the id is unknown', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="known" mathml={MATHML} />
        <EquationRef id="missing" />
      </EquationProvider>,
    )
    // No <a> element for missing refs; the fallback is a <span>.
    expect(container.querySelector('a[href="#missing"]')).toBeNull()
    expect(container.textContent).toContain('??')
  })
})
