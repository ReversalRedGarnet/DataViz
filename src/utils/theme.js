// Real color values for places JS/D3 needs an actual string (Tailwind
// classes don't work inside D3's .attr('fill', ...) calls).
//
// These are deliberately DARKER than the decorative ocean/sun tokens in
// tailwind.config.js. A contrast check (WCAG 2.1) found the original
// soft pastel yellow measured ~1.5:1 as a chart line or badge fill
// against the page background -- badly under the 3:1 minimum for
// graphical objects, and white text on it came out under 2:1. These
// values keep the same ocean/gold hue family but darken enough to pass:
//   white text on ocean-data / gold-data: 5.8:1 / 5.4:1
//   line-on-page-background:              5.5:1 / 5.1:1
// The original lighter ocean/sun tokens are still fine for purely
// decorative use (section background tints) where nothing needs to
// contrast against them.
export const SELECTION_COLORS = ['#3D6B7D', '#8A6300'] // pick 1 (ocean-data), pick 2 (gold-data)
