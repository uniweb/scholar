/**
 * IEEE Reference Formatter
 *
 * Formats references according to IEEE citation style.
 *
 * @module @uniweb/scholar/bibliography/formatters/ieee
 */

import { formatIeeeAuthors, parseAuthorString } from '../utils/authors.js'
import { formatIeeeDate, getYear } from '../utils/dates.js'

/**
 * Format a journal article in IEEE style
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
    parts.push(`${formatIeeeAuthors(authors)},`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title},"`)
  }

  // Journal (italicized)
  if (pub.journal) {
    let journalPart = pub.journal
    if (pub.volume) {
      journalPart += `, vol. ${pub.volume}`
    }
    if (pub.issue) {
      journalPart += `, no. ${pub.issue}`
    }
    if (pub.pages) {
      journalPart += `, pp. ${pub.pages}`
    }
    // Date
    const date = formatIeeeDate(pub.date || pub.year)
    if (date) {
      journalPart += `, ${date}`
    }
    parts.push(`${journalPart}.`)
  }

  // DOI
  if (pub.doi) {
    parts.push(`doi: ${pub.doi.replace(/^https?:\/\/doi\.org\//, '')}.`)
  }

  return parts.join(' ')
}

/**
 * Format a book in IEEE style
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
    parts.push(`${formatIeeeAuthors(authors)},`)
  } else if (editors.length) {
    parts.push(`${formatIeeeAuthors(editors)}, Ed${editors.length > 1 ? 's' : ''}.,`)
  }

  // Title (italicized)
  if (pub.title) {
    let title = pub.title
    if (pub.edition && pub.edition !== '1') {
      title += `, ${pub.edition} ed`
    }
    parts.push(`${title}.`)
  }

  // Place and publisher
  if (pub.address && pub.publisher) {
    parts.push(`${pub.address}: ${pub.publisher},`)
  } else if (pub.publisher) {
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
 * Format a book chapter in IEEE style
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
    parts.push(`${formatIeeeAuthors(authors)},`)
  }

  // Chapter title in quotes
  if (pub.title) {
    parts.push(`"${pub.title},"`)
  }

  // Book title
  if (pub.bookTitle) {
    let bookPart = `in ${pub.bookTitle}`
    const editors = Array.isArray(pub.editors)
      ? pub.editors
      : parseAuthorString(pub.editors || pub.editor)
    if (editors.length) {
      bookPart += `, ${formatIeeeAuthors(editors)}, Ed${editors.length > 1 ? 's' : ''}.`
    }
    parts.push(bookPart)
  }

  // Place and publisher
  if (pub.address && pub.publisher) {
    parts.push(`${pub.address}: ${pub.publisher},`)
  } else if (pub.publisher) {
    parts.push(`${pub.publisher},`)
  }

  // Year and pages
  const year = getYear(pub.year || pub.date)
  if (year) {
    if (pub.pages) {
      parts.push(`${year}, pp. ${pub.pages}.`)
    } else {
      parts.push(`${year}.`)
    }
  }

  return parts.join(' ')
}

/**
 * Format conference proceedings in IEEE style
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
    parts.push(`${formatIeeeAuthors(authors)},`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title},"`)
  }

  // Conference
  if (pub.booktitle || pub.conference) {
    let confPart = `in ${pub.booktitle || pub.conference}`
    if (pub.address || pub.location) {
      confPart += `, ${pub.address || pub.location}`
    }
    // Year
    const year = getYear(pub.year || pub.date)
    if (year) {
      confPart += `, ${year}`
    }
    if (pub.pages) {
      confPart += `, pp. ${pub.pages}`
    }
    parts.push(`${confPart}.`)
  }

  // DOI
  if (pub.doi) {
    parts.push(`doi: ${pub.doi.replace(/^https?:\/\/doi\.org\//, '')}.`)
  }

  return parts.join(' ')
}

/**
 * Format a website/webpage in IEEE style
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
    parts.push(`${formatIeeeAuthors(authors)}.`)
  } else if (pub.organization) {
    parts.push(`${pub.organization}.`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title}."`)
  }

  // Site name (italicized)
  if (pub.siteName) {
    parts.push(`${pub.siteName}.`)
  }

  // URL and access date
  if (pub.url) {
    let urlPart = pub.url
    if (pub.accessDate) {
      urlPart += ` (accessed ${formatIeeeDate(pub.accessDate)})`
    }
    parts.push(`${urlPart}.`)
  }

  return parts.join(' ')
}

/**
 * Format a thesis/dissertation in IEEE style
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
    parts.push(`${formatIeeeAuthors(authors)},`)
  }

  // Title in quotes
  if (pub.title) {
    parts.push(`"${pub.title},"`)
  }

  // Type
  const type = pub.type === 'mastersthesis' ? 'M.S. thesis' : 'Ph.D. dissertation'
  parts.push(type + ',')

  // Institution
  if (pub.school || pub.institution) {
    parts.push(`${pub.school || pub.institution},`)
  }

  // Location and year
  if (pub.address) {
    parts.push(`${pub.address},`)
  }
  const year = getYear(pub.year || pub.date)
  if (year) {
    parts.push(`${year}.`)
  }

  return parts.join(' ')
}

/**
 * Format a reference in IEEE style
 *
 * @param {Object} pub - Publication data
 * @param {Object} [options] - Formatting options
 * @returns {string}
 */
export function formatIeee(pub, options = {}) {
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

export default formatIeee
