import Section from './Section.jsx'

// Shared "nothing to show yet" message -- used by RippleChain and
// ComparisonView instead of each repeating their own Section + <p>.
// No longer takes a `tone` -- Section itself dropped background tints
// in favour of the PacificBorder divider between sections.
export default function EmptyState({ children }) {
  return (
    <Section>
      <p className="max-w-xl mx-auto py-6 text-center text-sm opacity-60">{children}</p>
    </Section>
  )
}
