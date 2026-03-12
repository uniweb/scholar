/**
 * Data Normalization Layer
 *
 * Bidirectional bridge between Scholar's publication objects (BibTeX-style
 * field names) and CSL-JSON items (the format @citestyle/* expects).
 *
 * @module @uniweb/scholar/bibliography/normalize
 */

// Scholar type → CSL-JSON type
const TYPE_TO_CSL = {
  article: 'article-journal',
  journal: 'article-journal',
  book: 'book',
  inbook: 'chapter',
  incollection: 'chapter',
  chapter: 'chapter',
  inproceedings: 'paper-conference',
  conference: 'paper-conference',
  webpage: 'webpage',
  website: 'webpage',
  online: 'webpage',
  thesis: 'thesis',
  phdthesis: 'thesis',
  mastersthesis: 'thesis',
  report: 'report',
  techreport: 'report',
  misc: 'article', // sensible default
}

// CSL-JSON type → Scholar type (reverse mapping, picks first match)
const TYPE_FROM_CSL = {
  'article-journal': 'article',
  book: 'book',
  chapter: 'incollection',
  'paper-conference': 'inproceedings',
  webpage: 'webpage',
  thesis: 'thesis',
  report: 'report',
  article: 'article',
}

/**
 * Map a Scholar entry type to a CSL-JSON type.
 *
 * @param {string} scholarType
 * @returns {string}
 */
export function mapType(scholarType) {
  if (!scholarType) return 'article-journal'
  return TYPE_TO_CSL[scholarType.toLowerCase()] || 'article-journal'
}

/**
 * Map a CSL-JSON type back to a Scholar entry type.
 *
 * @param {string} cslType
 * @returns {string}
 */
export function unmapType(cslType) {
  if (!cslType) return 'article'
  return TYPE_FROM_CSL[cslType] || cslType
}

/**
 * Convert a Scholar publication object to a CSL-JSON item.
 *
 * Scholar uses BibTeX-style field names (`authors`, `journal`, `year`).
 * Citestyle expects CSL-JSON (`author`, `container-title`, `issued`).
 *
 * @param {Object} pub - Scholar publication object
 * @returns {Object} CSL-JSON item
 */
export function toCslJson(pub) {
  if (!pub) return {}

  // If it already looks like CSL-JSON (has `issued` or `container-title`),
  // pass through with minimal normalization
  if (pub.issued || pub['container-title']) {
    return { id: pub.id || pub.citationKey || 'unknown', ...pub }
  }

  const item = {
    id: pub.id || pub.citationKey || 'unknown',
    type: mapType(pub.type),
  }

  // Authors — Scholar uses `authors` (array), CSL-JSON uses `author`
  if (pub.authors?.length) {
    item.author = pub.authors.map(normalizeName)
  } else if (pub.author) {
    // Already CSL-JSON shape
    item.author = Array.isArray(pub.author)
      ? pub.author.map(normalizeName)
      : undefined
  }

  // Editors
  if (pub.editors?.length) {
    item.editor = pub.editors.map(normalizeName)
  }

  // Title
  if (pub.title) item.title = pub.title

  // Container title — Scholar uses `journal` or `bookTitle`
  const container = pub.journal || pub.bookTitle || pub.containerTitle
  if (container) item['container-title'] = container

  // Date — Scholar uses `year` (number), CSL-JSON uses `issued`
  if (pub.year) {
    item.issued = { 'date-parts': [[Number(pub.year)]] }
  } else if (pub.date) {
    // Try to parse an ISO date string
    const parts = String(pub.date).split('-').map(Number)
    item.issued = { 'date-parts': [parts.filter((n) => !isNaN(n))] }
  }

  // Standard fields
  if (pub.volume) item.volume = String(pub.volume)
  if (pub.issue) item.issue = String(pub.issue)
  if (pub.pages) item.page = pub.pages.replace('–', '-')
  if (pub.page) item.page = pub.page
  if (pub.doi) item.DOI = pub.doi.replace(/^https?:\/\/doi\.org\//, '')
  if (pub.DOI) item.DOI = pub.DOI
  if (pub.url) item.URL = pub.url
  if (pub.URL) item.URL = pub.URL
  if (pub.publisher) item.publisher = pub.publisher
  if (pub.isbn) item.ISBN = pub.isbn
  if (pub.issn) item.ISSN = pub.issn
  if (pub.abstract) item.abstract = pub.abstract
  if (pub.edition) item.edition = pub.edition

  // Thesis-specific
  if (pub.school || pub.institution) {
    item.publisher = pub.school || pub.institution
  }

  return item
}

/**
 * Convert a CSL-JSON item to a Scholar publication object.
 *
 * Used for backward compatibility when components expect Scholar-shaped
 * objects (`pub.authors`, `pub.journal`, `pub.year`).
 *
 * @param {Object} item - CSL-JSON item
 * @returns {Object} Scholar publication object
 */
export function fromCslJson(item) {
  if (!item) return {}

  const pub = {
    id: item.id,
    type: unmapType(item.type),
  }

  // Authors
  if (item.author?.length) {
    pub.authors = item.author.map((a) => ({
      family: a.family || '',
      given: a.given || '',
      ...(a.suffix ? { suffix: a.suffix } : {}),
    }))
  }

  // Editors
  if (item.editor?.length) {
    pub.editors = item.editor.map((a) => ({
      family: a.family || '',
      given: a.given || '',
    }))
  }

  // Title
  if (item.title) pub.title = item.title

  // Container title → journal or bookTitle
  if (item['container-title']) {
    if (pub.type === 'article' || pub.type === 'journal') {
      pub.journal = item['container-title']
    } else {
      pub.bookTitle = item['container-title']
    }
  }

  // Date
  if (item.issued?.['date-parts']?.[0]) {
    pub.year = item.issued['date-parts'][0][0]
  }

  // Standard fields
  if (item.volume) pub.volume = item.volume
  if (item.issue) pub.issue = item.issue
  if (item.page) pub.pages = item.page
  if (item.DOI) pub.doi = item.DOI
  if (item.URL) pub.url = item.URL
  if (item.publisher) pub.publisher = item.publisher
  if (item.ISBN) pub.isbn = item.ISBN
  if (item.ISSN) pub.issn = item.ISSN
  if (item.abstract) pub.abstract = item.abstract
  if (item.edition) pub.edition = item.edition

  return pub
}

/**
 * Normalize a name object — ensures {family, given} shape.
 * Handles strings, objects with various key patterns.
 *
 * @param {Object|string} name
 * @returns {{ family: string, given: string, suffix?: string }}
 */
function normalizeName(name) {
  if (typeof name === 'string') {
    // "Last, First" or "First Last"
    if (name.includes(',')) {
      const [family, given] = name.split(',').map((s) => s.trim())
      return { family, given }
    }
    const parts = name.trim().split(/\s+/)
    return {
      family: parts[parts.length - 1],
      given: parts.slice(0, -1).join(' '),
    }
  }

  return {
    family: name.family || name.lastName || '',
    given: name.given || name.firstName || '',
    ...(name.suffix ? { suffix: name.suffix } : {}),
  }
}
