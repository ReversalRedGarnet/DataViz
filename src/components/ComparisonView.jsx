import { METRICS } from '../utils/metrics.js'
import { SELECTION_COLORS } from '../utils/theme.js'
import Section from './Section.jsx'

// Side-by-side view of the currently selected nations across each stage
// of the ripple chain, comparing the event year against the latest year
// on record. Replaces the full vulnerability-dimension explorer from the
// original brainstorm -- see README.md -> "Scope (locked)".
//
// Props:
//   data -- { [metricKey]: Array<{ nation, year, [field]: number }> }
//   selectedNations -- ordered array of nation names selected in MapView
const EVENT_YEAR = 2023

export default function ComparisonView({ data, selectedNations }) {
  if (!data) {
    return (
      <Section tone="sun">
        <p className="text-sm opacity-60">Comparison -- waiting on data.</p>
      </Section>
    )
  }

  if (!selectedNations || selectedNations.length < 2) {
    return (
      <Section tone="sun">
        <p className="text-sm opacity-60">Select a second country on the map to compare.</p>
      </Section>
    )
  }

  return (
    <Section tone="sun">
      <h2 className="text-xl font-semibold mb-4">Compare recovery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {selectedNations.map((nation, i) => (
          <NationSummary key={nation} nation={nation} data={data} color={SELECTION_COLORS[i]} />
        ))}
      </div>
    </Section>
  )
}

function NationSummary({ nation, data, color }) {
  return (
    <div className="bg-white/70 rounded-lg p-4 border-l-4" style={{ borderColor: color }}>
      <h3 className="font-semibold text-lg mb-3">{nation}</h3>
      <ul className="space-y-2 text-sm">
        {METRICS.map((m) => {
          const rows = (data[m.key] ?? [])
            .filter((d) => d.nation === nation)
            .sort((a, b) => a.year - b.year)
          const eventRow = rows.find((r) => r.year === EVENT_YEAR)
          const latestRow = rows[rows.length - 1]
          if (!eventRow || !latestRow) return null

          return (
            <li key={m.key} className="flex justify-between gap-4">
              <span className="opacity-70">{m.label}</span>
              <span>
                {eventRow[m.field]} → {latestRow[m.field]}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
