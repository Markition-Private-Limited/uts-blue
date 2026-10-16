'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { chauffeurPromoContent } from '@/content/chauffeur-promo.content'
import { ChauffeurPromoHeadline } from './ChauffeurPromoHeadline'
import { ChauffeurPromoCar } from './ChauffeurPromoCar'
import { ChauffeurPromoCTA } from './ChauffeurPromoCTA'

const ease = [0.22, 1, 0.36, 1] as const

export function ChauffeurPromoSection() {
  const { headline, car, cta, background } = chauffeurPromoContent
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      className="relative overflow-hidden bg-top bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundColor: '#e9edf2',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-950/70 via-blue-700/30 to-transparent sm:h-80 lg:h-96"
      />
      <div
        ref={ref}
        className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 pb-6 sm:pt-12 sm:pb-8 lg:px-8 lg:pt-14 lg:pb-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease }}
        >
          <ChauffeurPromoHeadline
            line1={headline.line1}
            line2={headline.line2}
            highlight={headline.highlight}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          <ChauffeurPromoCar src={car.src} alt={car.alt} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.3, ease }}
        >
          <ChauffeurPromoCTA label={cta.label} href={cta.href} />
        </motion.div>
      </div>
    </section>
  )
}
