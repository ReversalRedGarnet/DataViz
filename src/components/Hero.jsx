import Section from './Section.jsx'

// Opening framing section: the thesis + core question, visible in the
// first few seconds. See README.md -> "Core Question" / "Guiding
// Principles". Used to lean on a 'sun' background tint to read as a
// distinct opening beat -- now does that with a PacificBorder divider
// below it instead (see App.jsx), and with centred text: as the very
// first thing on the page, with no chart or map alongside to balance
// it, a centred block reads as a deliberate title card rather than
// text left-hanging in an otherwise empty section.
export default function Hero() {
  return (
    <Section className="animate-fade-in text-center">
      <h1 className="mx-auto max-w-3xl text-3xl font-bold md:text-5xl">
        Climate doesn't create inequality. It reveals it.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg opacity-80">
        How do existing inequalities determine who suffers most from climate change?
      </p>
    </Section>
  )
}
