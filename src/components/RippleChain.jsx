import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { METRICS } from '../utils/metrics.js'

// The connected sequence view: one small chart per stage of the chain,
// each comparing the two nations. Chart implementation: D3 only -- no
// Plotly / Observable Plot, per the locked stack in README.md.
//
// Props:
//   data -- { [metricKey]: Array<{ nation, year, [field]: number }> }
//   Currently backed by DUMMY placeholder data -- see public/data/*.json
export default function RippleChain({ data }) {
  if (!data) {
    return (
      <section className="px-6 py-12">
        <p className="text-sm opacity-60">Ripple chain -- waiting on data.</p>
      </section>
    )
  }

  return (
    <section className="px-6 py-12">
      <h2 className="text-xl font-semibold mb-4">The ripple chain</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {METRICS.map((m) => (
          <MetricChart key={m.key} title={m.label} data={data[m.key]} valueField={m.field} />
        ))}
      </div>
    </section>
  )
}

function MetricChart({ title, data, valueField }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return

    const width = 260
    const height = 160
    const margin = { top: 8, right: 12, bottom: 20, left: 40 }

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const nations = Array.from(new Set(data.map((d) => d.nation)))
    const color = d3.scaleOrdinal(nations, ['#2563eb', '#dc2626'])

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[valueField]) * 1.1])
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
      const series = data.filter((d) => d.nation === nation).sort((a, b) => a.year - b.year)

      svg
        .append('path')
        .datum(series)
        .attr('fill', 'none')
        .attr('stroke', color(nation))
        .attr('stroke-width', 2)
        .attr('d', line)
    }
  }, [data, valueField])

  return (
    <div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <svg ref={ref} className="w-full h-auto" />
    </div>
  )
}
