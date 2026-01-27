/**
 * CiteButton Component
 *
 * A dropdown button that lets users copy citations in various formats.
 *
 * @module @uniweb/scholar/components/CiteButton
 */

import React, { useState, useRef, useEffect } from 'react'
import { formatReference } from '../bibliography/formatters/index.js'
import { exportBibtex } from '../bibliography/parsers/bibtex.js'

/**
 * CiteButton - Copy citation dropdown
 *
 * @param {Object} props
 * @param {Object} props.publication - Publication data
 * @param {Array<string>} [props.styles=['apa', 'mla', 'chicago', 'ieee', 'bibtex']] - Available citation styles
 * @param {string} [props.label='Cite'] - Button label
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <CiteButton publication={myPublication} styles={['apa', 'mla', 'bibtex']} />
 */
export function CiteButton({
  publication,
  styles = ['apa', 'mla', 'chicago', 'ieee', 'bibtex'],
  label = 'Cite',
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(null)
  const dropdownRef = useRef(null)

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

  // Copy citation to clipboard
  async function copyToClipboard(style) {
    try {
      let text
      if (style === 'bibtex') {
        text = exportBibtex(publication)
      } else {
        text = formatReference(publication, { style })
      }

      await navigator.clipboard.writeText(text)
      setCopied(style)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const styleLabels = {
    apa: 'APA',
    mla: 'MLA',
    chicago: 'Chicago',
    ieee: 'IEEE',
    bibtex: 'BibTeX',
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
            minWidth: '8rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {styles.map((style) => (
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
              {copied === style ? '✓ Copied!' : styleLabels[style] || style.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CiteButton
