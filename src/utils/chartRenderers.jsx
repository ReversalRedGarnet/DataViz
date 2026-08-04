import * as d3 from 'd3'
import { SELECTION_COLORS } from './theme.js'
import { motionDuration } from './motion.js'

// Shared chart geometry -- every metric chart in RippleChain draws at
// this size inside this margin, so which chartType a metric uses
// (see metrics.js) doesn't also shift the layout of the grid it sits
// in.
export const CHART_WIDTH = 280
export const CHART_HEIGHT = 170
export const CHART_MARGIN = { top: 8, right: 12, bottom: 20, left: 44 }

function slug(nation) {
  return nation.replace(/\s+/g, '')
}

function pointTooltip(nation, year, value, format) {
  return (
    <>
      <p className="font-semibold">{nation}</p>
      <p className="opacity-80">
        {year}: {format(value)}
      </p>
    </>
  )
}

// Renders one metric's chart into an already-sized `svg` selection
// (see resetSvg in d3helpers.js). All three chart types share the same
// y scale/axis and the same hover/tap tooltip wiring; only how the
// marks themselves are drawn differs:
//
//   'bar'  -- grouped bars, one per year actually on record. Used for
//             the disaster metrics, which only have a handful of
//             irregularly-spaced years -- see metrics.js for why a
//             connected line would misrepresent those gaps.
//   'line' -- classic line + point markers, for metrics reported every
//             year.
//   'area' -- line + a soft fill under it, for metrics where the size
//             of a rise or drop is the point.
//
// Every mark responds to hover, tap (click), AND the shared tooltip's
// own "tap outside to dismiss" -- see useTooltip.js. Individual marks
// are deliberately not keyboard-tabbable: with up to ~18 points across
// two nations per chart, tabbing through each one would be tedious,
// and the sr-only data table alongside each chart already gives
// keyboard/screen-reader users the same numbers directly.
export function renderMetricChart(
  svg,
  { allRows, nations, valueField, chartType, format, showTooltip, hideTooltip }
) {
  const width = CHART_WIDTH
  const height = CHART_HEIGHT
  const margin = CHART_MARGIN

  // Colour is assigned by SELECTION ORDER (nations[0], nations[1]), not
  // by data-encounter order, so it always matches the map's 1 / 2
  // badges regardless of which JSON row happens to come first.
  const color = d3.scaleOrdinal(nations, SELECTION_COLORS)

  const isBand = chartType === 'bar'
  const years = Array.from(new Set(allRows.map((d) => d.year))).sort((a, b) => a - b)

  const x = isBand ? d3.scaleBand() : d3.scaleLinear()
  if (isBand) {
    x.domain(years).range([margin.left, width - margin.right]).padding(0.3)
  } else {
    x.domain(d3.extent(allRows, (d) => d.year)).range([margin.left, width - margin.right])
  }
  const x1 = isBand
    ? d3.scaleBand().domain(nations).range([0, x.bandwidth()]).padding(0.15)
    : null

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(allRows, (d) => d[valueField]) * 1.1])
    .nice()
    .range([height - margin.bottom, margin.top])

  const xAxisG = svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`)
  if (isBand) {
    xAxisG.call(d3.axisBottom(x).tickSizeOuter(0))
  } else {
    xAxisG.call(d3.axisBottom(x).ticks(4).tickFormat(d3.format('d')))
  }
  xAxisG.attr('font-size', 9)

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('~s')))
    .attr('font-size', 9)

  function wireMarkInteractions(selection, nation) {
    selection
      .style('cursor', 'pointer')
      .on('pointerenter pointermove', (event, d) =>
        showTooltip(event, pointTooltip(nation, d.year, d[valueField], format))
      )
      .on('pointerleave', hideTooltip)
      .on('click', (event, d) => showTooltip(event, pointTooltip(nation, d.year, d[valueField], format)))
  }

  if (chartType === 'bar') {
    for (const nation of nations) {
      const series = allRows.filter((d) => d.nation === nation)
      if (series.length === 0) continue

      const bars = svg
        .selectAll(`rect.bar-${slug(nation)}`)
        .data(series)
        .join('rect')
        .attr('class', `bar-${slug(nation)}`)
        .attr('x', (d) => x(d.year) + x1(nation))
        .attr('width', x1.bandwidth())
        .attr('y', y(0))
        .attr('height', 0)
        .attr('rx', 2)
        .attr('fill', color(nation))

      wireMarkInteractions(bars, nation)

      bars
        .transition()
        .duration(motionDuration(500))
        .delay((_, i) => motionDuration(i * 40))
        .attr('y', (d) => y(d[valueField]))
        .attr('height', (d) => y(0) - y(d[valueField]))
    }
    return
  }

  // 'line' and 'area' share the same line/point drawing; area adds a
  // fill underneath first so the line and points sit on top of it.
  const line = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d[valueField]))
  const area = d3
    .area()
    .x((d) => x(d.year))
    .y0(y(0))
    .y1((d) => y(d[valueField]))

  for (const nation of nations) {
    const series = allRows.filter((d) => d.nation === nation).sort((a, b) => a.year - b.year)
    if (series.length === 0) continue

    if (chartType === 'area') {
      svg
        .append('path')
        .datum(series)
        .attr('fill', color(nation))
        .attr('fill-opacity', 0)
        .attr('d', area)
        .transition()
        .duration(motionDuration(500))
        .attr('fill-opacity', 0.22)
    }

    const path = svg
      .append('path')
      .datum(series)
      .attr('fill', 'none')
      .attr('stroke', color(nation))
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line)

    // Draw-in animation: hide the stroke behind its own length, then
    // reveal it -- reads as the line being drawn rather than snapping
    // in all at once. motionDuration collapses this to 0 for anyone
    // with reduced motion set.
    const totalLength = path.node().getTotalLength()
    if (totalLength > 0) {
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(motionDuration(650))
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)
    }

    const points = svg
      .selectAll(`circle.point-${slug(nation)}`)
      .data(series)
      .join('circle')
      .attr('class', `point-${slug(nation)}`)
      .attr('cx', (d) => x(d.year))
      .attr('cy', (d) => y(d[valueField]))
      .attr('r', 0)
      .attr('fill', color(nation))

    wireMarkInteractions(points, nation)

    points
      .transition()
      .delay(motionDuration(500))
      .duration(motionDuration(200))
      .attr('r', 3)
  }
}
