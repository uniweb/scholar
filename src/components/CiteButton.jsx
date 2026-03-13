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
          padding: '0.125rem 0.5rem',
          fontSize: '0.8125rem',
          fontWeight: '400',
          color: 'var(--subtle, #6b7280)',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={(e) => { e.target.style.color = 'var(--heading, #111827)' }}
        onMouseLeave={(e) => { if (!isOpen) e.target.style.color = 'var(--subtle, #6b7280)' }}
      >
        {/* Quote icon */}
        <svg
          style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7, flexShrink: 0 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
        </svg>
        {label}
        <svg
          style={{
            width: '0.625rem',
            height: '0.625rem',
            opacity: 0.5,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.15s',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
            minWidth: '8.5rem',
            backgroundColor: 'var(--section, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            zIndex: 50,
            overflow: 'hidden',
            padding: '0.25rem',
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
                padding: '0.375rem 0.625rem',
                fontSize: '0.8125rem',
                textAlign: 'left',
                color: copied === style ? '#059669' : 'var(--body, #374151)',
                backgroundColor: copied === style ? '#ecfdf5' : 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (copied !== style) {
                  e.target.style.backgroundColor = 'var(--card, #f3f4f6)'
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
