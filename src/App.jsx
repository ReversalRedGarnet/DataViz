import Hero from './components/Hero.jsx'
import MapView from './components/MapView.jsx'
import RippleChain from './components/RippleChain.jsx'
import ComparisonView from './components/ComparisonView.jsx'
import CitationPanel from './components/CitationPanel.jsx'
import PacificBorder from './components/PacificBorder.jsx'
import { useSelection } from './hooks/useSelection.js'
import { useRippleData } from './hooks/useRippleData.js'

function selectionAnnouncement(selected) {
  if (selected.length === 0) return ''
  if (selected.length === 1) return `${selected[0]} selected. Showing its ripple chain below.`
  return `Comparing ${selected[0]} and ${selected[1]}.`
}

export default function App() {
  const data = useRippleData()
  const { selected, toggle, clear } = useSelection()

  return (
    <>
      {/* Visually hidden until focused -- lets keyboard users jump past
          the map straight to the charts without tabbing through every
          marker first. */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Announces selection changes to screen readers, since the charts
          and comparison view updating below wouldn't otherwise be
          noticed without visually looking at the page. */}
      <div aria-live="polite" className="sr-only">
        {selectionAnnouncement(selected)}
      </div>

      <main id="main-content" className="min-h-screen">
        <PacificBorder />
        <Hero />
        <MapView selected={selected} onToggle={toggle} onClear={clear} />
        <RippleChain data={data} selectedNations={selected} />
        <ComparisonView data={data} selectedNations={selected} />
        <PacificBorder />
        <CitationPanel sources={[]} />
      </main>
    </>
  )
}
