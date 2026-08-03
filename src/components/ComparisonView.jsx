// Side-by-side (or toggle) view of the two locked countries moving through
// the same ripple chain. This replaces the full vulnerability-dimension
// explorer from the original brainstorm — see README.md → "Scope (locked)".
//
// Props:
//   countryA, countryB — country identifiers, set in App.jsx once chosen
//   data — cleaned JSON produced by data-pipeline/clean_data.py
export default function ComparisonView({ countryA, countryB, data }) {
  return (
    <section className="px-6 py-12 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="font-semibold">{countryA ?? 'Country A (TBD)'}</h2>
        {/* TODO */}
      </div>
      <div>
        <h2 className="font-semibold">{countryB ?? 'Country B (TBD)'}</h2>
        {/* TODO */}
      </div>
    </section>
  )
}
