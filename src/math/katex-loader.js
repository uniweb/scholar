/**
 * KaTeX Lazy Loader
 *
 * Provides lazy loading of KaTeX with module-level caching.
 * KaTeX is only loaded when math rendering is actually needed.
 *
 * @module @uniweb/scholar/math/katex-loader
 */

// Module-level state for singleton pattern
let katexInstance = null
let katexLoadPromise = null
let cssInjected = false

/**
 * CDN URL for KaTeX CSS (matches the katex version in package.json)
 */
const KATEX_CSS_URL = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css'

/**
 * Inject KaTeX CSS into the document head
 * Only injects once per page load
 */
function injectKatexCSS() {
  if (cssInjected || typeof document === 'undefined') return

  const styleId = 'uniweb-katex-css'

  // Check if already injected
  if (document.getElementById(styleId)) {
    cssInjected = true
    return
  }

  const link = document.createElement('link')
  link.id = styleId
  link.rel = 'stylesheet'
  link.href = KATEX_CSS_URL
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)

  cssInjected = true
}

/**
 * Load KaTeX lazily
 *
 * Returns cached instance if already loaded, otherwise loads
 * KaTeX dynamically and injects its CSS.
 *
 * @returns {Promise<Object>} The KaTeX module
 */
export async function loadKatex() {
  if (katexInstance) return katexInstance
  if (katexLoadPromise) return katexLoadPromise

  katexLoadPromise = (async () => {
    try {
      const katex = await import('katex')
      katexInstance = katex.default || katex

      // Inject CSS when KaTeX is loaded
      injectKatexCSS()

      return katexInstance
    } catch (error) {
      console.warn('[scholar/math] Failed to load KaTeX:', error)
      katexLoadPromise = null
      return null
    }
  })()

  return katexLoadPromise
}

/**
 * Check if KaTeX is already loaded
 *
 * @returns {boolean} True if KaTeX is loaded and ready
 */
export function isKatexLoaded() {
  return katexInstance !== null
}

/**
 * Render LaTeX to HTML string
 *
 * @param {string} latex - LaTeX string to render
 * @param {Object} options - KaTeX options
 * @returns {Promise<string|null>} Rendered HTML or null on error
 */
export async function renderLatex(latex, options = {}) {
  const katex = await loadKatex()
  if (!katex) return null

  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      ...options,
    })
  } catch (error) {
    console.warn('[scholar/math] LaTeX render error:', error.message)
    return null
  }
}
