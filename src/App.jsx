import { useState, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import RippleChain from './components/RippleChain.jsx'
import ComparisonView from './components/ComparisonView.jsx'
import CitationPanel from './components/CitationPanel.jsx'

// TODO: set once the hazard + two countries are locked
// (see README.md → "Scope (locked)")
const COUNTRY_A = null
const COUNTRY_B = null

export default function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // TODO: load the cleaned datasets via src/utils/loadData.js once
    // data-pipeline/clean_data.py has produced them, e.g.
    //   loadDataset('disaster_affected_persons.json').then(setData)
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
