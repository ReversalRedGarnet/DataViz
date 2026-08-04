import Section from './Section.jsx'

// Opening framing section: the thesis + core question, visible in the
// first few seconds. See README.md -> "Core Question" / "Guiding Principles".
// Uses the 'sun' tone (rather than the default plain background) so the
// header reads as a clear, distinct opening beat instead of blending
// into the page.
export default function Hero() {
  return (
    <Section tone="sun">
      <h1 className="text-3xl md:text-5xl font-bold max-w-3xl">
        Climate doesn't create inequality. It reveals it.
      </h1>
      <p className="mt-4 max-w-2xl text-lg">
        How do existing inequalities determine who suffers most from climate change?
      </p>
    </Section>
  )
}
