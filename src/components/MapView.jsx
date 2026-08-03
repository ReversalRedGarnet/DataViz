import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

// Illustrative Pacific map: fixed markers, pan + zoom via d3-zoom, click
// to select up to two nations. No Leaflet, no tile basemap, no new
// dependency -- d3-geo and d3-zoom already ship inside the 'd3' package
// already in package.json.
//
// DUMMY PLACEHOLDER nation set -- swap for your locked pair(s) later
// (see README.md -> "Scope (locked)"). Coordinates are approximate
// (capital city), fine for an illustrative map, not for navigation.
export const NATIONS = [
  { name: 'Fiji', lat: -18.14, lon: 178.44 },
  { name: 'Solomon Islands', lat: -9.43, lon: 159.95 },
  { name: 'Vanuatu', lat: -17.73, lon: 168.32 },
  { name: 'Samoa', lat: -13.83, lon: -171.76 },
  { name: 'Tonga', lat: -21.14, lon: -175.2 },
  { name: 'Kiribati', lat: 1.35, lon: 173.02 },
]

const WIDTH = 700
const HEIGHT = 460

// Props:
//   selected -- array of up to two nation names currently selected
//   onToggle -- (name) => void, called when a marker is clicked
export default function MapView({ selected, onToggle }) {
  const svgRef = useRef(null)
  const gRef = useRef(null)

  // Build the map once: projection, markers, zoom behaviour. Selection
  // colour updates are handled in the effect below so panning/zooming
  // doesn't get reset every time a marker is clicked.
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

    // Rotate so the antimeridian (180°) sits at the projection's centre.
    // Without this, nations on opposite sides of 180° longitude (e.g.
    // Fiji at +178° vs Samoa at -172°) render on opposite edges of the
    // map instead of near each other.
    const projection = d3.geoMercator().rotate([-180, 0])

    const points = {
      type: 'FeatureCollection',
      features: NATIONS.map((n) => ({
        type: 'Feature',
        properties: { name: n.name },
        geometry: { type: 'Point', coordinates: [n.lon, n.lat] },
      })),
    }
    projection.fitExtent(
      [
        [40, 40],
        [WIDTH - 40, HEIGHT - 40],
      ],
      points
    )

    const g = svg.append('g')
    gRef.current = g

    svg.call(
      d3
        .zoom()
        .scaleExtent([1, 6])
        .on('zoom', (event) => g.attr('transform', event.transform))
    )

    const marker = g
      .selectAll('g.marker')
      .data(NATIONS)
      .join('g')
      .attr('class', 'marker')
      .attr('transform', (d) => {
        const [x, y] = projection([d.lon, d.lat])
        return `translate(${x},${y})`
      })
      .style('cursor', 'pointer')
      .on('click', (_, d) => onToggle(d.name))

    marker
      .append('circle')
      .attr('class', 'marker-dot')
      .attr('r', 7)
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)

    marker
      .append('text')
      .text((d) => d.name)
      .attr('x', 10)
      .attr('y', 4)
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
    // Runs once on mount -- see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recolour markers on selection change, without rebuilding the map
  // (which would reset the user's current pan/zoom position).
  useEffect(() => {
    if (!gRef.current) return
    gRef.current
      .selectAll('g.marker')
      .select('circle.marker-dot')
      .attr('fill', (d) => (selected.includes(d.name) ? '#dc2626' : '#2563eb'))
  }, [selected])

  return (
    <section className="px-6 py-8">
      <h2 className="text-xl font-semibold mb-2">Explore the Pacific</h2>
      <p className="text-sm opacity-70 mb-3">
        Click a marker to select it, click a second to compare. Drag to pan, scroll or pinch to
        zoom.
      </p>
      <svg ref={svgRef} className="w-full h-auto border rounded" />
    </section>
  )
}
