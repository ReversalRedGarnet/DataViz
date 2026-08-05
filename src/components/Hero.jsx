import Section from './Section.jsx'

// Opening framing section: the thesis + core question, visible in the
// first few seconds. See README.md -> "Core Question" / "Guiding
// Principles". Centred rather than left-aligned: as the very first
// thing on the page, with no chart or map alongside to balance it, a
// centred block reads as a deliberate title card rather than text
// left-hanging in an otherwise empty section. Entrance animation is
// inherited from Section -- see .animate-pop-in in index.css.
//
// Props:
//   style -- forwarded to the underlying Section, used by App.jsx to
//     stagger each section's entrance on first load
export default function Hero({ style }) {
  return (
    <Section className="text-center" style={style}>
      <h1 className="mx-auto max-w-3xl text-3xl font-bold md:text-5xl">
        Climate doesn't create inequality. It reveals it.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg opacity-80">
        How do existing inequalities determine who suffers most from climate change?
      </p>
    </Section>
  )
}
