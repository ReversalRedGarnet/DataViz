import { useState, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import RippleChain from './components/RippleChain.jsx'
import ComparisonView from './components/ComparisonView.jsx'
import CitationPanel from './components/CitationPanel.jsx'
import { loadDataset } from './utils/loadData.js'
import { METRICS } from './utils/metrics.js'

// DUMMY PLACEHOLDER -- replace once the hazard + two countries are locked
// (see README.md -> "Scope (locked)")
const COUNTRY_A = 'Nation A'
const COUNTRY_B = 'Nation B'

export default function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all(METRICS.map((m) => loadDataset(m.file)))
      .then((results) => {
        const combined = {}
        METRICS.forEach((m, i) => {
          combined[m.key] = results[i]
        })
        setData(combined)
      })
      .catch((err) => console.error('Failed to load datasets:', err))
  }, [])

  return (
    <main className="min-h-screen">
      <Hero />
      <RippleChain data={data} />
      <ComparisonView countryA={COUNTRY_A} countryB={COUNTRY_B} data={data} />
      <CitationPanel sources={[]} />
    </main>
  )
}
