/**
 * AuthorList Component
 *
 * Renders a formatted list of authors with optional ORCID links.
 *
 * @module @uniweb/scholar/components/AuthorList
 */

import React from 'react'
import { formatAuthors } from '../bibliography/utils/authors.js'

/**
 * AuthorList - Formatted author names
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
 *
 * @example
 * <AuthorList authors="Smith, John and Doe, Jane" style="mla" />
 */
export function AuthorList({
  authors,
  style = 'apa',
  showOrcid = true,
  separator = ', ',
  className,
  ...props
}) {
  // If authors is a string, just format it
  if (typeof authors === 'string') {
    return (
      <span className={className} {...props}>
        {formatAuthors(authors, { style })}
      </span>
    )
  }

  // If no array or empty, return nothing
  if (!authors?.length) {
    return null
  }

  // Check if any author has ORCID
  const hasOrcid = showOrcid && authors.some((a) => a.orcid)

  // If no ORCID to show, use simple formatted string
  if (!hasOrcid) {
    return (
      <span className={className} {...props}>
        {formatAuthors(authors, { style })}
      </span>
    )
  }

  // Render with ORCID links
  return (
    <span className={className} {...props}>
      {authors.map((author, index) => {
        const isLast = index === authors.length - 1
        const isSecondToLast = index === authors.length - 2

        // Format name based on style and position
        let name
        if (typeof author === 'string') {
          name = author
        } else {
          const suffix = author.suffix ? `, ${author.suffix}` : ''
          if (style === 'apa') {
            // APA: Last, F.
            const initials = author.given
              ? author.given
                  .split(/\s+/)
                  .map((n) => `${n.charAt(0)}.`)
                  .join(' ')
              : ''
            name = initials
              ? `${author.family}${suffix}, ${initials}`
              : author.family + suffix
          } else {
            // Default: First Last
            name = author.given
              ? `${author.given} ${author.family}${suffix}`
              : author.family + suffix
          }
        }

        // Determine separator
        let sep = ''
        if (!isLast) {
          if (authors.length === 2) {
            sep = style === 'apa' ? ' & ' : ' and '
          } else if (isSecondToLast) {
            sep = style === 'apa' ? ', & ' : ', and '
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
