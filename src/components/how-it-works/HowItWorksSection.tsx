'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HeroBadge } from '@/components/hero/HeroBadge'

const ease = [0.22, 1, 0.36, 1] as const

const STEPS = [
  {
    num: '01',
    title: 'Choose Your Car',
    desc: 'Select the chauffeur service and vehicle that suit your plans.',
  },
  {
    num: '02',
    title: 'Set Your Details',
    desc: 'Tell us where and when you would like to travel.',
  },
  {
    num: '03',
    title: 'Confirm Your Ride',
    desc: 'Review your journey details and confirm your arrangements.',
  },
  {
    num: '04',
    title: 'Enjoy The Drive',
    desc: 'Sit back, relax and let your professional chauffeur take care of the road.',
  },
]

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/how-it-works-bg.png')" }}
      />
      {/* Blue overlay matching the screenshot */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(22, 72, 216, 0.82)' }}
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-white/50" />
          <span className="text-xs font-medium tracking-[0.22em] uppercase text-white/80">
            Travel Your Way
          </span>
          <span className="h-px w-8 bg-white/50" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-4xl font-bold leading-tight text-white lg:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.08, ease }}
        >
          Luxury, Made Effortless
        </motion.h2>

        {/* Sub-copy */}
        <motion.p
          className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/75"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.16, ease }}
        >
          From the first booking to your final destination, enjoy a chauffeur
          experience shaped around your schedule. We take care of the journey,
          so you can focus on what matters most.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.24, ease }}
        >
          <button
            className="inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.30)',
            }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.22)' }}
            >
              <ArrowRight size={16} color="white" />
            </span>
            Explore Our Fleet
          </button>
        </motion.div>

        {/* Step cards */}
        <motion.div
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.32, ease }}
        >
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative overflow-hidden rounded-2xl p-5 text-left"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {/* Ghost number */}
              <span
                className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 select-none font-black leading-none text-gray-200"
                style={{ fontSize: 72 }}
                aria-hidden
              >
                {step.num}
              </span>

              <p className="relative text-[17px] font-bold text-gray-900">
                {step.title}
              </p>
              <p className="relative mt-2 text-[13px] leading-relaxed text-gray-500">
                {step.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
