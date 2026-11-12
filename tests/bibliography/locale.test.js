import { describe, it, expect } from 'vitest'
import { formatReference } from '../../src/bibliography/formatters/index.js'
import fr from '@citestyle/locales/fr-FR'
import de from '@citestyle/locales/de-DE'

// One article, as CSL-JSON, with the terms a style prints: "and"/"et al.", volume, issue,
// pages, a month, quotation marks.
const article = {
  id: 'collaborative-intelligence',
  type: 'article-journal',
  title: 'Bridging human expertise and AI: A framework for collaborative intelligence',
  author: [
    { family: 'Williams', given: 'Robert' },
    { family: 'Chen', given: 'Sarah' },
    { family: 'Garcia', given: 'Lisa' },
  ],
  'container-title': 'Wexley Transactions on Human–AI Systems',
  volume: '12',
  issue: '8',
  page: '78-89',
  issued: { 'date-parts': [[2023, 3, 14]] },
}

describe('formatReference with a locale pack', () => {
  it('prints the style’s own English words without one', () => {
    expect(formatReference(article, { style: 'mla' }).text).toBe(
      'Williams, Robert, et al. “Bridging Human Expertise and AI: A Framework for Collaborative Intelligence.” Wexley Transactions on Human–AI Systems, vol. 12, no. 8, Mar. 2023, pp. 78–89.'
    )
  })

  // The locale's own typography: a no-break space inside « » and in "u. a.", and a
  // non-breaking hyphen in a French page range.
  it('prints French words, quotation marks and dates with fr-FR', () => {
    expect(formatReference(article, { style: 'mla', locale: fr }).text).toBe(
      'Williams, Robert, et al. «\u00a0Bridging Human Expertise and AI: A Framework for Collaborative Intelligence\u00a0». Wexley Transactions on Human–AI Systems, vol. 12, nᵒ 8, mars 2023, p. 78\u201189.'
    )
  })

  it('prints German words with de-DE', () => {
    expect(formatReference(article, { style: 'mla', locale: de }).text).toBe(
      'Williams, Robert, u.\u00a0a. „Bridging Human Expertise and AI: A Framework for Collaborative Intelligence“. Wexley Transactions on Human–AI Systems, Bd. 12, Nr. 8, März 2023, S. 78–89.'
    )
  })

  it('keeps a style without a pack the same as before the option existed', () => {
    expect(formatReference(article, { style: 'apa', locale: undefined }).text).toBe(formatReference(article, { style: 'apa' }).text)
  })
})
