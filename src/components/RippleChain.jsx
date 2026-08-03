import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { METRICS } from '../utils/metrics.js'
import { SELECTION_COLORS } from '../utils/theme.js'
import Section from './Section.jsx'
import SelectionLegend from './SelectionLegend.jsx'

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
  if (!data) {
    return (
      <Section>
        <p className="text-sm opacity-60">Ripple chain -- waiting on data.</p>
      </Section>
    )
  }

  if (!selectedNations || selectedNations.length === 0) {
    return (
      <Section>
        <p className="text-sm opacity-60">
          Click a country on the map above to see its ripple chain.
        </p>
      </Section>
    )
  }

  return (
    <Section>
      <h2 className="text-xl font-semibold mb-2">The ripple chain</h2>
      <SelectionLegend selected={selectedNations} />
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
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

  useEffect(() => {
    if (!allRows || allRows.length === 0 || !ref.current) return

    const width = 280
    const height = 170
    const margin = { top: 8, right: 12, bottom: 20, left: 44 }

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

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
    }
  }, [allRows, nations, valueField])

  return (
    <div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <svg ref={ref} role="img" aria-label={title} className="w-full h-auto" />
    </div>
  )
}
