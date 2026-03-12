/**
 * CiteButton Component
 *
 * A dropdown button that lets users copy citations in various formats,
 * including rich text (HTML with formatting preserved for paste into Word/Docs).
 *
 * @module @uniweb/scholar/components/CiteButton
 */

import React, { useState, useRef, useEffect } from 'react'
import { formatReference, getAvailableStyles } from '../bibliography/formatters/index.js'
import { exportBibtex } from '../bibliography/parsers/index.js'

/**
 * CiteButton - Copy citation dropdown
 *
 * @param {Object} props
 * @param {Object} props.publication - Publication data (Scholar or CSL-JSON)
 * @param {Array<string>} [props.styles] - Style names to show (defaults to all + bibtex)
 * @param {string} [props.label='Cite'] - Button label
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <CiteButton publication={myPublication} styles={['apa', 'mla', 'bibtex']} />
 */
export function CiteButton({
  publication,
  styles,
  label = 'Cite',
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(null)
  const dropdownRef = useRef(null)

  // Default: all available citation styles + bibtex
  const availableStyles = getAvailableStyles()
  const styleIds = styles || [...availableStyles.map((s) => s.id), 'bibtex']

  // Build label map from available styles
  const styleLabels = Object.fromEntries(
    availableStyles.map((s) => [s.id, s.label])
  )
  styleLabels.bibtex = 'BibTeX'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  /**
   * Copy citation to clipboard.
   * For citation styles, copies both plain text and rich HTML.
   */
  async function copyToClipboard(style) {
    try {
      if (style === 'bibtex') {
        const text = exportBibtex(publication)
        await navigator.clipboard.writeText(text)
      } else {
        const entry = formatReference(publication, { style })

        // Try rich-text copy (HTML + plain text) for formatting in Word/Docs
        if (typeof ClipboardItem !== 'undefined') {
          try {
            const item = new ClipboardItem({
              'text/html': new Blob([entry.html], { type: 'text/html' }),
              'text/plain': new Blob([entry.text], { type: 'text/plain' }),
            })
            await navigator.clipboard.write([item])
          } catch {
            // Fallback to plain text if rich copy fails
            await navigator.clipboard.writeText(entry.text)
          }
        } else {
          await navigator.clipboard.writeText(entry.text)
        }
      }

      setCopied(style)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.375rem 0.75rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          cursor: 'pointer',
        }}
      >
        {label}
        <svg
          style={{
            width: '1rem',
            height: '1rem',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.15s',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.25rem',
            minWidth: '10rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {styleIds.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => copyToClipboard(style)}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                textAlign: 'left',
                color: copied === style ? '#059669' : '#374151',
                backgroundColor: copied === style ? '#ecfdf5' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (copied !== style) {
                  e.target.style.backgroundColor = '#f3f4f6'
                }
              }}
              onMouseLeave={(e) => {
                if (copied !== style) {
                  e.target.style.backgroundColor = 'transparent'
                }
              }}
            >
              {copied === style
                ? '✓ Copied!'
                : styleLabels[style] || style.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CiteButton
