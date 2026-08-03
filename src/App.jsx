import { useState, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import MapView from './components/MapView.jsx'
import RippleChain from './components/RippleChain.jsx'
import ComparisonView from './components/ComparisonView.jsx'
import CitationPanel from './components/CitationPanel.jsx'
import { loadDataset } from './utils/loadData.js'
import { METRICS } from './utils/metrics.js'

export default function App() {
  const [data, setData] = useState(null)
  // Up to two nation names, set by clicking markers in MapView.
  const [selected, setSelected] = useState([])

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

  function toggleSelection(name) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name)
      if (prev.length >= 2) return [prev[1], name] // drop the oldest, keep the newest pair
      return [...prev, name]
    })
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <MapView selected={selected} onToggle={toggleSelection} />
      <RippleChain data={data} selectedNations={selected} />
      <ComparisonView data={data} selectedNations={selected} />
      <CitationPanel sources={[]} />
    </main>
  )
}
