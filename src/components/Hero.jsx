// Opening framing section: the thesis + core question, visible in the
// first few seconds. See README.md → "Core Question" / "Guiding Principles".
export default function Hero() {
  return (
    <section className="px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-bold max-w-3xl">
        Climate doesn't create inequality. It reveals it.
      </h1>
      <p className="mt-4 max-w-2xl text-lg">
        {/* TODO: replace with final framing copy */}
        How do existing inequalities determine who suffers most from climate change?
      </p>
    </section>
  )
}
