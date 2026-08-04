import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { METRICS } from '../utils/metrics.js'
import { SELECTION_COLORS } from '../utils/theme.js'
import { resetSvg } from '../utils/d3helpers.js'
import Section from './Section.jsx'
import SelectionLegend from './SelectionLegend.jsx'
import EmptyState from './EmptyState.jsx'

// The connected sequence view: one small chart per stage of the chain,
// filtered to whichever nation(s) are selected on the map. Chart
// implementation: D3 only -- no Plotly / Observable Plot, per the
// locked stack in README.md.
//
// Props:
//   data -- { [metricKey]: Array<{ nation, year, [field]: number }> }
//   selectedNations -- ordered array of nation names selected in
//     MapView. Order matters here: it drives which colour each nation
//     gets, kept in sync with the map's numbered badges.
export default function RippleChain({ data, selectedNations }) {
  if (!data) return <EmptyState>Ripple chain -- waiting on data.</EmptyState>
  if (!selectedNations || selectedNations.length === 0) {
    return <EmptyState>Click a country on the map above to see its ripple chain.</EmptyState>
  }

  return (
    <Section>
      <h2 className="text-xl font-semibold mb-2">The ripple chain</h2>
      <SelectionLegend selected={selectedNations} />
      <div className="grid gap-8 grid-cols-1 max-w-xl mx-auto">
        {METRICS.map((m) => (
          <MetricChart
            key={m.key}
            title={m.label}
            allRows={data[m.key].filter((d) => selectedNations.includes(d.nation))}
            nations={selectedNations}
            valueField={m.field}
          />
        ))}
      </div>
    </Section>
  )
}

function MetricChart({ title, allRows, nations, valueField }) {
  const ref = useRef(null)
  const nationsMissing = nations.filter((n) => !allRows.some((d) => d.nation === n))

  useEffect(() => {
    if (!allRows || allRows.length === 0 || !ref.current) return

    const width = 280
    const height = 170
    const margin = { top: 8, right: 12, bottom: 20, left: 44 }

    const svg = resetSvg(ref, width, height)

    // Colour is assigned by SELECTION ORDER (nations[0], nations[1]),
    // not by data-encounter order, so it always matches the map's 1 / 2
    // badges regardless of which JSON row happens to come first.
    const color = d3.scaleOrdinal(nations, SELECTION_COLORS)

    const x = d3
      .scaleLinear()
      .domain(d3.extent(allRows, (d) => d.year))
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allRows, (d) => d[valueField]) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top])

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(4).tickFormat(d3.format('d')))
      .attr('font-size', 9)

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4))
      .attr('font-size', 9)

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d[valueField]))

    for (const nation of nations) {
      const series = allRows.filter((d) => d.nation === nation).sort((a, b) => a.year - b.year)
      if (series.length === 0) continue

      svg
        .append('path')
        .datum(series)
        .attr('fill', 'none')
        .attr('stroke', color(nation))
        .attr('stroke-width', 2)
        .attr('d', line)

      // Small hoverable point per data value -- native <title> gives a
      // tooltip with the exact number on hover/focus, and is read by
      // screen readers too.
      svg
        .selectAll(`circle.point-${nation.replace(/\s+/g, '')}`)
        .data(series)
        .join('circle')
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => y(d[valueField]))
        .attr('r', 3)
        .attr('fill', color(nation))
        .style('cursor', 'default')
        .append('title')
        .text((d) => `${nation}, ${d.year}: ${d[valueField]}`)
    }
  }, [allRows, nations, valueField])

  return (
    <div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      {allRows.length > 0 ? (
        <svg ref={ref} role="img" aria-label={title} className="w-full h-auto" />
      ) : (
        <p
          className="text-sm opacity-60 italic py-8 text-center underline decoration-dotted decoration-ink/40 cursor-help"
          title="This metric isn't consistently reported by every country in the official Pacific Data Hub dataset -- smaller nations often have less capacity to compile detailed disaster statistics. As disasters grow more frequent, closing that reporting gap will matter too."
        >
          Data not available for this metric.
        </p>
      )}
      {allRows.length > 0 && nationsMissing.length > 0 && (
        <p
          className="text-xs opacity-60 italic mt-1 underline decoration-dotted decoration-ink/40 cursor-help inline-block"
          title="This metric isn't consistently reported by every country in the official Pacific Data Hub dataset -- smaller nations often have less capacity to compile detailed disaster statistics. As disasters grow more frequent, closing that reporting gap will matter too."
        >
          No data available for {nationsMissing.join(' and ')}.
        </p>
      )}
      {/* Screen-reader-only data table -- the chart above conveys shape
          and trend visually, this gives the same numbers as text. */}
      <table className="sr-only">
        <caption>{title} by year and country</caption>
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Year</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {allRows.map((d) => (
            <tr key={`${d.nation}-${d.year}`}>
              <td>{d.nation}</td>
              <td>{d.year}</td>
              <td>{d[valueField]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
