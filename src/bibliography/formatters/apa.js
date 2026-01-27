/**
 * APA 7th Edition Reference Formatter
 *
 * Formats references according to APA 7th edition guidelines.
 *
 * @module @uniweb/scholar/bibliography/formatters/apa
 */

import { formatApaAuthors, parseAuthorString } from '../utils/authors.js'
import { formatApaDate, getYear } from '../utils/dates.js'

/**
 * Format a journal article in APA style
 *
 * @param {Object} pub - Publication data
 * @returns {string}
 */
function formatArticle(pub) {
  const parts = []

  // Authors
  const authors = Array.isArray(pub.authors)
    ? pub.authors
    : parseAuthorString(pub.authors || pub.author)
  if (authors.length) {
    parts.push(formatApaAuthors(authors))
  }

  // Year
  const year = getYear(pub.year || pub.date)
  parts.push(`(${year || 'n.d.'}).`)

  // Title
  if (pub.title) {
    parts.push(`${pub.title}.`)
  }

  // Journal (italicized in actual rendering)
  if (pub.journal) {
    let journalPart = pub.journal
    if (pub.volume) {
      journalPart += `, ${pub.volume}`
      if (pub.issue) {
        journalPart += `(${pub.issue})`
      }
    }
    if (pub.pages) {
      journalPart += `, ${pub.pages}`
    }
    parts.push(`${journalPart}.`)
  }

  // DOI
  if (pub.doi) {
    const doi = pub.doi.startsWith('http')
      ? pub.doi
      : `https://doi.org/${pub.doi}`
    parts.push(doi)
  }

  return parts.join(' ')
}

/**
 * Format a book in APA style
 *
 * @param {Object} pub - Publication data
 * @returns {string}
 */
function formatBook(pub) {
  const parts = []

  // Authors or editors
  const authors = Array.isArray(pub.authors)
    ? pub.authors
    : parseAuthorString(pub.authors || pub.author)
  const editors = Array.isArray(pub.editors)
    ? pub.editors
    : parseAuthorString(pub.editors || pub.editor)

  if (authors.length) {
    parts.push(formatApaAuthors(authors))
  } else if (editors.length) {
    parts.push(`${formatApaAuthors(editors)} (Ed${editors.length > 1 ? 's' : ''}).`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  parts.push(`(${year || 'n.d.'}).`)

  // Title (italicized in actual rendering)
  if (pub.title) {
    let title = pub.title
    if (pub.edition && pub.edition !== '1') {
      title += ` (${pub.edition} ed.)`
    }
    parts.push(`${title}.`)
  }

  // Publisher
  if (pub.publisher) {
    parts.push(`${pub.publisher}.`)
  }

  // DOI or URL
  if (pub.doi) {
    const doi = pub.doi.startsWith('http')
      ? pub.doi
      : `https://doi.org/${pub.doi}`
    parts.push(doi)
  } else if (pub.url) {
    parts.push(pub.url)
  }

  return parts.join(' ')
}

/**
 * Format a book chapter in APA style
 *
 * @param {Object} pub - Publication data
 * @returns {string}
 */
function formatInBook(pub) {
  const parts = []

  // Chapter authors
  const authors = Array.isArray(pub.authors)
    ? pub.authors
    : parseAuthorString(pub.authors || pub.author)
  if (authors.length) {
    parts.push(formatApaAuthors(authors))
  }

  // Year
  const year = getYear(pub.year || pub.date)
  parts.push(`(${year || 'n.d.'}).`)

  // Chapter title
  if (pub.title) {
    parts.push(`${pub.title}.`)
  }

  // Book editors and title
  const editors = Array.isArray(pub.editors)
    ? pub.editors
    : parseAuthorString(pub.editors || pub.editor)
  if (editors.length || pub.bookTitle) {
    let bookPart = 'In'
    if (editors.length) {
      bookPart += ` ${formatApaAuthors(editors)} (Ed${editors.length > 1 ? 's' : ''}),`
    }
    if (pub.bookTitle) {
      bookPart += ` ${pub.bookTitle}`
    }
    if (pub.pages) {
      bookPart += ` (pp. ${pub.pages})`
    }
    parts.push(`${bookPart}.`)
  }

  // Publisher
  if (pub.publisher) {
    parts.push(`${pub.publisher}.`)
  }

  // DOI
  if (pub.doi) {
    const doi = pub.doi.startsWith('http')
      ? pub.doi
      : `https://doi.org/${pub.doi}`
    parts.push(doi)
  }

  return parts.join(' ')
}

/**
 * Format conference proceedings in APA style
 *
 * @param {Object} pub - Publication data
 * @returns {string}
 */
function formatConference(pub) {
  const parts = []

  // Authors
  const authors = Array.isArray(pub.authors)
    ? pub.authors
    : parseAuthorString(pub.authors || pub.author)
  if (authors.length) {
    parts.push(formatApaAuthors(authors))
  }

  // Year
  const year = getYear(pub.year || pub.date)
  parts.push(`(${year || 'n.d.'}).`)

  // Title
  if (pub.title) {
    parts.push(`${pub.title}.`)
  }

  // Conference/Proceedings
  if (pub.booktitle || pub.conference) {
    let confPart = `In ${pub.booktitle || pub.conference}`
    if (pub.pages) {
      confPart += ` (pp. ${pub.pages})`
    }
    parts.push(`${confPart}.`)
  }

  // Publisher or location
  if (pub.publisher) {
    parts.push(`${pub.publisher}.`)
  } else if (pub.address || pub.location) {
    parts.push(`${pub.address || pub.location}.`)
  }

  // DOI
  if (pub.doi) {
    const doi = pub.doi.startsWith('http')
      ? pub.doi
      : `https://doi.org/${pub.doi}`
    parts.push(doi)
  }

  return parts.join(' ')
}

/**
 * Format a website/webpage in APA style
 *
 * @param {Object} pub - Publication data
 * @returns {string}
 */
function formatWebsite(pub) {
  const parts = []

  // Authors or organization
  const authors = Array.isArray(pub.authors)
    ? pub.authors
    : parseAuthorString(pub.authors || pub.author)
  if (authors.length) {
    parts.push(formatApaAuthors(authors))
  } else if (pub.organization) {
    parts.push(pub.organization)
  }

  // Date
  const date = formatApaDate(pub.date || pub.year)
  parts.push(`(${date}).`)

  // Title
  if (pub.title) {
    parts.push(`${pub.title}.`)
  }

  // Site name
  if (pub.siteName && pub.siteName !== pub.organization) {
    parts.push(`${pub.siteName}.`)
  }

  // URL
  if (pub.url) {
    parts.push(pub.url)
  }

  return parts.join(' ')
}

/**
 * Format a thesis/dissertation in APA style
 *
 * @param {Object} pub - Publication data
 * @returns {string}
 */
function formatThesis(pub) {
  const parts = []

  // Author
  const authors = Array.isArray(pub.authors)
    ? pub.authors
    : parseAuthorString(pub.authors || pub.author)
  if (authors.length) {
    parts.push(formatApaAuthors(authors))
  }

  // Year
  const year = getYear(pub.year || pub.date)
  parts.push(`(${year || 'n.d.'}).`)

  // Title (italicized)
  if (pub.title) {
    parts.push(`${pub.title}`)
  }

  // Thesis type and institution
  const type = pub.type || 'Doctoral dissertation'
  if (pub.school || pub.institution) {
    parts.push(`[${type}, ${pub.school || pub.institution}].`)
  } else {
    parts.push(`[${type}].`)
  }

  // URL or database
  if (pub.url) {
    parts.push(pub.url)
  }

  return parts.join(' ')
}

/**
 * Format a reference in APA 7th edition style
 *
 * @param {Object} pub - Publication data
 * @param {Object} [options] - Formatting options
 * @returns {string}
 */
export function formatApa(pub, options = {}) {
  const type = (pub.type || pub.entryType || 'article').toLowerCase()

  switch (type) {
    case 'article':
    case 'journal':
      return formatArticle(pub)
    case 'book':
      return formatBook(pub)
    case 'inbook':
    case 'incollection':
    case 'chapter':
      return formatInBook(pub)
    case 'inproceedings':
    case 'conference':
    case 'proceedings':
      return formatConference(pub)
    case 'webpage':
    case 'website':
    case 'online':
      return formatWebsite(pub)
    case 'thesis':
    case 'phdthesis':
    case 'mastersthesis':
      return formatThesis(pub)
    default:
      // Generic format
      return formatArticle(pub)
  }
}

export default formatApa
