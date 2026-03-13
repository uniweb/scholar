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
    case 'label':
      displayText = 'DOI'
      break
    case 'icon':
      displayText = null
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
      title={`DOI: ${normalizedDoi}`}
      style={{
        color: 'var(--subtle, #6b7280)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.8125rem',
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary, #2563eb)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--subtle, #6b7280)' }}
      {...props}
    >
      {/* DOI icon — external link */}
      <svg
        style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
      {displayText && <span>{displayText}</span>}
    </a>
  )
}

export default DoiLink
