import Hero from './components/Hero.jsx'
import MapView from './components/MapView.jsx'
import RippleChain from './components/RippleChain.jsx'
import ComparisonView from './components/ComparisonView.jsx'
import CitationPanel from './components/CitationPanel.jsx'
import PacificBorder from './components/PacificBorder.jsx'
import { useSelection } from './hooks/useSelection.js'
import { useRippleData } from './hooks/useRippleData.js'

const DATA_SOURCES = [
  {
    label: 'Number of directly affected persons attributed to disasters — Pacific Data Hub (SPC)',
    url: 'https://stats.pacificdata.org/vis?lc=en&df[ds]=ds%3ASPC2&df[id]=DF_SDG_11&df[ag]=SPC&df[vs]=3.0&dq=A.VC_DSR_AFFCT.........&pd=,&to[TIME_PERIOD]=false&lb=bt',
  },
  {
    label: 'Direct disaster economic loss — Pacific Data Hub (SPC)',
    url: 'https://stats.pacificdata.org/vis?lc=en&df[ds]=ds%3ASPC2&df[id]=DF_SDG_11&df[ag]=SPC&df[vs]=3.0&dq=A.VC_DSR_AALT...._T.....&pd=,&to[TIME_PERIOD]=false',
  },
  {
    label: 'Crop yield — Pacific Data Hub (SPC)',
    url: 'https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.CROP_YIELD.&pd=,&to[TIME_PERIOD]=false',
  },
  {
    label: 'Tourist arrivals — Pacific Data Hub (SPC)',
    url: 'https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.TRSM_ARR.&pd=,&to[TIME_PERIOD]=false',
  },
  {
    label: 'Power generation — Pacific Data Hub (SPC)',
    url: 'https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_CLIMATE_CHANGE&df[ag]=SPC&df[vs]=1.0&av=true&dq=A.POWER_GEN.&pd=,&to[TIME_PERIOD]=false',
  },
]

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
        <CitationPanel sources={DATA_SOURCES} />
      </main>
    </>
  )
}
