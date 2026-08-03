import { useState, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import MapView from './components/MapView.jsx'
import RippleChain from './components/RippleChain.jsx'
import ComparisonView from './components/ComparisonView.jsx'
import CitationPanel from './components/CitationPanel.jsx'
import PacificBorder from './components/PacificBorder.jsx'
import { loadDataset } from './utils/loadData.js'
import { METRICS } from './utils/metrics.js'
import { useSelection } from './hooks/useSelection.js'

export default function App() {
  const [data, setData] = useState(null)
  const { selected, toggle, clear } = useSelection()

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
      <PacificBorder />
      <Hero />
      <MapView selected={selected} onToggle={toggle} onClear={clear} />
      <RippleChain data={data} selectedNations={selected} />
      <ComparisonView data={data} selectedNations={selected} />
      <PacificBorder />
      <CitationPanel sources={[]} />
    </main>
  )
}
