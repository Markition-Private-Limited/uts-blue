'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { chauffeurPromoContent } from '@/content/chauffeur-promo.content'
import { ChauffeurPromoCTA } from './ChauffeurPromoCTA'

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
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-blue-600" />
          <span className="text-[11px] font-semibold tracking-[0.3em] text-blue-600 uppercase">
            Our Clients, Our Priority
          </span>
          <span className="h-px w-10 bg-blue-600" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease }}
          className="whitespace-nowrap text-[clamp(1.5rem,3.8vw,3.75rem)] font-bold leading-tight tracking-tight text-gray-900"
        >
          Luxury Journeys.{' '}
          <span className="text-blue-600">Lasting Impressions</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease }}
          className="mt-6 max-w-2xl font-[family-name:var(--font-arimo)] text-[18px] font-normal leading-[123%] tracking-normal text-gray-600"
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
