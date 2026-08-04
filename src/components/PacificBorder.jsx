// A simple, original geometric wave-crest motif used as a top/bottom
// page border. This is NOT a reproduction of any specific traditional
// Pacific textile or art pattern (e.g. tapa/masi/ngatu design) -- those
// belong to specific communities and shouldn't be lifted generically.
// It's a generic zigzag evoking ocean waves, in the site's own palette,
// tiled via an SVG pattern so it repeats cleanly at any width.
//
// Now doing double duty as the divider between page sections (see
// App.jsx), replacing the pastel background tints sections used to
// carry to tell them apart. `flip` mirrors the crest into a trough so
// consecutive dividers read as one continuous wave rather than an
// identical stamp repeated down the page. With up to five of these on
// one page now (versus two before), the pattern id is made unique per
// instance via useId -- duplicate SVG ids are invalid markup, even
// where browsers tolerate it visually.
import { useId } from 'react'

export default function PacificBorder({ flip = false }) {
  const patternId = `pacific-wave-crest-${useId()}`
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 16"
      preserveAspectRatio="none"
      className={`w-full h-4 block ${flip ? 'rotate-180' : ''}`}
    >
      <defs>
        <pattern id={patternId} width="20" height="16" patternUnits="userSpaceOnUse">
          <polyline
            points="0,12 5,4 10,12 15,4 20,12"
            fill="none"
            stroke="#5B8FA3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </pattern>
      </defs>
      <rect width="400" height="16" fill={`url(#${patternId})`} />
    </svg>
  )
}
