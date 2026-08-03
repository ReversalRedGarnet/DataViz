// Shared section wrapper: semantic <section>, consistent padding and a
// max-width reading column, with an optional background tone from the
// palette. Used by every section so spacing/width stays consistent
// instead of being repeated (and drifting) in each component.
const TONES = {
  plain: '',
  ocean: 'bg-ocean-light/60',
  sun: 'bg-sun-light/60',
}

export default function Section({ tone = 'plain', className = '', children, ...rest }) {
  return (
    <section className={`px-6 py-12 md:py-16 ${TONES[tone] ?? ''} ${className}`} {...rest}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  )
}
