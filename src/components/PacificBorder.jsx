// A simple, original geometric wave-crest motif -- NOT a reproduction
// of any specific traditional Pacific textile or art pattern (e.g.
// tapa/masi/ngatu design); those belong to specific communities and
// shouldn't be lifted generically. It's a generic zigzag evoking ocean
// waves, in the site's own palette.
//
// This is a genuine two-tone divider between sections, not a
// decorative strip floating on a blank background: `colorAbove` fills
// the region up to the wave line, `colorBelow` fills the region below
// it. Whatever background colour a section carries (see Section.jsx
// tones) ends exactly at this shape's wave edge, and the next
// section's colour picks up exactly where the wave leaves off -- the
// wave itself *is* the seam, rather than colour needing a flat, exact
// cut that would have to line up pixel-perfectly with a separate
// border element.
const TILE_WIDTH = 20
const TILE_COUNT = 20 // 20 * 20 = 400, matching the original viewBox width
const BASELINE_Y = 12
const CREST_Y = 4
const VIEW_WIDTH = TILE_WIDTH * TILE_COUNT
const VIEW_HEIGHT = 16

// The wave line itself, left to right -- identical zigzag shape to the
// original hand-written pattern tile (baseline -> crest -> baseline,
// twice per 20-unit tile), just generated once across the full width
// instead of repeated as an SVG <pattern>, so it can bound two fill
// regions instead of only being stroked.
function buildWavePoints() {
  const points = [[0, BASELINE_Y]]
  for (let i = 0; i < TILE_COUNT; i++) {
    const x0 = i * TILE_WIDTH
    points.push([x0 + 5, CREST_Y])
    points.push([x0 + 10, BASELINE_Y])
    points.push([x0 + 15, CREST_Y])
    points.push([x0 + 20, BASELINE_Y])
  }
  return points
}

const WAVE_POINTS = buildWavePoints()
const WAVE_FORWARD = WAVE_POINTS.map(([x, y]) => `${x},${y}`).join(' ')
const WAVE_BACKWARD = [...WAVE_POINTS].reverse().map(([x, y]) => `${x},${y}`).join(' ')

// Region above the wave line (top rectangle down to the wave).
const TOP_REGION = `0,0 ${VIEW_WIDTH},0 ${WAVE_BACKWARD}`
// Region below the wave line (wave down to the bottom rectangle).
const BOTTOM_REGION = `${WAVE_FORWARD} ${VIEW_WIDTH},${VIEW_HEIGHT} 0,${VIEW_HEIGHT}`

// Props:
//   colorAbove / colorBelow -- real hex values (see theme.js
//     SECTION_COLORS) matching whatever the sections immediately above
//     and below this divider are using, so colour never has a visible
//     seam anywhere except along the wave itself.
export default function PacificBorder({ colorAbove = '#FAF7F0', colorBelow = '#FAF7F0' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      className="block h-4 w-full"
    >
      <polygon points={TOP_REGION} fill={colorAbove} />
      <polygon points={BOTTOM_REGION} fill={colorBelow} />
      <polyline
        points={WAVE_FORWARD}
        fill="none"
        stroke="#5B8FA3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
