import Lenis from 'lenis'
import { useEffect } from 'react'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Forward Lenis scroll to framer-motion so useScroll reads the correct position
    lenis.on('scroll', () => {
      // Dispatching a native scroll event keeps framer-motion's scroll tracker in sync
      window.dispatchEvent(new Event('scroll'))
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onLoad   = () => lenis.resize()
    const onResize = () => lenis.resize()
    const onStop   = () => lenis.stop()
    const onStart  = () => lenis.start()

    window.addEventListener('load',         onLoad)
    window.addEventListener('resize',       onResize)
    window.addEventListener('lenis:stop',   onStop)
    window.addEventListener('lenis:start',  onStart)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('load',         onLoad)
      window.removeEventListener('resize',       onResize)
      window.removeEventListener('lenis:stop',   onStop)
      window.removeEventListener('lenis:start',  onStart)
      lenis.destroy()
    }
  }, [])
}
