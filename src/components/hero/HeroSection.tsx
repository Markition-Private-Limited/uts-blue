'use client'

import { motion } from 'framer-motion'
import { HeroBadge } from './HeroBadge'
import { HeroCTA } from './HeroCTA'
import { HeroHeadline } from './HeroHeadline'
import { HeroBookingBar } from './HeroBookingBar'
import { heroContent } from '@/content/hero.content'

const ease = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  const { badge, headline, description, cta } = heroContent

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      {/* Background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          filter: 'blur(4px)',
          transform: 'scale(1.05)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease }}
        aria-hidden
      />

      {/* Blue-tinted overlay */}
      <div
        className="absolute inset-0"
        style={{ background: '#1E4FD926' }}
        aria-hidden
      />

      {/* Content + Booking bar as one centered unit */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-6 pt-40 pb-[192px] lg:px-8">
        <div className="flex w-full max-w-4xl flex-col items-center gap-4">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <HeroBadge text={badge} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease }}
          >
            <HeroHeadline headline={headline} description={description} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease }}
          >
            <HeroCTA buttons={cta} />
          </motion.div>
        </div>

        {/* Booking bar sits directly below the text, no gap disruption */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.4, ease }}
          className="w-full max-w-6xl"
        >
          <HeroBookingBar />
        </motion.div>
      </div>
    </section>
  )
}
