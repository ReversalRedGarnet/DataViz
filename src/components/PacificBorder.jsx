// A simple, original geometric wave-crest motif used as a top/bottom
// page border. This is NOT a reproduction of any specific traditional
// Pacific textile or art pattern (e.g. tapa/masi/ngatu design) -- those
// belong to specific communities and shouldn't be lifted generically.
// It's a generic zigzag evoking ocean waves, in the site's own palette,
// tiled via an SVG pattern so it repeats cleanly at any width.
export default function PacificBorder() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 16"
      preserveAspectRatio="none"
      className="w-full h-4 block"
    >
      <defs>
        <pattern id="pacific-wave-crest" width="20" height="16" patternUnits="userSpaceOnUse">
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
      <rect width="400" height="16" fill="url(#pacific-wave-crest)" />
    </svg>
  )
}
