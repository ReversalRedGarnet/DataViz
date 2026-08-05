import { useEffect, useRef } from 'react'
import Section from './Section.jsx'
import Tooltip from './Tooltip.jsx'
import { useTooltip } from '../hooks/useTooltip.js'
import { resetSvg } from '../utils/d3helpers.js'
import { renderStormProfileChart, STORM_CHART_WIDTH, STORM_CHART_HEIGHT } from '../utils/chartRenderers.jsx'

// One cyclone, four categories at the moment it passed each nation --
// and an outcome that doesn't track them. Sits right after Hero, before
// BigPicture: this is the hazard itself, on its own terms, before the
// ripple chain gets into what it did to each economy.
//
// A hardcoded, single-event dataset rather than something pulled
// through the JSON pipeline -- these are storm-track facts (one
// reading per nation, not a time series), the same kind of thing
// MapView.jsx's NATIONS array already does for the blurb text. Sources
// (Australian Bureau of Meteorology's official cyclone history, UN
// OCHA/ReliefWeb situation reports) are supplementary, not from the
// official Pacific Data Hub list -- see README.md -> "Data Sources".
//
// Deliberately does NOT chart wind speed or rainfall: reported figures
// use different measurement conventions country to country (10-minute
// vs. 1-minute sustained winds, gusts vs. sustained, a couple of
// scattered station readings for rainfall) and aren't safely
// comparable on one axis. Category at closest approach is the one
// reading all four nations share a defensible, consistent figure for.
//
// `dodge` nudges Fiji/Tonga's rendered x position apart -- both were
// Category 4 at closest approach, so without it their points/labels
// would sit on top of each other. It's rendering-only: the category
// shown in the tooltip and the table below is the real, undodged
// value.
export const STORM_PROFILE = [
  {
    name: 'Solomon Islands',
    category: 1,
    categoryLabel: 'Tropical low / Category 1 at time of impact',
    deaths: 27,
    dodge: 0,
    fact: "The passenger ferry MV Taimareho was overwhelmed by Harold's swell in Ironbottom Sound, Malaita Province -- the deadliest single event of the whole cyclone, at its weakest documented phase.",
  },
  {
    name: 'Vanuatu',
    category: 5,
    categoryLabel: 'Category 5 (landfall, Espiritu Santo)',
    deaths: 2,
    dodge: 0,
    fact: '230 km/h sustained winds, gusts to 325 km/h -- the strongest storm to hit Vanuatu since Cyclone Pam in 2015. Up to 90% of homes lost in the worst-hit areas.',
  },
  {
    name: 'Fiji',
    category: 4,
    categoryLabel: 'Category 4 (landfall, Kadavu)',
    deaths: 1,
    dodge: -0.15,
    fact: '1,919 buildings damaged; 103mm of rain recorded at Sigatoka in a single day.',
  },
  {
    name: 'Tonga',
    category: 4,
    categoryLabel: 'Category 4 (passed offshore, no landfall)',
    deaths: 0,
    dodge: 0.15,
    fact: '428 homes damaged or destroyed by flooding and storm surge, without a direct hit.',
  },
]

// Props:
//   style -- forwarded to the underlying Section, used by App.jsx to
//     stagger each section's entrance on first load
export default function StormProfile({ style }) {
  const ref = useRef(null)
  const { containerRef, tooltip, showTooltip, hideTooltip } = useTooltip()

  useEffect(() => {
    if (!ref.current) return
    const svg = resetSvg(ref, STORM_CHART_WIDTH, STORM_CHART_HEIGHT)
    renderStormProfileChart(svg, { rows: STORM_PROFILE, showTooltip, hideTooltip })
  }, [showTooltip, hideTooltip])

  return (
    <Section style={style}>
      <div ref={containerRef} className="relative mx-auto max-w-3xl">
        <h2 className="mb-2 text-xl font-semibold">The storm itself</h2>
        <p className="max-w-2xl text-sm opacity-80">
          Harold didn't hit all four nations the same way. Category and wind speed varied along
          its path -- but they don't explain what happened next.
        </p>

        <svg
          ref={ref}
          role="img"
          aria-label="Scatter chart comparing cyclone category at closest approach against deaths, for each of the four nations"
          className="mt-4 h-auto w-full"
        />

        <p className="mt-3 max-w-2xl text-sm font-medium">
          The deadliest single event of the whole cyclone happened during its weakest documented
          phase, not its strongest: 27 lives lost when a ferry was overwhelmed off the Solomon
          Islands -- more than Vanuatu, Fiji, and Tonga combined.
        </p>

        {/* Screen-reader-only data table -- same pattern as RippleChain:
            the chart above conveys the shape, this gives the same
            numbers as text. */}
        <table className="sr-only">
          <caption>Cyclone Harold: category at closest approach and deaths, by nation</caption>
          <thead>
            <tr>
              <th scope="col">Country</th>
              <th scope="col">Category at closest approach</th>
              <th scope="col">Deaths</th>
              <th scope="col">Local detail</th>
            </tr>
          </thead>
          <tbody>
            {STORM_PROFILE.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.categoryLabel}</td>
                <td>{row.deaths}</td>
                <td>{row.fact}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Tooltip tooltip={tooltip} />
      </div>
    </Section>
  )
}
