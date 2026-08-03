// The single connected sequence view:
//   event → affected persons → economic loss → yield/tourism decline
//
// Chart implementation: D3 only — no Plotly / Observable Plot, per the
// locked stack in README.md.
//
// Props:
//   data — cleaned JSON produced by data-pipeline/clean_data.py
export default function RippleChain({ data }) {
  if (!data) {
    return (
      <section className="px-6 py-12">
        <p className="text-sm opacity-60">Ripple chain — waiting on data.</p>
      </section>
    )
  }

  // TODO: mount a D3 chart here, typically via useRef + useEffect
  // selecting the ref and driving it with d3.select(...).

  return <section className="px-6 py-12">{/* TODO */}</section>
}
