/**
 * DoiLink Component
 *
 * Renders a DOI as a clickable link.
 *
 * @module @uniweb/scholar/components/DoiLink
 */

import React from 'react'

/**
 * DoiLink - Display a DOI with automatic link
 *
 * @param {Object} props
 * @param {string} props.doi - DOI value (with or without URL prefix)
 * @param {string} [props.format='full'] - Display format: 'full', 'short', or 'link'
 * @param {boolean} [props.showIcon=false] - Show external link icon
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <DoiLink doi="10.1234/example" />
 *
 * @example
 * // Short format (just the DOI number)
 * <DoiLink doi="10.1234/example" format="short" />
 *
 * @example
 * // Link format (full URL)
 * <DoiLink doi="10.1234/example" format="link" />
 */
export function DoiLink({
  doi,
  format = 'full',
  showIcon = false,
  className,
  ...props
}) {
  if (!doi) return null

  // Normalize DOI - remove URL prefix if present
  const normalizedDoi = doi.replace(/^https?:\/\/doi\.org\//, '')
  const doiUrl = `https://doi.org/${normalizedDoi}`

  // Determine display text
  let displayText
  switch (format) {
    case 'short':
      displayText = normalizedDoi
      break
    case 'link':
      displayText = doiUrl
      break
    case 'full':
    default:
      displayText = `DOI: ${normalizedDoi}`
  }

  return (
    <a
      href={doiUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        color: '#2563eb',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
      {...props}
    >
      {displayText}
      {showIcon && (
        <svg
          style={{
            width: '0.875rem',
            height: '0.875rem',
            opacity: 0.7,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  )
}

export default DoiLink
