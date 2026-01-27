/**
 * MLA 9th Edition Reference Formatter
 *
 * Formats references according to MLA 9th edition guidelines.
 *
 * @module @uniweb/scholar/bibliography/formatters/mla
 */

import { formatMlaAuthors, parseAuthorString } from '../utils/authors.js'
import { formatMlaDate, getYear } from '../utils/dates.js'

/**
 * Format a journal article in MLA style
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
    parts.push(`${formatMlaAuthors(authors)}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Container (journal name, italicized)
  if (pub.journal) {
    let container = pub.journal
    if (pub.volume) {
      container += `, vol. ${pub.volume}`
    }
    if (pub.issue) {
      container += `, no. ${pub.issue}`
    }
    // Date
    const year = getYear(pub.year || pub.date)
    if (year) {
      container += `, ${year}`
    }
    // Pages
    if (pub.pages) {
      container += `, pp. ${pub.pages}`
    }
    parts.push(`${container}.`)
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
 * Format a book in MLA style
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
    parts.push(`${formatMlaAuthors(authors)}.`)
  } else if (editors.length) {
    parts.push(
      `${formatMlaAuthors(editors)}, editor${editors.length > 1 ? 's' : ''}.`
    )
  }

  // Title (italicized)
  if (pub.title) {
    parts.push(`${pub.title}.`)
  }

  // Edition
  if (pub.edition && pub.edition !== '1') {
    parts.push(`${pub.edition} ed.,`)
  }

  // Publisher
  if (pub.publisher) {
    parts.push(`${pub.publisher},`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  return parts.join(' ')
}

/**
 * Format a book chapter in MLA style
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
    parts.push(`${formatMlaAuthors(authors)}.`)
  }

  // Chapter title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Book title (italicized)
  if (pub.bookTitle) {
    parts.push(`${pub.bookTitle},`)
  }

  // Editors
  const editors = Array.isArray(pub.editors)
    ? pub.editors
    : parseAuthorString(pub.editors || pub.editor)
  if (editors.length) {
    parts.push(
      `edited by ${formatMlaAuthors(editors)},`
    )
  }

  // Publisher
  if (pub.publisher) {
    parts.push(`${pub.publisher},`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year},`)
  }

  // Pages
  if (pub.pages) {
    parts.push(`pp. ${pub.pages}.`)
  }

  return parts.join(' ')
}

/**
 * Format conference proceedings in MLA style
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
    parts.push(`${formatMlaAuthors(authors)}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Conference/Proceedings (italicized)
  if (pub.booktitle || pub.conference) {
    parts.push(`${pub.booktitle || pub.conference},`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year},`)
  }

  // Pages
  if (pub.pages) {
    parts.push(`pp. ${pub.pages}.`)
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
 * Format a website/webpage in MLA style
 *
 * @param {Object} pub - Publication data
 * @returns {string}
 */
function formatWebsite(pub) {
  const parts = []

  // Authors
  const authors = Array.isArray(pub.authors)
    ? pub.authors
    : parseAuthorString(pub.authors || pub.author)
  if (authors.length) {
    parts.push(`${formatMlaAuthors(authors)}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Site name (italicized)
  if (pub.siteName) {
    parts.push(`${pub.siteName},`)
  }

  // Date
  const date = formatMlaDate(pub.date || pub.year)
  if (date) {
    parts.push(`${date},`)
  }

  // URL
  if (pub.url) {
    parts.push(`${pub.url}.`)
  }

  return parts.join(' ')
}

/**
 * Format a thesis/dissertation in MLA style
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
    parts.push(`${formatMlaAuthors(authors)}.`)
  }

  // Title (italicized)
  if (pub.title) {
    parts.push(`${pub.title}.`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  // Institution and type
  if (pub.school || pub.institution) {
    const type = pub.type === 'mastersthesis' ? 'MA thesis' : 'PhD dissertation'
    parts.push(`${pub.school || pub.institution}, ${type}.`)
  }

  return parts.join(' ')
}

/**
 * Format a reference in MLA 9th edition style
 *
 * @param {Object} pub - Publication data
 * @param {Object} [options] - Formatting options
 * @returns {string}
 */
export function formatMla(pub, options = {}) {
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
      return formatArticle(pub)
  }
}

export default formatMla
