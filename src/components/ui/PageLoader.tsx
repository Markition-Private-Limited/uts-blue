'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useAnimation, useReducedMotion } from 'framer-motion'

const MINIMUM_VISIBLE_MS = 600   // brief flash-prevention only
const FALLBACK_VISIBLE_MS = 45000 // true last-resort safety net (45 s)

const PRELOAD_SRCS = [
  '/logo.png',
  '/loader-car.png',
  '/hero-bg.png',
  '/hero-bg-new.png',
  '/hero-bottom-union.png',
  '/car-hero.png',
  '/chauffeur-bg.webp',
  '/chauffeur-car.png',
  '/video-thumb.png',
  '/mask-group.png',
  '/how-it-works-bg.png',
  '/footer-chevron.png',
  '/about/driver-smile.jpg',
  '/about/driver-luggage.jpg',
  '/about/passenger.jpg',
  '/about/car-door.jpg',
  '/about/driver-suit.jpg',
  '/fleet/business-class-mercedes-e-class.webp',
  '/fleet/economy-saloon-vw-passat.webp',
  '/fleet/first-class-mercedes-s-class.webp',
  '/fleet/first-class-van-mercedes-v-class.webp',
  '/fleet/mpv-vw-sharan.webp',
  '/fleet/standard-van-hyundai-i800.webp',
  '/fleet/van-8-9-seater.webp',
  '/fleet/icons/child-seat-available.png',
  '/fleet/icons/gps-tracking.png',
  '/fleet/icons/water-available.png',
  '/fleet/icons/wifi-available.png',
  '/services/airport-transfer.jpg',
  '/why/car-top.png',
  '/why/chauffeur-v2.png',
  '/why/coastal-car-v2.png',
  '/why/door-v2.png',
  '/why/interior-v2.png',
  '/testimonials/person-1.jpg',
  '/testimonials/person-2.jpg',
  '/testimonials/person-3.jpg',
  '/testimonials/person-4.jpg',
]

// Both videos must have first-frame data before the loader lifts.
const HERO_VIDEO  = '/HERO%20VIDEO/Untitled%20design%20(1)_4K_upscaled.webm'
const STATS_VIDEO = '/Video/Video.webm'

const STREAKS = [
  { top: '12%', width: 110, duration: '2.70s', delay: '-1.25s' },
  { top: '22%', width:  68, duration: '2.20s', delay: '-.40s'  },
  { top: '32%', width: 148, duration: '3.10s', delay: '-2.15s' },
  { top: '42%', width:  88, duration: '2.45s', delay: '-1.50s' },
  { top: '52%', width: 178, duration: '3.30s', delay: '-2.80s' },
  { top: '62%', width:  72, duration: '2.35s', delay: '-.85s'  },
  { top: '72%', width: 130, duration: '2.95s', delay: '-1.95s' },
  { top: '80%', width:  55, duration: '2.10s', delay: '-.60s'  },
  { top: '88%', width: 158, duration: '3.20s', delay: '-2.45s' },
  { top: '94%', width:  95, duration: '2.55s', delay: '-1.20s' },
]

const FAINT_STREAKS = [
  { top: '18%', delay: '-.85s'  },
  { top: '44%', delay: '-1.40s' },
  { top: '66%', delay: '-.30s'  },
  { top: '84%', delay: '-1.70s' },
]


export default function PageLoader() {
  const [visible,      setVisible]      = useState(true)
  const [progress,     setProgress]     = useState(0)
  const [assetsReady,  setAssetsReady]  = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const carControls = useAnimation()

  // Slow infinite loop on mount
  useEffect(() => {
    if (prefersReducedMotion) {
      carControls.set({ x: 'calc(50vw - 50%)' })
      return
    }
    carControls.start({
      x: ['-28vw', '110vw'],
      transition: { duration: 4.2, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatType: 'loop' },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion])

  // When assets are ready: speed up the car, then hide on exit
  useEffect(() => {
    if (!assetsReady) return
    setProgress(100)
    if (prefersReducedMotion) { setVisible(false); return }
    carControls
      .start({ x: '110vw', transition: { duration: 1.4, ease: [0.4, 0, 0.8, 1] } })
      .then(() => setVisible(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsReady])

  useEffect(() => {
    const startedAt = performance.now()
    void startedAt // used only to satisfy linter; hide timing is now car-driven

    // Grand total: every image + 2 videos. Progress is purely event-driven.
    const GRAND_TOTAL = PRELOAD_SRCS.length + 2
    let loaded = 0
    let domReady = false
    let allLoaded = false

    const onAsset = () => {
      loaded++
      // Cap display at 99 until assets are truly done
      setProgress(Math.min(99, Math.round((loaded / GRAND_TOTAL) * 100)))
      if (loaded >= GRAND_TOTAL) { allLoaded = true; tryFinish() }
    }

    const tryFinish = () => {
      if (!allLoaded || !domReady) return
      // Signal React — the assetsReady effect will speed up the car and hide on exit
      setAssetsReady(true)
    }

    // Images
    PRELOAD_SRCS.forEach(src => {
      const img = new window.Image()
      img.onload = img.onerror = onAsset
      img.src = src
    })

    // Hero video (off-DOM, muted — just buffering first frames)
    const heroVid = document.createElement('video')
    heroVid.muted = true
    heroVid.preload = 'auto'
    const onHero = () => onAsset()
    heroVid.addEventListener('loadeddata', onHero, { once: true })
    heroVid.addEventListener('error',      onHero, { once: true })
    heroVid.src = HERO_VIDEO

    // Stats video (off-DOM, muted — counts as one asset; cleanup destroys it
    // before any on-DOM element renders, so no duplicate audio)
    const statsVid = document.createElement('video')
    statsVid.muted = true
    statsVid.preload = 'auto'
    const onStats = () => onAsset()
    statsVid.addEventListener('loadeddata', onStats, { once: true })
    statsVid.addEventListener('error',      onStats, { once: true })
    statsVid.src = STATS_VIDEO

    // DOM-ready gate
    if (document.readyState === 'complete') {
      domReady = true; tryFinish()
    } else {
      window.addEventListener('load', () => { domReady = true; tryFinish() }, { once: true })
    }

    // True last-resort fallback — only fires if network is genuinely broken
    const fallback = setTimeout(() => setVisible(false), FALLBACK_VISIBLE_MS)

    return () => {
      clearTimeout(fallback)
      const destroyVid = (v: HTMLVideoElement, onFn: () => void) => {
        v.removeEventListener('loadeddata', onFn)
        v.removeEventListener('error',      onFn)
        v.pause(); v.src = ''; v.load()
      }
      destroyVid(heroVid,  onHero)
      destroyVid(statsVid, onStats)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="uts-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, ease: 'easeOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden',
            background: 'linear-gradient(180deg,#c2c4cb 0%,#cacdD4 42%,#d0d3d9 67%,#d6d8de 100%)',
          }}
          role="status"
          aria-label="Loading United Travel Services"
          aria-live="polite"
          aria-busy="true"
        >
          <style>{`
            @keyframes utsStreak {
              0%   { transform:translateX(0);                    opacity:0   }
              9%   {                                             opacity:.40 }
              74%  {                                             opacity:.26 }
              100% { transform:translateX(calc(100vw + 450px)); opacity:0   }
            }
            @keyframes utsFaint {
              from { transform:translateX(0); opacity:0 }
              12%  { opacity:.28 }
              80%  { opacity:.18 }
              to   { transform:translateX(calc(100vw + 350px)); opacity:0 }
            }
            @keyframes utsContact {
              0%,100% { opacity:.10 }
              10%,82% { opacity:.38 }
            }
            @keyframes utsDash {
              from { transform:translateX(0)      }
              to   { transform:translateX(-120px) }
            }
          `}</style>

          {/* Subtle environment light */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: [
              'linear-gradient(180deg,rgba(0,0,0,.010),transparent 38%)',
              'radial-gradient(ellipse at 50% 46%,rgba(0,0,0,.015),transparent 52%)',
            ].join(','),
          }} />

          {/* Horizon line */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: 0, right: 0, top: '50%', height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.048) 18%,rgba(0,0,0,.082) 50%,rgba(0,0,0,.048) 82%,transparent)',
            opacity: .7,
          }} />

          {/* Road band */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: 0, right: 0, top: '44%', height: '56%',
            overflow: 'hidden',
            background: 'linear-gradient(180deg,rgba(0,0,0,.012) 0%,rgba(0,0,0,.005) 18%,rgba(255,255,255,.12) 100%)',
          }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.065) 20%,rgba(0,0,0,.11) 50%,rgba(0,0,0,.065) 80%,transparent)',
            }} />
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '28%', height: 1,
              overflow: 'hidden', opacity: .18,
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: 1, width: '200%',
                background: 'repeating-linear-gradient(90deg,rgba(0,0,0,.55) 0px,rgba(0,0,0,.55) 60px,transparent 60px,transparent 120px)',
                animation: prefersReducedMotion ? 'none' : 'utsDash 1.2s linear infinite',
              }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {STREAKS.map((s, i) => (
                <span key={i} aria-hidden="true" style={{
                  position: 'absolute', left: -220, top: s.top,
                  height: 1, width: s.width, borderRadius: 999,
                  background: 'linear-gradient(90deg,transparent 0%,rgba(0,0,0,.07) 8%,rgba(0,0,0,.28) 52%,rgba(0,0,0,.07) 88%,transparent 100%)',
                  animation: prefersReducedMotion ? 'none' : `utsStreak ${s.duration} linear ${s.delay} infinite`,
                } as React.CSSProperties} />
              ))}
              {FAINT_STREAKS.map((s, i) => (
                <span key={i} aria-hidden="true" style={{
                  position: 'absolute', left: -180, top: s.top,
                  height: 1, width: 48,
                  background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.12),transparent)',
                  animation: prefersReducedMotion ? 'none' : `utsFaint 2s linear ${s.delay} infinite`,
                } as React.CSSProperties} />
              ))}
            </div>
          </div>

          {/* Car — driven by carControls; slow infinite loop until assets ready, then fast exit */}
          <motion.div
            aria-hidden="true"
            initial={{ x: '-28vw' }}
            animate={carControls}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: 'clamp(180px, 22vw, 296px)',
              y: '-50%',
              zIndex: 10,
            }}
          >
            {/* Road line — trails behind the car; its end is tucked under the body so nothing shows past the nose */}
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: '50%',
              right: '14%',
              width: '200vw',
              height: 2,
              zIndex: -1,
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.85)',
              boxShadow: '-10px 0 10px rgba(0,0,0,0.25)',
              pointerEvents: 'none',
            }} />
            <Image
              src="/loader-car.png"
              alt=""
              width={1691}
              height={930}
              priority
              sizes="(max-width:640px) 180px, 22vw"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </motion.div>

          {/* ── Logo — top half ─────────────────────────────────────────────── */}
          <div style={{
            position: 'absolute',
            left: '50%', top: '14%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: 'min(360px, 80vw)',
            zIndex: 20,
          }}>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}
            >
              <Image
                src="/logo.png"
                alt="United Travel Services"
                width={440}
                height={160}
                priority
                style={{
                  width: 'clamp(150px, 18vw, 220px)',
                  height: 'auto',
                  display: 'block',
                  filter: 'brightness(0)',
                  opacity: 0.88,
                }}
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                margin: 0,
                color: 'rgba(0,0,0,.30)',
                fontFamily: 'Inter,sans-serif',
                fontSize: '7.5px',
                fontWeight: 400,
                letterSpacing: '.48em',
                textTransform: 'uppercase',
                paddingInlineStart: '.48em',
                whiteSpace: 'nowrap',
              }}
            >
              The Art of a Better Journey
            </motion.p>
          </div>

          {/* ── Linear progress bar — bottom ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            style={{
              position: 'absolute',
              left: '50%', bottom: '7%',
              transform: 'translateX(-50%)',
              width: 'min(280px, 62vw)',
              zIndex: 20,
            }}
            aria-hidden="true"
          >
            <div style={{
              width: '100%',
              height: 2,
              borderRadius: 1,
              background: 'rgba(22,72,216,0.14)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: 1,
                background: 'linear-gradient(90deg,#1648D8,#3b7bff)',
                boxShadow: '0 0 8px rgba(22,72,216,0.45)',
                transition: 'width 0.2s ease',
              }} />
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
