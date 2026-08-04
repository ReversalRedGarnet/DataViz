// Shared section wrapper: semantic <section>, consistent padding and a
// max-width reading column. Sections used to be tinted with a
// different pastel background colour each (ocean/sun) so they read as
// distinct -- that's been dropped in favour of a PacificBorder wave
// divider between sections (see App.jsx), so colour stays reserved for
// its one functional job (selection colour-coding) instead of also
// carrying a decorative one.
export default function Section({ className = '', children, ...rest }) {
  return (
    <section className={`px-6 py-12 md:py-16 ${className}`} {...rest}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  )
}
