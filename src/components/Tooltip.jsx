// Floating tooltip box, positioned by useTooltip.js. Styled with the
// site's ink border and sand fill rather than an accent colour, so it
// reads as part of the same visual language as the rest of the page
// instead of introducing another one-off colour.
//
// Props:
//   tooltip -- { x, y, content } | null, from useTooltip()
export default function Tooltip({ tooltip }) {
  if (!tooltip) return null

  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-30 max-w-[220px] -translate-x-1/2 -translate-y-full rounded-lg border border-ink/15 bg-sand px-3 py-2 text-xs leading-snug text-ink shadow-lg transition-[opacity,transform] duration-150 ease-out"
      style={{ left: tooltip.x, top: tooltip.y - 10 }}
    >
      {tooltip.content}
    </div>
  )
}
