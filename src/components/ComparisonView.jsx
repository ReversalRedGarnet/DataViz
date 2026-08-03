import { METRICS } from '../utils/metrics.js'

// Side-by-side view of the two nations across each stage of the ripple
// chain, comparing the event year against the latest year on record.
// Replaces the full vulnerability-dimension explorer from the original
// brainstorm -- see README.md -> "Scope (locked)".
//
// Props:
//   countryA, countryB -- nation identifiers (currently DUMMY placeholders
//     set in App.jsx -- replace once the real pair is locked)
//   data -- { [metricKey]: Array<{ nation, year, [field]: number }> }
const EVENT_YEAR = 2023

export default function ComparisonView({ countryA, countryB, data }) {
  if (!data) {
    return (
      <section className="px-6 py-12">
        <p className="text-sm opacity-60">Comparison -- waiting on data.</p>
      </section>
    )
  }

  return (
    <section className="px-6 py-12 grid md:grid-cols-2 gap-8">
      <NationSummary nation={countryA} data={data} />
      <NationSummary nation={countryB} data={data} />
    </section>
  )
}

function NationSummary({ nation, data }) {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-3">{nation}</h2>
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
