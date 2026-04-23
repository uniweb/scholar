# @uniweb/scholar

Academic content utilities for Uniweb: math rendering, bibliographic references, and inline citations.

## Installation

```bash
npm install @uniweb/scholar
# or
pnpm add @uniweb/scholar
```

## Features

- **Numbered Equations** - Cross-referenceable display equations
- **Bibliography** - Format references in APA, MLA, Chicago, and IEEE styles
- **Citations** - Track inline citations with automatic bibliography generation
- **BibTeX** - Parse and export BibTeX format
- **UI Components** - Ready-to-use citation buttons, author lists, and DOI links

> **Plain LaTeX math** (inline `$x$`, display `$$x$$`, fenced ```` ```math ````) is handled by Uniweb's content pipeline — the markdown parser compiles LaTeX to MathML Core at build time and the browser renders it natively. No runtime math library needed; no `<Math>` component required.

## Quick Start

### Numbered Equations

```jsx
import { Equation, EquationRef, EquationProvider } from '@uniweb/scholar/math'

<EquationProvider>
  <Equation id="einstein">E = mc^2</Equation>
  <p>As shown in <EquationRef id="einstein" />, energy equals mass times the speed of light squared.</p>
</EquationProvider>
```

### Citations and Bibliography

```jsx
import { CitationProvider, Citation, Bibliography } from '@uniweb/scholar/citations'

const references = [
  {
    id: 'smith2024',
    type: 'article',
    authors: [{ family: 'Smith', given: 'John' }],
    title: 'A Study of Something Important',
    journal: 'Journal of Studies',
    year: 2024,
    volume: '10',
    pages: '1-15',
    doi: '10.1234/example'
  }
]

<CitationProvider references={references} style="apa">
  <p>
    Recent research <Citation id="smith2024" /> has shown significant progress.
  </p>
  <p>
    According to <Citation id="smith2024" format="narrative" />, the findings are clear.
  </p>
  <Bibliography title="References" />
</CitationProvider>
```

### BibTeX Support

```jsx
import { CitationProvider, Citation, Bibliography } from '@uniweb/scholar/citations'

const bibtex = `
@article{smith2024,
  author = {Smith, John and Doe, Jane},
  title = {A Study of Something Important},
  journal = {Journal of Studies},
  year = {2024},
  volume = {10},
  pages = {1--15},
  doi = {10.1234/example}
}
`

<CitationProvider references={bibtex} style="apa">
  <p>Research shows <Citation id="smith2024" /> that...</p>
  <Bibliography />
</CitationProvider>
```

## API Reference

### Math Module

Scholar does not ship a math renderer. Plain LaTeX in markdown is compiled to MathML by Uniweb's content pipeline and rendered natively by the browser — see the framework docs for the `$x$`, `$$x$$`, and ```math fence syntax.

`<Equation>` and `<EquationRef>` cover the distinct feature of **numbered cross-referenceable equations**. They consume pre-compiled MathML from `content.math` and are fully SSR-safe.

Label an equation in markdown with a `:<id>` suffix on the fence:

````markdown
```math:einstein
E = mc^2
```
````

Then in a foundation's section component:

```jsx
import { Equation, EquationProvider, EquationRef } from '@uniweb/scholar/math'

function MyBlock({ content }) {
  return (
    <EquationProvider>
      {content.math?.filter(m => m.id).map(m => (
        <Equation key={m.id} id={m.id} mathml={m.mathml} />
      ))}
      <p>As shown in <EquationRef id="einstein" />, energy equals mc².</p>
    </EquationProvider>
  )
}
```

#### `<Equation>`

Numbered display equation rendered from pre-compiled MathML.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | auto | Identifier for cross-referencing |
| `mathml` | `string` | - | Pre-compiled MathML from `content.math[i].mathml` |
| `label` | `string` | - | Override the auto-number with a custom label |
| `className` | `string` | - | CSS classes on the wrapper |

#### `<EquationRef>`

Link to a numbered equation within the same `<EquationProvider>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | ID of equation to reference |
| `format` | `string` | `'parentheses'` | `'parentheses'`, `'plain'`, or `'equation'` |

#### `<EquationProvider>`

Context provider for equation numbering. Wrap content containing equations and their references.

### Citations Module

#### `<CitationProvider>`

Manages citation state for a document.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `references` | `Array\|string` | - | Reference objects or BibTeX string |
| `style` | `string` | `'apa'` | Citation style |
| `children` | `ReactNode` | - | Document content |

#### `<Citation>`

Renders an inline citation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Reference ID to cite |
| `ids` | `string[]` | - | Multiple reference IDs |
| `page` | `string` | - | Page number(s) |
| `prefix` | `string` | - | Text before citation |
| `suffix` | `string` | - | Text after citation |
| `suppressAuthor` | `boolean` | `false` | Show only year |
| `format` | `string` | `'parenthetical'` | `'parenthetical'`, `'narrative'`, `'numeric'` |

#### `<Bibliography>`

Renders the list of cited references.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'References'` | Section title |
| `showTitle` | `boolean` | `true` | Whether to show title |
| `showAll` | `boolean` | `false` | Show all refs, not just cited |

### Bibliography Module

#### `formatReference(publication, options)`

Format a reference in a specific style.

```js
import { formatReference } from '@uniweb/scholar/bibliography'

const ref = formatReference({
  type: 'article',
  authors: [{ family: 'Smith', given: 'John' }],
  title: 'A Study',
  journal: 'Journal',
  year: 2024
}, { style: 'apa' })
```

#### `parseBibtex(bibtex)` / `exportBibtex(publication)`

Parse BibTeX to objects or export objects to BibTeX.

```js
import { parseBibtex, exportBibtex } from '@uniweb/scholar/bibliography'

const refs = parseBibtex(bibtexString)
const bibtex = exportBibtex(publication)
```

### UI Components

#### `<CiteButton>`

Dropdown button to copy citations in various formats.

```jsx
import { CiteButton } from '@uniweb/scholar/components'

<CiteButton
  publication={pub}
  styles={['apa', 'mla', 'bibtex']}
/>
```

#### `<BibtexBlock>`

Display copyable BibTeX entry.

```jsx
import { BibtexBlock } from '@uniweb/scholar/components'

<BibtexBlock entry={publication} />
```

#### `<AuthorList>`

Formatted author names with optional ORCID links.

```jsx
import { AuthorList } from '@uniweb/scholar/components'

<AuthorList
  authors={[
    { family: 'Smith', given: 'John', orcid: '0000-0001-2345-6789' }
  ]}
  style="apa"
/>
```

#### `<DoiLink>`

DOI with automatic link.

```jsx
import { DoiLink } from '@uniweb/scholar/components'

<DoiLink doi="10.1234/example" />
```

## Citation Styles

| Style | Description |
|-------|-------------|
| `apa` | APA 7th Edition |
| `mla` | MLA 9th Edition |
| `chicago` | Chicago Author-Date |
| `ieee` | IEEE (numeric) |

## Reference Object Structure

```js
{
  id: 'smith2024',           // Citation key
  type: 'article',           // article, book, inproceedings, etc.
  authors: [                 // Array of author objects
    { family: 'Smith', given: 'John', orcid: '...' }
  ],
  title: 'Article Title',
  journal: 'Journal Name',   // For articles
  bookTitle: 'Book Title',   // For chapters
  year: 2024,
  volume: '10',
  issue: '2',
  pages: '1-15',
  publisher: 'Publisher',
  doi: '10.1234/example',
  url: 'https://...',
  abstract: '...',
  keywords: ['keyword1', 'keyword2']
}
```

## Bundle Size

Scholar ships no math renderer — MathML is pre-compiled upstream and rendered natively by the browser. Approximate subpath sizes:

| Module | Size |
|--------|------|
| bibliography (formatters, parsers) | ~15KB |
| math (numbered equations, refs)    | ~5KB  |
| citations                          | ~10KB |
| components                         | ~8KB  |

## License

Apache-2.0
