// Site footer: data sources (required by the competition rules and
// likely checked by the judging panel's dataviz engineer), plus
// copyright and a plain-language data disclaimer. One <footer>, not
// two, so screen readers see a single "contentinfo" landmark rather
// than two competing ones.
//
// Props:
//   sources -- array of { label, url }
const YEAR = new Date().getFullYear()

export default function CitationPanel({ sources = [] }) {
  return (
    <footer className="px-6 py-12 md:py-16 border-t">
      <div className="max-w-5xl mx-auto text-sm space-y-8">
        <div>
          <h2 className="font-semibold mb-2">Data sources</h2>
          {sources.length === 0 ? (
            <p className="opacity-60">TODO: list official + supporting datasets here.</p>
          ) : (
            <ul className="space-y-1">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className="underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-2">About this data</h2>
          {/* TODO: remove this paragraph once real data replaces the
              placeholder numbers -- see README.md "Scope (locked)" and
              data-pipeline/clean_data.py. Leaving fabricated-looking
              numbers unlabeled on a public page would be misleading. */}
          <p className="opacity-70">
            This is a work-in-progress entry for the 2026 Pacific DataViz Challenge. Some figures
            shown are placeholder data used for development and do not represent real events.
            This site is illustrative and isn't intended to inform policy, funding, or financial
            decisions.
          </p>
        </div>

        <div className="opacity-60 text-xs">
          <p>
            © {YEAR} Aziel Douglas Orihao. Code licensed under MIT (see LICENSE in the repository).
            Underlying datasets belong to their original sources, listed above, under their own
            respective licenses.
          </p>
        </div>
      </div>
    </footer>
  )
}
