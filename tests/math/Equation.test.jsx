/**
 * <Equation> unit tests.
 *
 * The component no longer renders LaTeX itself — it accepts pre-compiled
 * MathML from the content pipeline and wraps it with numbering and
 * cross-reference machinery. These tests cover the wrapper behaviour,
 * not MathML correctness (that's content-reader's concern).
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import React from 'react'
import { Equation, EquationProvider } from '../../src/math/Equation.jsx'

afterEach(() => cleanup())

const MATHML =
  '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>'

describe('<Equation>', () => {
  it('renders the MathML string into the DOM', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="e1" mathml={MATHML} />
      </EquationProvider>,
    )
    expect(container.querySelector('math')).toBeTruthy()
    expect(container.querySelector('math mi')?.textContent).toBe('x')
  })

  it('exposes the id as an anchor on the wrapper', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="einstein" mathml={MATHML} />
      </EquationProvider>,
    )
    expect(container.querySelector('#einstein')).toBeTruthy()
  })

  it('assigns sequential numbers within a provider', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="one" mathml={MATHML} />
        <Equation id="two" mathml={MATHML} />
        <Equation id="three" mathml={MATHML} />
      </EquationProvider>,
    )
    const labels = Array.from(container.querySelectorAll('div > span')).map(
      (s) => s.textContent,
    )
    expect(labels).toEqual(['(1)', '(2)', '(3)'])
  })

  it('uses startNumber to offset numbering', () => {
    const { container } = render(
      <EquationProvider startNumber={5}>
        <Equation id="first" mathml={MATHML} />
        <Equation id="second" mathml={MATHML} />
      </EquationProvider>,
    )
    const labels = Array.from(container.querySelectorAll('div > span')).map(
      (s) => s.textContent,
    )
    expect(labels).toEqual(['(5)', '(6)'])
  })

  it('honours a custom label prop over auto-numbering', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="e1" mathml={MATHML} label="★" />
      </EquationProvider>,
    )
    const span = container.querySelector('div > span')
    expect(span?.textContent).toBe('★')
  })

  it('suppresses the number when label is an empty string', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="e1" mathml={MATHML} label="" />
      </EquationProvider>,
    )
    // The label span is only rendered when there's something to show.
    expect(container.querySelector('div > span')).toBeNull()
  })

  it('renders without an EquationProvider (no numbering, still shows MathML)', () => {
    const { container } = render(<Equation id="e1" mathml={MATHML} />)
    expect(container.querySelector('math')).toBeTruthy()
    expect(container.querySelector('div > span')).toBeNull()
  })

  it('does not crash on empty mathml', () => {
    const { container } = render(
      <EquationProvider>
        <Equation id="e1" mathml="" />
      </EquationProvider>,
    )
    expect(container.querySelector('#e1')).toBeTruthy()
  })
})
