/**
 * Chicago Style (Author-Date) Reference Formatter
 *
 * Formats references according to Chicago Manual of Style 17th edition
 * author-date format.
 *
 * @module @uniweb/scholar/bibliography/formatters/chicago
 */

import { formatChicagoAuthors, parseAuthorString } from '../utils/authors.js'
import { formatChicagoDate, getYear } from '../utils/dates.js'

/**
 * Format a journal article in Chicago style
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
    parts.push(`${formatChicagoAuthors(authors)}.`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Journal (italicized)
  if (pub.journal) {
    let journalPart = pub.journal
    if (pub.volume) {
      journalPart += ` ${pub.volume}`
      if (pub.issue) {
        journalPart += `, no. ${pub.issue}`
      }
    }
    if (pub.pages) {
      journalPart += `: ${pub.pages}`
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
 * Format a book in Chicago style
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
    parts.push(`${formatChicagoAuthors(authors)}.`)
  } else if (editors.length) {
    parts.push(
      `${formatChicagoAuthors(editors)}, ed${editors.length > 1 ? 's' : ''}.`
    )
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  // Title (italicized)
  if (pub.title) {
    let title = pub.title
    if (pub.edition && pub.edition !== '1') {
      title += `. ${pub.edition} ed`
    }
    parts.push(`${title}.`)
  }

  // Place and publisher
  if (pub.address && pub.publisher) {
    parts.push(`${pub.address}: ${pub.publisher}.`)
  } else if (pub.publisher) {
    parts.push(`${pub.publisher}.`)
  }

  return parts.join(' ')
}

/**
 * Format a book chapter in Chicago style
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
    parts.push(`${formatChicagoAuthors(authors)}.`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  // Chapter title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Book title and editors
  if (pub.bookTitle) {
    let bookPart = `In ${pub.bookTitle}`
    const editors = Array.isArray(pub.editors)
      ? pub.editors
      : parseAuthorString(pub.editors || pub.editor)
    if (editors.length) {
      bookPart += `, edited by ${formatChicagoAuthors(editors)}`
    }
    if (pub.pages) {
      bookPart += `, ${pub.pages}`
    }
    parts.push(`${bookPart}.`)
  }

  // Place and publisher
  if (pub.address && pub.publisher) {
    parts.push(`${pub.address}: ${pub.publisher}.`)
  } else if (pub.publisher) {
    parts.push(`${pub.publisher}.`)
  }

  return parts.join(' ')
}

/**
 * Format conference proceedings in Chicago style
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
    parts.push(`${formatChicagoAuthors(authors)}.`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Conference name
  if (pub.booktitle || pub.conference) {
    let confPart = `Paper presented at ${pub.booktitle || pub.conference}`
    if (pub.address || pub.location) {
      confPart += `, ${pub.address || pub.location}`
    }
    parts.push(`${confPart}.`)
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
 * Format a website/webpage in Chicago style
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
    parts.push(`${formatChicagoAuthors(authors)}.`)
  } else if (pub.organization) {
    parts.push(`${pub.organization}.`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Site name
  if (pub.siteName) {
    parts.push(`${pub.siteName}.`)
  }

  // Access date and URL
  if (pub.accessDate) {
    parts.push(`Accessed ${formatChicagoDate(pub.accessDate)}.`)
  }
  if (pub.url) {
    parts.push(pub.url)
  }

  return parts.join(' ')
}

/**
 * Format a thesis/dissertation in Chicago style
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
    parts.push(`${formatChicagoAuthors(authors)}.`)
  }

  // Year
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Type and institution
  const type =
    pub.type === 'mastersthesis' ? 'Master\'s thesis' : 'PhD diss.'
  if (pub.school || pub.institution) {
    parts.push(`${type}, ${pub.school || pub.institution}.`)
  }

  return parts.join(' ')
}

/**
 * Format a reference in Chicago author-date style
 *
 * @param {Object} pub - Publication data
 * @param {Object} [options] - Formatting options
 * @returns {string}
 */
export function formatChicago(pub, options = {}) {
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

export default formatChicago
