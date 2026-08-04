import { useEffect, useMemo, useRef } from 'react'
import { METRICS } from '../utils/metrics.js'
import { resetSvg } from '../utils/d3helpers.js'
import { renderMetricChart, CHART_WIDTH, CHART_HEIGHT } from '../utils/chartRenderers.jsx'
import { useTooltip } from '../hooks/useTooltip.js'
import Section from './Section.jsx'
import SelectionLegend from './SelectionLegend.jsx'
import EmptyState from './EmptyState.jsx'
import NoDataNote from './NoDataNote.jsx'
import Tooltip from './Tooltip.jsx'

// The connected sequence view: one small chart per stage of the chain,
// filtered to whichever nation(s) are selected on the map. Chart
// implementation: D3 only -- no Plotly / Observable Plot, per the
// locked stack in README.md. Which chart *type* each metric uses (bar/
// line/area) is decided in metrics.js, based on how complete each
// metric's data actually is.
//
// Props:
//   data -- { [metricKey]: Array<{ nation, year, [field]: number }> }
//   selectedNations -- ordered array of nation names selected in
//     MapView. Order matters here: it drives which colour each nation
//     gets, kept in sync with the map's numbered badges.
export default function RippleChain({ data, selectedNations }) {
  const { containerRef, tooltip, showTooltip, hideTooltip } = useTooltip()

  // Filtering here (rather than inline in the METRICS.map below) and
  // memoizing on [data, selectedNations] matters more than it looks:
  // the tooltip state above lives in this component, so hovering a
  // chart point re-renders RippleChain. Without memoizing, every hover
  // would produce brand-new `allRows` arrays for all five charts,
  // which -- since each chart's draw effect depends on `allRows` --
  // would re-run every D3 draw and replay every entrance animation on
  // every single hover. Memoizing keeps those array references stable
  // across a tooltip-only re-render, so only an actual selection
  // change redraws the charts.
  const filteredByMetric = useMemo(() => {
    if (!data) return null
    const result = {}
    for (const m of METRICS) {
      result[m.key] = data[m.key].filter((d) => selectedNations.includes(d.nation))
    }
    return result
  }, [data, selectedNations])

  if (!data) return <EmptyState>Ripple chain -- waiting on data.</EmptyState>
  if (!selectedNations || selectedNations.length === 0) {
    return <EmptyState>Click a country on the map above to see its ripple chain.</EmptyState>
  }

  return (
    <Section className="animate-fade-in">
      <div ref={containerRef} className="relative mx-auto max-w-2xl">
        <h2 className="mb-2 text-xl font-semibold">The ripple chain</h2>
        <SelectionLegend selected={selectedNations} />
        <div className="mt-2 grid grid-cols-1 gap-10">
          {METRICS.map((m) => (
            <MetricChart
              key={m.key}
              metric={m}
              allRows={filteredByMetric[m.key]}
              nations={selectedNations}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
          ))}
        </div>
        <Tooltip tooltip={tooltip} />
      </div>
    </Section>
  )
}

function MetricChart({ metric, allRows, nations, showTooltip, hideTooltip }) {
  const { key, label, field: valueField, chartType, format } = metric
  const ref = useRef(null)
  const nationsMissing = nations.filter((n) => !allRows.some((d) => d.nation === n))

  useEffect(() => {
    if (!allRows || allRows.length === 0 || !ref.current) return

    const svg = resetSvg(ref, CHART_WIDTH, CHART_HEIGHT)
    renderMetricChart(svg, { allRows, nations, valueField, chartType, format, showTooltip, hideTooltip })
  }, [allRows, nations, valueField, chartType, format, showTooltip, hideTooltip])

  return (
    <div key={key}>
      <h3 className="mb-2 text-sm font-medium">{label}</h3>
      {allRows.length > 0 ? (
        <svg ref={ref} role="img" aria-label={label} className="h-auto w-full" />
      ) : (
        <NoDataNote
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          className="block py-8 text-center text-sm italic opacity-60"
        >
          Data not available for this metric.
        </NoDataNote>
      )}
      {allRows.length > 0 && nationsMissing.length > 0 && (
        <NoDataNote
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          className="mt-1 inline-block text-xs italic opacity-60"
        >
          No data available for {nationsMissing.join(' and ')}.
        </NoDataNote>
      )}
      {/* Screen-reader-only data table -- the chart above conveys shape
          and trend visually, this gives the same numbers as text. */}
      <table className="sr-only">
        <caption>{label} by year and country</caption>
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
