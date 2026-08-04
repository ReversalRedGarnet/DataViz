import { useMemo } from 'react'
import Section from './Section.jsx'
import { NATIONS } from './MapView.jsx'
import { EVENT_YEAR } from '../utils/metrics.js'

// Static, selection-independent overview -- deliberately visible no
// matter what the person picks on the map below. The map and charts
// only ever show one or two nations at a time; without this, the
// region-wide picture (one cyclone, four very different outcomes) is
// easy to lose since the page never otherwise states it plainly on
// its own. Every number here is computed from the same loaded dataset
// the rest of the page uses -- nothing here is hardcoded, so it can't
// drift out of sync if the data pipeline is ever rerun.
//
// Props:
//   data -- same shape as everywhere else: { [metricKey]: rows[] }
//   style -- forwarded to the underlying Section, used by App.jsx to
//     stagger each section's entrance on first load
export default function BigPicture({ data, style }) {
  const stats = useMemo(() => computeStats(data), [data])

  return (
    <Section tone="panel" style={style}>
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
        <p className="mt-6 text-sm opacity-60">Loading overview...</p>
      )}
    </Section>
  )
}

function StatTile({ index, label, value, detail }) {
  return (
    <div
      className="animate-pop-in rounded-xl border border-ink/10 bg-white/60 p-4"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-1 text-2xl font-semibold leading-tight">{value}</p>
      <p className="mt-1 text-xs opacity-70">{detail}</p>
    </div>
  )
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
