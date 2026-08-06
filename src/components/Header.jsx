import { useLayoutEffect, useRef } from 'react'
import ScrollProgress from './ScrollProgress.jsx'

// Persistent site header: title, one-line thesis, and the scroll
// progress bar directly underneath it. Fixed for the entire time
// someone's on the site, not just after scrolling past Hero -- the
// progress bar's whole job is tracking progress from the very top, so
// it has to be visible from the very top too.
//
// A plain <header> here (not nested inside <main>) gets the implicit
// "banner" landmark automatically, which is the correct role for
// persistent site-level chrome -- no explicit role attribute needed.
// The title is deliberately NOT a heading element: Hero.jsx already
// has the page's one real <h1> (the thesis headline), and a second
// h1 here would give the page two, which breaks the single-h1
// document outline screen reader users rely on.
//
// Props:
//   onHeightChange -- (px: number) => void, called with this header's
//     actual rendered height whenever it changes, so App.jsx can give
//     <main> matching padding-top -- otherwise Hero would render
//     partly hidden underneath this fixed header on load. Measured
//     rather than hardcoded so it can't drift out of sync with a
//     future copy or font-size change.
export default function Header({ onHeightChange }) {
  const headerRef = useRef(null)

  // useLayoutEffect, not useEffect: this measurement drives another
  // element's layout (main's padding-top), so it needs to run before
  // the browser paints -- otherwise Hero would flash unpadded under
  // the header for one frame on every load.
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const report = () => onHeightChange(el.offsetHeight)
    report()
    const observer = new ResizeObserver(report)
    observer.observe(el)
    return () => observer.disconnect()
  }, [onHeightChange])

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-sand/90 shadow-sm backdrop-blur-sm"
    >
      <div className="mx-auto max-w-5xl px-6 py-2.5 md:py-3">
        <p className="text-lg font-semibold leading-tight text-ink md:text-xl">Ripple</p>
        <p className="text-xs leading-snug text-ink/70 md:text-sm">
          Climate doesn't create inequality. It reveals it.
        </p>
      </div>
      <ScrollProgress />
    </header>
  )
}
