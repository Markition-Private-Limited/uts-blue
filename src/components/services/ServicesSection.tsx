'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { HeroBadge } from '@/components/hero/HeroBadge'

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    num: '01',
    img: '/services/airport-transfer.jpg',
    icon: '/services/icons/5.svg',
    link: '/services/airport-transfer',
    title: 'Airport Transfer',
    desc: 'Premier airport transfers with real-time flight tracking, proactive delay adjustments, and professional luggage assistance.',
  },
  {
    num: '02',
    img: '/services/city-to-city.webp',
    icon: '/services/icons/1.svg',
    link: '/services/city-to-city',
    title: 'City to City',
    desc: 'Premium intercity travel between major cities in absolute comfort and privacy, tailored to your schedule.',
  },
  {
    num: '03',
    img: '/services/city-trip.webp',
    icon: '/services/icons/3.svg',
    link: '/services/city-trip',
    title: 'City Trip',
    desc: 'Private point-to-point travel within the city — relax or conduct business uninterrupted on a direct journey.',
  },
  {
    num: '04',
    img: '/services/day-service.webp',
    icon: '/services/icons/4.svg',
    link: '/services/day-service',
    title: 'Day Service',
    desc: 'Full-day dedicated transport for back-to-back meetings, VIP hosting, and multi-location itineraries.',
  },
  {
    num: '05',
    img: '/services/hourly-chauffeur.jpg',
    icon: '/services/icons/2.svg',
    link: '/services/hourly-booking',
    title: 'Hourly Chauffeur',
    desc: 'A dedicated private chauffeur at your disposal for dynamic itineraries, multiple stops, and complete scheduling flexibility.',
  },
]

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return isMobile
}

// ─── Single stacking card ─────────────────────────────────────────────────────
function ServiceCard({
  card,
  index,
  scrollYProgress,
  total,
}: {
  card: (typeof CARDS)[number]
  index: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  total: number
}) {
  // Each card scales down slightly as later cards stack on top of it
  const targetScale = 1 - (total - 1 - index) * 0.03
  const cardScale = useTransform(scrollYProgress, [index / total, 1], [1, targetScale])

  // Parallax: image travels from +12% (bottom) to -12% (top) as the card scrolls through its window.
  // The image is taller than the card (115%) so the shift never exposes a gap.
  const imageY = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    ['12%', '-12%']
  )

  return (
    <div className="sticky" style={{ top: `${80 + index * 28}px` }}>
      <motion.div
        style={{ scale: cardScale, transformOrigin: 'top center', willChange: 'transform' }}
        className="w-full"
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: '#0d1a3a',
            boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
            height: 'clamp(340px, 55vw, 580px)',
          }}
        >
          {/* Background image — 115% tall so parallax shift never exposes a gap */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              style={{ y: imageY, willChange: 'transform' }}
              className="absolute inset-x-0 -top-[7.5%] h-[115%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover object-center"
                style={{ filter: 'brightness(0.68)' }}
              />
            </motion.div>
            {/* Bottom-up dark gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.92) 100%)',
              }}
            />
            {/* Subtle blue tint overlay — matches site brand */}
            <div
              className="absolute inset-0"
              style={{ background: '#1648D815' }}
            />
          </div> {/* overflow-hidden wrapper */}

          {/* Card number — top left */}
          <span
            className="absolute top-5 left-5 text-white/50 text-sm tracking-widest select-none"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {card.num}
          </span>

          {/* Service icon — top right in glass circle */}
          <div
            className="absolute top-4 right-4 flex items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.30)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.icon} alt="" style={{ width: 18, height: 18 }} />
          </div>

          {/* Bottom info panel — gradient border trick */}
          <div
            className="absolute bottom-4 left-4 right-4"
            style={{
              borderRadius: 16,
              padding: '1px',
              background:
                'linear-gradient(110deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 60%, rgba(22,72,216,0.25) 100%)',
            }}
          >
            <div
              style={{
                borderRadius: 15,
                padding: 'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <h3
                className="text-white font-semibold leading-tight mb-2"
                style={{ fontSize: 'clamp(18px, 2.8vw, 26px)' }}
              >
                {card.title}
              </h3>
              <p
                className="text-white/60 leading-relaxed mb-3"
                style={{ fontSize: 'clamp(13px, 1.5vw, 15px)' }}
              >
                {card.desc}
              </p>
              <a
                href={card.link}
                className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80 underline underline-offset-2"
                style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#93c5fd' }}
              >
                Explore Service <ArrowRight size={13} color="#93c5fd" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const perCard = isMobile ? 50 : 75
  const sectionHeight = `${CARDS.length * perCard}vh`

  return (
    <section className="w-full bg-white">
      {/* Header text */}
      <div className="px-4 sm:px-8 pt-12 sm:pt-20 pb-10 sm:pb-12 text-center">
        <HeroBadge text="Our Services" />

        <h2
          className="text-gray-900 leading-tight mt-5 mb-5"
          style={{
            fontWeight: 300,
            fontSize: 'clamp(26px, 5vw, 46px)',
          }}
        >
          One Destination Or Many.
          <br />
          <span style={{ fontWeight: 700, fontStyle: 'italic', color: '#1648D8' }}>
            We&apos;ve Got The Ride.
          </span>
        </h2>

        <p
          className="text-gray-400 leading-relaxed mx-auto px-6 sm:px-16 lg:px-28"
          style={{ fontSize: 'clamp(13px, 1.5vw, 15px)' }}
        >
          UTS Blue delivers premium chauffeur transportation for people who value comfort,
          reliability, and exceptional service. From airport transfers to corporate journeys,
          every ride is designed to make growing more effortless.
        </p>
      </div>

      {/* Stacking cards scroll container */}
      <div
        ref={containerRef}
        className="relative px-5 sm:px-8 lg:px-14"
        style={{
          height: sectionHeight,
          minHeight: `calc(${CARDS.length} * clamp(340px, 55vw, 580px))`,
        }}
      >
        {CARDS.map((card, i) => (
          <ServiceCard
            key={card.num}
            card={card}
            index={i}
            total={CARDS.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      <div className="h-20" />
    </section>
  )
}
