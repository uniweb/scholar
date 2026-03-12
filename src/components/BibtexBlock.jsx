/**
 * BibtexBlock Component
 *
 * Displays a BibTeX entry with copy functionality.
 *
 * @module @uniweb/scholar/components/BibtexBlock
 */

import React, { useState } from 'react'
import { exportBibtex } from '../bibliography/parsers/index.js'

/**
 * BibtexBlock - Display copyable BibTeX entry
 *
 * @param {Object} props
 * @param {Object|string} props.entry - Publication object or BibTeX string
 * @param {boolean} [props.showCopyButton=true] - Show copy button
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <BibtexBlock entry={publication} />
 *
 * @example
 * <BibtexBlock entry="@article{smith2024, ...}" />
 */
export function BibtexBlock({
  entry,
  showCopyButton = true,
  className,
  ...props
}) {
  const [copied, setCopied] = useState(false)

  // Get BibTeX string
  const bibtex = typeof entry === 'string' ? entry : exportBibtex(entry)

  // Copy to clipboard
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bibtex)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
      {...props}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          BibTeX
        </span>

        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              color: copied ? '#059669' : '#64748b',
              backgroundColor: copied ? '#ecfdf5' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            {copied ? (
              <>
                <svg
                  style={{ width: '0.875rem', height: '0.875rem' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  style={{ width: '0.875rem', height: '0.875rem' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* BibTeX content */}
      <pre
        style={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
          color: '#334155',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {bibtex}
      </pre>
    </div>
  )
}

export default BibtexBlock
