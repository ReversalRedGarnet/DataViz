import Hero from './components/Hero.jsx'
import MapView from './components/MapView.jsx'
import RippleChain from './components/RippleChain.jsx'
import ComparisonView from './components/ComparisonView.jsx'
import CitationPanel from './components/CitationPanel.jsx'
import PacificBorder from './components/PacificBorder.jsx'
import { useSelection } from './hooks/useSelection.js'
import { useRippleData } from './hooks/useRippleData.js'

export default function App() {
  const data = useRippleData()
  const { selected, toggle, clear } = useSelection()

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
