'use client'

import { useRef, useEffect } from 'react'
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

  return (
    <section ref={ref} className="w-full bg-white px-4 py-10 lg:px-10">
      <motion.div
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease }}
      >
        {/* Video thumbnail */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/video-thumb.png"
            alt="Luxury chauffeur experience"
            className="h-auto w-full object-cover"
            style={{ maxHeight: 480 }}
            draggable={false}
          />

          {/* Play button */}
          <button
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{
              width: 80,
              height: 80,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.95)' }}
            >
              <svg width="18" height="20" viewBox="0 0 20 22" fill="none">
                <path d="M2 1.5L18 11L2 20.5V1.5Z" fill="#111" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </span>
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
