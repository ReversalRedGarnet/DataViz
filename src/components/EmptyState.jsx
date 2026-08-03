import Section from './Section.jsx'

// Shared "nothing to show yet" message -- used by RippleChain and
// ComparisonView instead of each repeating their own Section + <p>.
export default function EmptyState({ tone = 'plain', children }) {
  return (
    <Section tone={tone}>
      <p className="text-sm opacity-60">{children}</p>
    </Section>
  )
}
