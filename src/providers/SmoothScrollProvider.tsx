'use client'
import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

// Lenis only re-measures when the viewport or <html> resizes. Pages whose height
// changes in place (e.g. the multi-step booking form) would keep the old, shorter
// scroll limit and stop short of the bottom — so re-measure whenever <body> resizes.
function LenisAutoResize() {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    const ro = new ResizeObserver(() => lenis.resize())
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [lenis])
  return null
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        anchors: true, // smooth-scroll to #hash links (e.g. Explore Our Fleet → #fleet)
      }}
    >
      <LenisAutoResize />
      {children}
    </ReactLenis>
  )
}
