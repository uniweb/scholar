/**
 * AuthorList Component
 *
 * Renders a formatted list of authors with optional ORCID links.
 * Works with both Scholar-shaped author objects and CSL-JSON name objects.
 *
 * @module @uniweb/scholar/components/AuthorList
 */

import React from 'react'

/**
 * Format a single author name for display.
 *
 * @param {{ family: string, given?: string, suffix?: string }} author
 * @param {boolean} invertFirst - Show as "Last, First" (true) or "First Last" (false)
 * @returns {string}
 */
function formatName(author, invertFirst = false) {
  if (typeof author === 'string') return author

  const family = author.family || ''
  const given = author.given || ''
  const suffix = author.suffix ? `, ${author.suffix}` : ''

  if (!given) return family + suffix

  return invertFirst
    ? `${family}${suffix}, ${given}`
    : `${given} ${family}${suffix}`
}

/**
 * Format an array of authors into a display string.
 *
 * @param {Array} authors - Author objects
 * @param {Object} options
 * @param {string} [options.style='apa']
 * @returns {string}
 */
function formatAuthorsText(authors, { style = 'apa' } = {}) {
  if (!authors?.length) return ''

  const useAmpersand = style === 'apa'
  const invertFirst = style === 'apa' || style === 'chicago' || style === 'mla'

  if (authors.length === 1) {
    return formatName(authors[0], invertFirst)
  }

  if (authors.length === 2) {
    const sep = useAmpersand ? ' & ' : ' and '
    return formatName(authors[0], invertFirst) + sep + formatName(authors[1])
  }

  // 3+ authors
  const allButLast = authors.slice(0, -1).map((a, i) => formatName(a, i === 0 && invertFirst))
  const last = formatName(authors[authors.length - 1])
  const sep = useAmpersand ? ', & ' : ', and '
  return allButLast.join(', ') + sep + last
}

/**
 * AuthorList - Formatted author names with optional ORCID links
 *
 * @param {Object} props
 * @param {Array|string} props.authors - Authors array or string
 * @param {string} [props.style='apa'] - Formatting style
 * @param {boolean} [props.showOrcid=true] - Show ORCID links if available
 * @param {string} [props.separator=', '] - Separator between authors
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <AuthorList authors={[{ family: 'Smith', given: 'John', orcid: '0000-0001-2345-6789' }]} />
 */
export function AuthorList({
  authors,
  style = 'apa',
  showOrcid = true,
  separator = ', ',
  className,
  ...props
}) {
  // String authors — just display
  if (typeof authors === 'string') {
    return (
      <span className={className} {...props}>
        {authors}
      </span>
    )
  }

  if (!authors?.length) return null

  // If no ORCID to show, use simple formatted string
  const hasOrcid = showOrcid && authors.some((a) => a.orcid)

  if (!hasOrcid) {
    return (
      <span className={className} {...props}>
        {formatAuthorsText(authors, { style })}
      </span>
    )
  }

  // Render with ORCID links
  const useAmpersand = style === 'apa'

  return (
    <span className={className} {...props}>
      {authors.map((author, index) => {
        const isLast = index === authors.length - 1
        const isSecondToLast = index === authors.length - 2
        const isFirst = index === 0
        const invertFirst = isFirst && (style === 'apa' || style === 'chicago' || style === 'mla')

        const name = formatName(author, invertFirst)

        // Determine separator
        let sep = ''
        if (!isLast) {
          if (authors.length === 2) {
            sep = useAmpersand ? ' & ' : ' and '
          } else if (isSecondToLast) {
            sep = useAmpersand ? ', & ' : ', and '
          } else {
            sep = separator
          }
        }

        return (
          <React.Fragment key={index}>
            <span style={{ whiteSpace: 'nowrap' }}>
              {name}
              {author.orcid && (
                <a
                  href={`https://orcid.org/${author.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`ORCID: ${author.orcid}`}
                  style={{
                    marginLeft: '0.25rem',
                    display: 'inline-flex',
                    verticalAlign: 'middle',
                  }}
                >
                  <svg
                    style={{ width: '1rem', height: '1rem' }}
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0z"
                      fill="#A6CE39"
                    />
                    <path
                      d="M86.3 186.2H70.9V79.1h15.4v107.1zm22.7 0h-15V79.1h41.6c32.1 0 46.3 14.2 46.3 38.4 0 24.9-15.2 40.3-46.9 40.3h-26v28.4zm0-43.7h24.5c22.1 0 32.6-8.6 32.6-25.1 0-17.7-11.1-25-31.6-25h-25.5v50.1zm-43.4-79.4c5.9 0 10.6 4.8 10.6 10.6 0 5.9-4.8 10.6-10.6 10.6S55 79.6 55 73.7c0-5.8 4.8-10.6 10.6-10.6z"
                      fill="#fff"
                    />
                  </svg>
                </a>
              )}
            </span>
            {sep}
          </React.Fragment>
        )
      })}
    </span>
  )
}

export default AuthorList
