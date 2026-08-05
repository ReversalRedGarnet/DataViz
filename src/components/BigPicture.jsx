import { useEffect, useMemo, useRef } from 'react'
import Section from './Section.jsx'
import NoDataNote from './NoDataNote.jsx'
import Tooltip from './Tooltip.jsx'
import { useTooltip } from '../hooks/useTooltip.js'
import { resetSvg } from '../utils/d3helpers.js'
import { renderSnapshotChart, CHART_WIDTH, CHART_HEIGHT } from '../utils/chartRenderers.jsx'
import { NATIONS } from './MapView.jsx'
import { EVENT_YEAR, METRICS } from '../utils/metrics.js'

// Static, selection-independent overview -- deliberately visible no
// matter what the person picks on the map below. The map and charts
// only ever show one or two nations at a time; without this, the
// region-wide picture (one cyclone, four very different outcomes) is
// easy to lose since the page never otherwise states it plainly on
// its own. Every number here is computed from the same loaded dataset
// the rest of the page uses -- nothing here is hardcoded, so it can't
// drift out of sync if the data pipeline is ever rerun.
//
// The snapshot grid below the stat tiles is the same idea taken
// further: one bar chart per metric, all four nations, all pinned to
// EVENT_YEAR with no time axis at all -- unlike the ripple-chain
// charts further down the page (which show change over years for
// whichever nation(s) are selected), this is deliberately a single
// frozen moment, always showing all four nations regardless of
// selection. Complements rather than duplicates the ripple chain: one
// answers "how did this nation change over time", the other answers
// "how did all four nations compare at the same moment".
//
// Props:
//   data -- same shape as everywhere else: { [metricKey]: rows[] }
//   style -- forwarded to the underlying Section, used by App.jsx to
//     stagger each section's entrance on first load
export default function BigPicture({ data, style }) {
  const stats = useMemo(() => computeStats(data), [data])
  const snapshots = useMemo(() => computeSnapshots(data), [data])
  const { containerRef, tooltip, showTooltip, hideTooltip } = useTooltip()

  return (
    <Section tone="panel" style={style}>
      <div ref={containerRef} className="relative">
        <h2 className="mb-2 text-xl font-semibold">The bigger picture</h2>
        <p className="max-w-2xl text-sm opacity-80">
          Cyclone Harold crossed Fiji, Solomon Islands, Tonga, and Vanuatu within the same week in
          April {EVENT_YEAR}. It was one hazard, but the four nations it passed through went into it
          with very different resources -- and came out the other side with very different
          outcomes. That gap, not the storm itself, is what the charts below are really about.
        </p>

        {stats ? (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile
              index={0}
              label="What happened"
              value="1 cyclone, 4 nations"
              detail={`April ${EVENT_YEAR}, within the same week`}
            />
            <StatTile
              index={1}
              label={`People affected, ${EVENT_YEAR}`}
              value={stats.totalAffected.toLocaleString()}
              detail="Across all four nations combined"
            />
            <StatTile
              index={2}
              label="Hardest- vs. least-hit"
              value={stats.ratio ? `${stats.ratio.toLocaleString()}×` : 'n/a'}
              detail={`${stats.maxNation} vs. ${stats.minNation} -- the same event`}
            />
            <StatTile
              index={3}
              label="Economic loss reported"
              value={`${stats.economicLossReported} of ${NATIONS.length} nations`}
              detail={`For ${EVENT_YEAR} itself, in the official dataset`}
            />
          </div>
        ) : (
          <p className="mt-6 text-sm opacity-70">Loading overview...</p>
        )}

        {snapshots && (
          <div className="mt-8">
            <h3 className="mb-1 text-sm font-semibold">Every nation, every metric, {EVENT_YEAR}</h3>
            <p className="mb-3 max-w-2xl text-sm opacity-80">
              Not change over time -- the same {EVENT_YEAR} snapshot, side by side, one bar per
              nation. The gap between the bars is the only thing each chart is showing.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {METRICS.map((m, i) => (
                <MetricSnapshot
                  key={m.key}
                  metric={m}
                  rows={snapshots[m.key]}
                  showTooltip={showTooltip}
                  hideTooltip={hideTooltip}
                  index={i}
                  spanFull={i === METRICS.length - 1 && METRICS.length % 2 !== 0}
                />
              ))}
            </div>
          </div>
        )}

        <Tooltip tooltip={tooltip} />
      </div>
    </Section>
  )
}

function StatTile({ index, label, value, detail }) {
  return (
    <div
      className="animate-pop-in rounded-xl border border-ink/10 bg-white/60 p-4"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-semibold leading-tight">{value}</p>
      <p className="mt-1 text-xs opacity-70">{detail}</p>
    </div>
  )
}

function MetricSnapshot({ metric, rows, showTooltip, hideTooltip, index, spanFull }) {
  const { label, format } = metric
  const ref = useRef(null)
  const nationsMissing = NATIONS.map((n) => n.name).filter((n) => !rows.some((d) => d.nation === n))

  useEffect(() => {
    if (!rows || rows.length === 0 || !ref.current) return
    const svg = resetSvg(ref, CHART_WIDTH, CHART_HEIGHT)
    renderSnapshotChart(svg, { rows, format, showTooltip, hideTooltip })
  }, [rows, format, showTooltip, hideTooltip])

  return (
    <div
      className={`animate-pop-in rounded-xl border border-ink/10 bg-white/60 p-3 ${spanFull ? 'sm:col-span-2' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <h4 className="mb-1 text-sm font-medium">{label}</h4>
      {rows.length > 0 ? (
        <svg
          ref={ref}
          role="img"
          aria-label={`${label}, ${EVENT_YEAR}, by nation`}
          className="h-auto w-full"
        />
      ) : (
        <NoDataNote
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          className="block py-6 text-center text-sm italic opacity-70"
        >
          Data not available for {EVENT_YEAR}.
        </NoDataNote>
      )}
      {rows.length > 0 && nationsMissing.length > 0 && (
        <NoDataNote
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          className="mt-1 inline-block text-xs italic opacity-70"
        >
          No {EVENT_YEAR} data available for {formatNationList(nationsMissing)}.
        </NoDataNote>
      )}
      {/* Screen-reader-only data table -- same pattern as RippleChain:
          the chart conveys the comparison visually, this gives the
          same numbers as text. */}
      <table className="sr-only">
        <caption>
          {label}, {EVENT_YEAR}, by nation
        </caption>
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.nation}>
              <td>{d.nation}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Unlike RippleChain/ComparisonView's NoDataNote usage (where at most 2
// nations are ever selected, so a plain join(' and ') never had to
// handle more than 2 items), this chart compares all four nations at
// once -- economic_loss, for instance, only has a real EVENT_YEAR
// figure for one of them, leaving three missing simultaneously. Proper
// list grammar (Oxford comma) rather than "A and B and C".
function formatNationList(names) {
  if (names.length <= 1) return names.join('')
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

function computeStats(data) {
  if (!data) return null
  const rows = data.affected_persons ?? []
  const eventRows = rows.filter((d) => d.year === EVENT_YEAR)
  if (eventRows.length === 0) return null

  const totalAffected = eventRows.reduce((sum, d) => sum + d.affected_persons, 0)
  const max = eventRows.reduce((a, b) => (b.affected_persons > a.affected_persons ? b : a))
  const min = eventRows.reduce((a, b) => (b.affected_persons < a.affected_persons ? b : a))
  // Rounded to the nearest hundred -- the precise ratio reads as false
  // precision on what's fundamentally a rough, order-of-magnitude gap.
  const rawRatio = min.affected_persons > 0 ? max.affected_persons / min.affected_persons : null
  const ratio = rawRatio ? Math.round(rawRatio / 100) * 100 : null

  const economicLossReported = (data.economic_loss ?? []).filter((d) => d.year === EVENT_YEAR).length

  return { totalAffected, maxNation: max.nation, minNation: min.nation, ratio, economicLossReported }
}

// One row per nation that actually has an EVENT_YEAR figure for this
// metric -- deliberately NOT falling back to "nearest available year"
// for nations missing EVENT_YEAR data. This chart's whole point is a
// same-moment comparison; silently mixing in a different year for one
// nation would undermine the exact thing it's trying to show, so a
// missing nation is shown as missing (see NoDataNote in
// MetricSnapshot) rather than papered over with a different year's
// number.
function computeSnapshots(data) {
  if (!data) return null
  const result = {}
  for (const m of METRICS) {
    result[m.key] = (data[m.key] ?? [])
      .filter((d) => d.year === EVENT_YEAR)
      .map((d) => ({ nation: d.nation, value: d[m.field] }))
      .sort(
        (a, b) =>
          NATIONS.findIndex((n) => n.name === a.nation) - NATIONS.findIndex((n) => n.name === b.nation)
      )
  }
  return result
}
