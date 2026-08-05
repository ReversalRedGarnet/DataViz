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
        March 2019 — one cyclone, four islands
      </p>
      <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold md:text-5xl">
        The storm chose a path. Everything else was already decided before it arrived.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg opacity-80">
        Cyclone Reva made landfall on Kalevu on 14 March 2019 as a Category 5 storm — sustained
        winds of 215 km/h, the strongest system on record there. It crossed Isaura two days later
        at Category 3, then passed 90km offshore of Ovanu without making landfall at all. Off
        Tempoa Islands, a passenger ferry evacuating ahead of the storm's outer bands capsized — 19
        people died, more than the other three islands combined, days before Reva reached its peak
        strength.
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-lg font-medium opacity-80">
        Ovanu was barely touched by the wind. Watch what happened to it anyway.
      </p>
    </Section>
  )
}
