/**
 * BibTeX Parser
 *
 * Parses BibTeX format into normalized publication objects and exports
 * publication objects back to BibTeX format.
 *
 * @module @uniweb/scholar/bibliography/parsers/bibtex
 */

import { parseAuthorString } from '../utils/authors.js'

/**
 * Parse a BibTeX field value, handling braces and quotes
 *
 * @param {string} value - Raw field value
 * @returns {string} Cleaned value
 */
function parseFieldValue(value) {
  if (!value) return ''

  let cleaned = value.trim()

  // Remove outer braces or quotes
  if (
    (cleaned.startsWith('{') && cleaned.endsWith('}')) ||
    (cleaned.startsWith('"') && cleaned.endsWith('"'))
  ) {
    cleaned = cleaned.slice(1, -1)
  }

  // Remove nested braces (used for preserving case)
  cleaned = cleaned.replace(/\{([^{}]*)\}/g, '$1')

  // Handle common LaTeX commands
  cleaned = cleaned
    .replace(/\\&/g, '&')
    .replace(/\\\$/g, '$')
    .replace(/\\%/g, '%')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/~/g, ' ')
    .replace(/--/g, '–')
    .replace(/``/g, '"')
    .replace(/''/g, '"')

  return cleaned.trim()
}

/**
 * Parse a single BibTeX entry
 *
 * @param {string} entryStr - BibTeX entry string
 * @returns {Object|null} Parsed publication object
 */
function parseEntry(entryStr) {
  // Match @type{key, ...}
  const headerMatch = entryStr.match(/@(\w+)\s*\{\s*([^,\s]*)\s*,/)
  if (!headerMatch) return null

  const entryType = headerMatch[1].toLowerCase()
  const citationKey = headerMatch[2]

  // Extract fields
  const fieldsStr = entryStr.slice(headerMatch[0].length)
  const fields = {}

  // Parse fields using a state machine approach
  let currentField = ''
  let currentValue = ''
  let braceDepth = 0
  let inQuotes = false
  let inField = false

  for (let i = 0; i < fieldsStr.length; i++) {
    const char = fieldsStr[i]
    const prevChar = i > 0 ? fieldsStr[i - 1] : ''

    if (!inField) {
      // Looking for field name
      if (char === '=') {
        currentField = currentValue.trim().toLowerCase()
        currentValue = ''
        inField = true
      } else if (char !== ',' && char !== '}') {
        currentValue += char
      }
    } else {
      // Parsing field value
      if (char === '{' && !inQuotes) {
        braceDepth++
        currentValue += char
      } else if (char === '}' && !inQuotes) {
        if (braceDepth > 0) {
          braceDepth--
          currentValue += char
        } else {
          // End of entry
          if (currentField) {
            fields[currentField] = parseFieldValue(currentValue)
          }
          break
        }
      } else if (char === '"' && prevChar !== '\\') {
        inQuotes = !inQuotes
        currentValue += char
      } else if (char === ',' && braceDepth === 0 && !inQuotes) {
        // End of field
        if (currentField) {
          fields[currentField] = parseFieldValue(currentValue)
        }
        currentField = ''
        currentValue = ''
        inField = false
      } else {
        currentValue += char
      }
    }
  }

  // Save last field if any
  if (currentField && currentValue) {
    fields[currentField] = parseFieldValue(currentValue)
  }

  // Normalize to standard publication object
  const pub = {
    id: citationKey,
    type: entryType,
    ...normalizeFields(fields, entryType),
  }

  return pub
}

/**
 * Normalize BibTeX fields to standard publication object
 *
 * @param {Object} fields - Raw BibTeX fields
 * @param {string} entryType - BibTeX entry type
 * @returns {Object} Normalized fields
 */
function normalizeFields(fields, entryType) {
  const normalized = {}

  // Title
  if (fields.title) {
    normalized.title = fields.title
  }

  // Authors
  if (fields.author) {
    normalized.authors = parseAuthorString(fields.author)
  }

  // Editors
  if (fields.editor) {
    normalized.editors = parseAuthorString(fields.editor)
  }

  // Year
  if (fields.year) {
    normalized.year = parseInt(fields.year, 10) || fields.year
  }

  // Journal/booktitle
  if (fields.journal) {
    normalized.journal = fields.journal
  }
  if (fields.booktitle) {
    normalized.bookTitle = fields.booktitle
  }

  // Volume, issue, pages
  if (fields.volume) normalized.volume = fields.volume
  if (fields.number) normalized.issue = fields.number
  if (fields.pages) normalized.pages = fields.pages.replace('--', '–')

  // Publisher info
  if (fields.publisher) normalized.publisher = fields.publisher
  if (fields.address) normalized.address = fields.address

  // DOI and URL
  if (fields.doi) {
    normalized.doi = fields.doi.replace(/^https?:\/\/doi\.org\//, '')
  }
  if (fields.url) normalized.url = fields.url

  // ISBN/ISSN
  if (fields.isbn) normalized.isbn = fields.isbn
  if (fields.issn) normalized.issn = fields.issn

  // Abstract and keywords
  if (fields.abstract) normalized.abstract = fields.abstract
  if (fields.keywords) {
    normalized.keywords = fields.keywords.split(/[,;]/).map((k) => k.trim())
  }

  // Thesis-specific
  if (fields.school) normalized.school = fields.school
  if (fields.institution) normalized.institution = fields.institution

  // Edition
  if (fields.edition) normalized.edition = fields.edition

  // Note
  if (fields.note) normalized.note = fields.note

  return normalized
}

/**
 * Parse BibTeX string into array of publication objects
 *
 * @param {string} bibtex - BibTeX string
 * @returns {Array<Object>} Array of publication objects
 *
 * @example
 * const refs = parseBibtex(`
 *   @article{smith2024,
 *     author = {Smith, John and Doe, Jane},
 *     title = {A Study},
 *     journal = {Journal of Studies},
 *     year = {2024}
 *   }
 * `)
 */
export function parseBibtex(bibtex) {
  if (!bibtex || typeof bibtex !== 'string') {
    return []
  }

  const results = []

  // Find all entries (@ followed by type and opening brace)
  const entryPattern = /@(\w+)\s*\{/g
  let match
  const entryStarts = []

  while ((match = entryPattern.exec(bibtex)) !== null) {
    entryStarts.push(match.index)
  }

  // Parse each entry
  for (let i = 0; i < entryStarts.length; i++) {
    const start = entryStarts[i]
    const end = i < entryStarts.length - 1 ? entryStarts[i + 1] : bibtex.length

    const entryStr = bibtex.slice(start, end)
    const parsed = parseEntry(entryStr)

    if (parsed) {
      results.push(parsed)
    }
  }

  return results
}

/**
 * Escape a string for BibTeX
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeBibtex(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$')
}

/**
 * Format authors for BibTeX
 *
 * @param {Array} authors - Array of author objects
 * @returns {string} BibTeX author string
 */
function formatBibtexAuthors(authors) {
  if (!authors?.length) return ''

  return authors
    .map((a) => {
      if (typeof a === 'string') return a
      const suffix = a.suffix ? `, ${a.suffix}` : ''
      return a.given ? `${a.family}${suffix}, ${a.given}` : a.family + suffix
    })
    .join(' and ')
}

/**
 * Export a publication object to BibTeX format
 *
 * @param {Object} pub - Publication object
 * @returns {string} BibTeX string
 *
 * @example
 * const bibtex = exportBibtex({
 *   id: 'smith2024',
 *   type: 'article',
 *   authors: [{ family: 'Smith', given: 'John' }],
 *   title: 'A Study',
 *   journal: 'Journal of Studies',
 *   year: 2024
 * })
 */
export function exportBibtex(pub) {
  if (!pub) return ''

  const type = pub.type || pub.entryType || 'misc'
  const key = pub.id || pub.citationKey || generateKey(pub)

  const fields = []

  // Authors
  if (pub.authors?.length) {
    fields.push(`  author = {${formatBibtexAuthors(pub.authors)}}`)
  } else if (pub.author) {
    fields.push(`  author = {${escapeBibtex(pub.author)}}`)
  }

  // Editors
  if (pub.editors?.length) {
    fields.push(`  editor = {${formatBibtexAuthors(pub.editors)}}`)
  }

  // Title
  if (pub.title) {
    fields.push(`  title = {${escapeBibtex(pub.title)}}`)
  }

  // Journal/booktitle
  if (pub.journal) {
    fields.push(`  journal = {${escapeBibtex(pub.journal)}}`)
  }
  if (pub.bookTitle) {
    fields.push(`  booktitle = {${escapeBibtex(pub.bookTitle)}}`)
  }

  // Year
  if (pub.year) {
    fields.push(`  year = {${pub.year}}`)
  }

  // Volume, number, pages
  if (pub.volume) fields.push(`  volume = {${pub.volume}}`)
  if (pub.issue) fields.push(`  number = {${pub.issue}}`)
  if (pub.pages) fields.push(`  pages = {${pub.pages.replace('–', '--')}}`)

  // Publisher
  if (pub.publisher) {
    fields.push(`  publisher = {${escapeBibtex(pub.publisher)}}`)
  }
  if (pub.address) {
    fields.push(`  address = {${escapeBibtex(pub.address)}}`)
  }

  // DOI and URL
  if (pub.doi) fields.push(`  doi = {${pub.doi}}`)
  if (pub.url) fields.push(`  url = {${pub.url}}`)

  // ISBN/ISSN
  if (pub.isbn) fields.push(`  isbn = {${pub.isbn}}`)
  if (pub.issn) fields.push(`  issn = {${pub.issn}}`)

  // Abstract
  if (pub.abstract) {
    fields.push(`  abstract = {${escapeBibtex(pub.abstract)}}`)
  }

  // Keywords
  if (pub.keywords?.length) {
    fields.push(`  keywords = {${pub.keywords.join(', ')}}`)
  }

  // School (for thesis)
  if (pub.school) {
    fields.push(`  school = {${escapeBibtex(pub.school)}}`)
  }

  // Edition
  if (pub.edition) {
    fields.push(`  edition = {${pub.edition}}`)
  }

  return `@${type}{${key},\n${fields.join(',\n')}\n}`
}

/**
 * Generate a citation key from publication data
 *
 * @param {Object} pub - Publication object
 * @returns {string} Generated key
 */
function generateKey(pub) {
  const author =
    pub.authors?.[0]?.family ||
    (typeof pub.author === 'string' ? pub.author.split(/[,\s]/)[0] : 'unknown')
  const year = pub.year || 'nd'
  const title = pub.title?.split(/\s+/)[0]?.toLowerCase() || ''

  return `${author.toLowerCase()}${year}${title}`.replace(/[^a-z0-9]/gi, '')
}
