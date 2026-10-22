'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const STATS: { num: number | null; suffix: string; label: string }[] = [
  { num: 50,   suffix: 'K+', label: 'Journeys Completed' },
  { num: 500,  suffix: '+',  label: 'Premium Vehicles' },
  { num: 99,   suffix: '%',  label: 'Client Satisfaction' },
  { num: null, suffix: '24/7', label: 'Dedicated Support' },
]

function AnimatedStat({ num, suffix, label }: { num: number | null; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (!inView || num === null) return
    const controls = animate(count, num, { duration: 2, ease: 'easeOut' })
    return controls.stop
  }, [inView, count, num])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      {num !== null ? (
        <span className="text-4xl font-bold text-gray-900">
          <motion.span>{rounded}</motion.span>
          {suffix}
        </span>
      ) : (
        <span className="text-4xl font-bold text-gray-900">{suffix}</span>
      )}
      <span className="text-[13px] text-gray-400">{label}</span>
    </div>
  )
}

export function VideoStatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  // Set when the viewer mutes by hand, so scrolling doesn't override them.
  const userMutedRef = useRef(false)

  // Muted at rest; unmutes while the video is in the viewport, re-mutes when it leaves.
  // Browsers only allow sound after a user gesture, so we also re-check on the first
  // click / key / touch anywhere on the page (covers a video that is already in view).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let inView = false
    const apply = () => setMuted(inView ? userMutedRef.current : true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.5
        apply()
      },
      { threshold: 0.5 }
    )
    observer.observe(v)
    const gestures = ['pointerup', 'click', 'keydown', 'touchend'] as const
    gestures.forEach((g) => window.addEventListener(g, apply, { passive: true }))
    return () => {
      observer.disconnect()
      gestures.forEach((g) => window.removeEventListener(g, apply))
    }
  }, [])

  // Keep the element in sync with state (React only sets `muted` on mount).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = muted
    v.volume = muted ? 0 : 1
    if (v.paused) {
      v.play().catch(() => {
        // Browser blocked sound without a user gesture: fall back to muted playback.
        v.muted = true
        setMuted(true)
        v.play().catch(() => {})
      })
    }
  }, [muted])

  function toggleMute() {
    const next = !muted
    userMutedRef.current = next
    setMuted(next)
  }

  return (
    <section ref={ref} className="w-full bg-white px-4 pt-16 pb-6 sm:pt-20 sm:pb-8 lg:px-10">
      <motion.div
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease }}
      >
        {/* Video thumbnail */}
        <div className="relative overflow-hidden rounded-3xl">
          <video
            ref={videoRef}
            src="/Video/Video.mp4"
            poster="/video-thumb.png"
            autoPlay
            muted={muted}
            loop
            playsInline
            className="h-full w-full select-none object-cover"
            style={{ aspectRatio: '16 / 6.5', maxHeight: 480, objectPosition: 'center center', filter: 'saturate(1.25)' }}
          />

          {/* Top-to-bottom gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.38) 100%)' }}
          />

          {/* Mute / unmute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-100"
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              {muted ? (
                <>
                  <line x1="22" y1="9" x2="16" y2="15" />
                  <line x1="16" y1="9" x2="22" y2="15" />
                </>
              ) : (
                <>
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M19 5a10 10 0 0 1 0 14" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Stats row */}
        <motion.div
          className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.18, ease }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              {i > 0 && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-14 w-px hidden sm:block"
                  style={{ background: 'rgba(0,0,0,0.35)' }}
                />
              )}
              <AnimatedStat num={stat.num} suffix={stat.suffix} label={stat.label} />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
