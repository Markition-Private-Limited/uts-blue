'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { chauffeurPromoContent } from '@/content/chauffeur-promo.content'
import { ChauffeurPromoCTA } from './ChauffeurPromoCTA'
import { HeroBadge } from '@/components/hero/HeroBadge'

const ease = [0.22, 1, 0.36, 1] as const

export function ChauffeurPromoSection() {
  const { headline, cta } = chauffeurPromoContent
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background image at 40% opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg-new.png')", opacity: 0.4 }}
        aria-hidden
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-12 text-center sm:py-16 lg:px-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-6"
        >
          <HeroBadge text="Our Clients, Our Priority" variant="blue" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease }}
          className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
        >
          Luxury Journeys.{' '}
          <span className="text-blue-600">Lasting Impressions</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease }}
          className="mt-6 max-w-2xl text-[15px] leading-relaxed text-gray-600"
        >
          Experience London in exceptional comfort with our professional chauffeur service. From airport transfers to executive travel and special occasions, we make every journey seamless, comfortable and memorable.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="mt-10"
        >
          <ChauffeurPromoCTA label={cta.label} href={cta.href} />
        </motion.div>
      </div>
    </section>
  )
}
