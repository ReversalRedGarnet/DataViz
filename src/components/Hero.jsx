import Section from './Section.jsx'

// Opening framing section: the thesis + core question, visible in the
// first few seconds. See README.md -> "Core Question" / "Guiding
// Principles". Centred rather than left-aligned: as the very first
// thing on the page, with no chart or map alongside to balance it, a
// centred block reads as a deliberate title card rather than text
// left-hanging in an otherwise empty section. Entrance animation is
// inherited from Section -- see .animate-pop-in in index.css.
//
// ============================== PLACEHOLDER ==============================
// Everything below is FICTIONAL example copy (Cyclone Reva / Kalevu /
// Isaura / Ovanu / Tempoa Islands are all invented -- no such storm or
// places), dropped in here ONLY so the four-block Hero structure
// (kicker / thesis / grounding paragraph / pivot line) can be previewed
// against the real site's layout, type scale, and surrounding sections.
// NOT for submission. Replace every block below with real Cyclone
// Harold copy before this ships -- see the "still open" note in
// README.md -> "Current Status".
// ==========================================================================
//
// Props:
//   style -- forwarded to the underlying Section, used by App.jsx to
//     stagger each section's entrance on first load
export default function Hero({ style }) {
  return (
    <Section className="text-center" style={style}>
      <p className="mx-auto max-w-2xl text-sm font-semibold uppercase tracking-wide opacity-70">
        April 2020 · One cyclone. Four nations. Four different outcomes.
      </p>
      <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold md:text-5xl">
        Cyclone Harold followed one path across the Pacific. Recovery did not.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg opacity-80">
        When Tropical Cyclone Harold swept across the South Pacific in April 2020, it affected Solomon Islands, Vanuatu, Fiji, and Tonga within a matter of days. Although these nations experienced the same storm, the consequences varied significantly.
Differences in population, geography, infrastructure, economic resilience, and emergency preparedness shaped how communities responded and recovered. Some countries faced widespread infrastructure damage, while others experienced greater economic disruption or longer recovery periods.
This data story explores how a single natural hazard produced very different outcomes, using interactive visualizations to compare impact, recovery, and resilience across the region.
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-lg font-medium opacity-80">
        Scroll to follow the storm's journey.
      </p>
    </Section>
  )
}
