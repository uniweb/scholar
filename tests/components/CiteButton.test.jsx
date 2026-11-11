/**
 * <CiteButton> unit tests.
 *
 * A foundation bundles CiteButton into sites in any language, and it paints inside sections of
 * any colour. So every word on its menu can come from the foundation, and every colour from the
 * theme: a fixed one would look the same in a dark section as in a light one.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, cleanup, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { CiteButton } from '../../src/components/CiteButton.jsx'

const publication = {
  type: 'article',
  title: 'A Study of Something',
  authors: [{ family: 'Smith', given: 'John' }],
  journal: 'Journal of Studies',
  year: 2024,
}

const STYLES = ['apa', 'mla', 'chicago', 'bibtex']

/** The menu's entries, in order, once the button opens it. */
function open(ui) {
  const view = render(ui)
  fireEvent.click(view.container.querySelector('button'))
  const menu = () => view.container.firstChild.querySelector(':scope > div')
  return { ...view, entries: () => [...menu().querySelectorAll('button')].map((b) => b.textContent) }
}

/** Any colour a style attribute paints that is not a theme token's fallback. */
function fixedColours(container) {
  return [...container.querySelectorAll('[style]')]
    .map((el) => el.getAttribute('style').replace(/var\(--[\w-]+(?:,[^()]*)?\)/g, ''))
    .flatMap((style) => style.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(/gi) || [])
}

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined), write: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  })
})

afterEach(() => cleanup())

describe('<CiteButton>', () => {
  it('names each entry from styleLabels, and keeps scholar’s name for a style it leaves out', () => {
    const { entries } = open(
      <CiteButton publication={publication} styles={STYLES} styleLabels={{ apa: 'APA', chicago: 'Chicago (auteur-date)' }} />,
    )
    expect(entries()).toEqual(['APA', 'MLA (9th ed.)', 'Chicago (auteur-date)', 'BibTeX'])
  })

  it('says copiedLabel once a citation is copied', async () => {
    const { container } = open(<CiteButton publication={publication} styles={STYLES} copiedLabel="Copié ✓" />)
    fireEvent.click(within(container).getByText('APA (7th ed.)'))
    expect(await within(container).findByText('Copié ✓')).toBeTruthy()
    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
  })

  it('says ✓ and the entry’s name once copied, with no copiedLabel', async () => {
    const { container } = open(<CiteButton publication={publication} styles={STYLES} styleLabels={{ bibtex: 'BibTeX' }} />)
    fireEvent.click(within(container).getByText('BibTeX'))
    expect(await within(container).findByText('✓ BibTeX')).toBeTruthy()
  })

  it('paints only the theme’s colours, open and once copied', async () => {
    const { container } = open(<CiteButton publication={publication} styles={STYLES} copiedLabel="Copied" />)
    expect(fixedColours(container)).toEqual([])
    fireEvent.click(within(container).getByText('MLA (9th ed.)'))
    await within(container).findByText('Copied')
    expect(fixedColours(container)).toEqual([])
  })
})
