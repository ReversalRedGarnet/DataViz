import { METRICS } from '../utils/metrics.js'
import { SELECTION_COLORS } from '../utils/theme.js'
import { useTooltip } from '../hooks/useTooltip.js'
import Section from './Section.jsx'
import EmptyState from './EmptyState.jsx'
import NoDataNote from './NoDataNote.jsx'
import Tooltip from './Tooltip.jsx'

// Side-by-side view of the currently selected nations across each stage
// of the ripple chain, comparing the event year against the latest year
// on record. Replaces the full vulnerability-dimension explorer from the
// original brainstorm -- see README.md -> "Scope (locked)".
//
// Props:
//   data -- { [metricKey]: Array<{ nation, year, [field]: number }> }
//   selectedNations -- ordered array of nation names selected in MapView
const EVENT_YEAR = 2020 // Cyclone Harold, April 2020

export default function ComparisonView({ data, selectedNations }) {
  const { containerRef, tooltip, showTooltip, hideTooltip } = useTooltip()

  if (!data) return <EmptyState>Comparison -- waiting on data.</EmptyState>
  if (!selectedNations || selectedNations.length < 2) {
    return <EmptyState>Select a second country on the map to compare.</EmptyState>
  }

  return (
    <Section className="animate-fade-in">
      <div ref={containerRef} className="relative">
        <h2 className="mb-6 text-xl font-semibold">Compare recovery</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {selectedNations.map((nation, i) => (
            <NationSummary
              key={nation}
              nation={nation}
              data={data}
              color={SELECTION_COLORS[i]}
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

function NationSummary({ nation, data, color, showTooltip, hideTooltip }) {
  return (
    <div className="rounded-2xl border-l-4 bg-white/70 p-6" style={{ borderColor: color }}>
      <h3 className="mb-4 text-lg font-semibold">{nation}</h3>
      <ul className="space-y-3 text-sm">
        {METRICS.map((m) => {
          const rows = (data[m.key] ?? [])
            .filter((d) => d.nation === nation)
            .sort((a, b) => a.year - b.year)
          const eventRow = rows.find((r) => r.year === EVENT_YEAR)
          const latestRow = rows[rows.length - 1]

          return (
            <li key={m.key} className="flex justify-between gap-4">
              <span className="opacity-70">{m.label}</span>
              {eventRow && latestRow ? (
                <span>
                  {m.format(eventRow[m.field])} → {m.format(latestRow[m.field])}
                </span>
              ) : (
                <NoDataNote
                  showTooltip={showTooltip}
                  hideTooltip={hideTooltip}
                  className="text-xs italic opacity-50"
                >
                  No data available
                </NoDataNote>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
