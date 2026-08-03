import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import Section from './Section.jsx'
import { SELECTION_COLORS } from '../utils/theme.js'
import { resetSvg } from '../utils/d3helpers.js'

// Illustrative Pacific map: real coastlines with fixed markers on top,
// pan + zoom via d3-zoom, click to select up to two nations. No tile
// server, no API key -- the coastline file at public/land-50m.json is a
// static export from the 'world-atlas' npm package (50m resolution;
// re-copy node_modules/world-atlas/land-50m.json there if it's ever
// missing), fetched once at runtime rather than bundled into the JS so
// it doesn't bloat the main bundle or block the initial page render.
//
// DUMMY PLACEHOLDER nation set -- swap for your locked pair(s) later
// (see README.md -> "Scope (locked)"). Coordinates are approximate
// (capital city), fine for an illustrative map, not for navigation.
//
// Note: Kiribati's Tarawa atoll is small enough that it's simplified
// away entirely at this basemap's resolution -- its marker and label
// still render normally, it just won't have visible land underneath.
// Using a higher-resolution basemap would fix that at the cost of a
// much larger download (10m resolution is ~6x the file size), which
// isn't worth it for one atoll's outline.
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
//   selected -- array of up to two nation names, in the order picked
//   onToggle -- (name) => void, called on marker click / Enter / Space
//   onClear -- () => void, clears the current selection
export default function MapView({ selected, onToggle, onClear }) {
  const svgRef = useRef(null)
  const gRef = useRef(null)
  const zoomRef = useRef(null)

  // Build the map once: basemap, projection, markers, zoom behaviour.
  // Selection colour updates happen in the effect below so panning/
  // zooming isn't reset every time a marker is clicked. The coastline
  // fetch is async, so the rest of setup runs inside it once that
  // resolves; `cancelled` guards against touching anything after
  // unmount if that happens before the fetch finishes.
  useEffect(() => {
    let cancelled = false

    async function setup() {
      const land50m = await fetch('/land-50m.json').then((res) => res.json())
      if (cancelled || !svgRef.current) return

      const svg = resetSvg(svgRef, WIDTH, HEIGHT)

      // Rotate so the antimeridian (180 deg) sits at the projection's
      // centre. Without this, nations on opposite sides of 180 deg
      // longitude (e.g. Fiji at +178 vs Samoa at -172) render on
      // opposite edges of the map instead of near each other.
      const projection = d3.geoMercator().rotate([-180, 0])

      const points = {
        type: 'FeatureCollection',
        features: NATIONS.map((n) => ({
          type: 'Feature',
          properties: { name: n.name },
          geometry: { type: 'Point', coordinates: [n.lon, n.lat] },
        })),
      }
      // Fitted to our 6 markers, not the whole world, so the initial
      // view stays zoomed into the Pacific rather than zoomed out to
      // fit every continent.
      projection.fitExtent(
        [
          [40, 40],
          [WIDTH - 40, HEIGHT - 40],
        ],
        points
      )

      const g = svg.append('g')
      gRef.current = g

      // Ocean background, then real coastlines drawn through the same
      // projection -- anything outside the viewBox is simply cropped,
      // same as any regional map.
      g.append('rect')
        .attr('x', -2000)
        .attr('y', -2000)
        .attr('width', WIDTH + 4000)
        .attr('height', HEIGHT + 4000)
        .attr('fill', '#DCEEF2')

      const geoPath = d3.geoPath(projection)
      const landFeature = feature(land50m, land50m.objects.land)
      g.append('path')
        .datum(landFeature)
        .attr('d', geoPath)
        .attr('fill', '#FAF7F0')
        .attr('stroke', '#C9DCE2')
        .attr('stroke-width', 0.5)

      // Drag-to-pan and touch pinch-to-zoom stay on. Mouse-wheel /
      // trackpad scroll is deliberately excluded from triggering zoom
      // (see the filter below) so scrolling PAST the map on the page
      // doesn't accidentally zoom it -- zooming only ever happens via
      // touch pinch or the +/- buttons below.
      const zoom = d3
        .zoom()
        .scaleExtent([1, 6])
        .filter((event) => event.type !== 'wheel')
        .on('zoom', (event) => {
          g.attr('transform', event.transform)
        })
      zoomRef.current = zoom
      svg.call(zoom)

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
        .attr('role', 'button')
        .attr('tabindex', 0)
        .attr('aria-label', (d) => `Select ${d.name}`)
        .on('click', (_, d) => onToggle(d.name))
        .on('keydown', (event, d) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onToggle(d.name)
          }
        })

      // Native tooltip on hover/focus, also read aloud by screen readers.
      marker.append('title').text((d) => d.name)

      // Larger invisible circle purely so touch/mouse users get a
      // comfortable tap target -- doesn't change the visible dot size.
      // pointer-events is set explicitly so it's clickable despite
      // being transparent.
      marker
        .append('circle')
        .attr('class', 'marker-hit')
        .attr('r', 18)
        .attr('fill', 'transparent')
        .attr('pointer-events', 'all')

      marker
        .append('circle')
        .attr('class', 'marker-dot')
        .attr('r', 7)
        .attr('fill', '#5B8FA3')
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)

      marker
        .append('text')
        .attr('class', 'marker-badge')
        .attr('text-anchor', 'middle')
        .attr('y', 4)
        .attr('font-size', 9)
        .attr('font-weight', 700)
        .attr('fill', 'white')
        .style('pointer-events', 'none')

      marker
        .append('text')
        .attr('class', 'marker-label')
        .text((d) => d.name)
        .attr('x', 12)
        .attr('y', 4)
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .style('pointer-events', 'none')
    }

    setup()
    return () => {
      cancelled = true
    }
    // Runs once on mount -- see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recolour markers and show a 1 / 2 badge on selection change, without
  // rebuilding the map (which would reset the user's pan/zoom position).
  useEffect(() => {
    if (!gRef.current) return
    const markers = gRef.current.selectAll('g.marker')

    markers
      .select('circle.marker-dot')
      .attr('fill', (d) => {
        const i = selected.indexOf(d.name)
        return i === -1 ? '#5B8FA3' : SELECTION_COLORS[i]
      })

    markers.select('text.marker-badge').text((d) => {
      const i = selected.indexOf(d.name)
      return i === -1 ? '' : String(i + 1)
    })
  }, [selected])

  // Respect the OS-level "reduce motion" setting (relevant for vestibular
  // disorders) by skipping the animation rather than forcing it.
  function transitionDuration() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return prefersReduced ? 0 : 200
  }

  function zoomBy(factor) {
    if (!zoomRef.current || !svgRef.current) return
    d3.select(svgRef.current)
      .transition()
      .duration(transitionDuration())
      .call(zoomRef.current.scaleBy, factor)
  }

  function resetView() {
    if (!zoomRef.current || !svgRef.current) return
    d3.select(svgRef.current)
      .transition()
      .duration(transitionDuration())
      .call(zoomRef.current.transform, d3.zoomIdentity)
  }

  return (
    <Section tone="ocean">
      <h2 className="text-xl font-semibold mb-2">Explore the Pacific</h2>
      <p className="text-sm opacity-70 mb-3">
        Tap a marker to select it, tap a second one to compare. Drag to pan, pinch to zoom, or use
        the buttons.
      </p>
      <div className="relative">
        <svg
          ref={svgRef}
          role="img"
          aria-label="Map of the Pacific with six selectable nations"
          className="w-full h-auto border rounded-lg"
        />
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => zoomBy(1.5)}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-lg font-semibold"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.5)}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-lg font-semibold"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetView}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-xs font-semibold"
            aria-label="Reset view"
          >
            ⟲
          </button>
        </div>
      </div>
      {selected.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 text-sm underline opacity-70 hover:opacity-100"
        >
          Clear selection
        </button>
      )}
    </Section>
  )
}
