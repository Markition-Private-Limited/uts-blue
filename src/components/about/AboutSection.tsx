'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HeroBadge } from '@/components/hero/HeroBadge'
import { AboutCarousel } from './AboutCarousel'

const ease = [0.22, 1, 0.36, 1] as const

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative z-30 -mt-10 w-full overflow-hidden rounded-t-[56px] bg-transparent pt-14 pb-0">
      {/* Text content */}
      <motion.div
        ref={ref}
        className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
      >
        <HeroBadge text="Executive Chauffeur Services" variant="blue" />

        <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          More Than a Ride.
          <br />
          A Better{' '}
          <span style={{ color: '#1648D8' }}>Way to Travel</span>
        </h2>

        <p className="text-[15px] leading-relaxed text-gray-500 max-w-3xl">
          From everyday business travel to special occasions and airport transfers, United Travel
          Services brings together comfort, reliability and personal service to make every mile
          count. Professional chauffeurs, premium vehicles and a journey planned around you.
        </p>
      </motion.div>

      {/* Fan carousel */}
      <motion.div
        className="mt-8 px-6 -mb-16"
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, delay: 0.18, ease }}
      >
        <AboutCarousel />
      </motion.div>
    </section>
  )
}
