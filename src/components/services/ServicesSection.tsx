'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { HeroBadge } from '@/components/hero/HeroBadge'

const ease = [0.22, 1, 0.36, 1] as const

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    num: '01',
    img: '/services/airport-transfer.jpg',
    icon: '/services/icons/5.svg',
    link: '/services/airport-transfer',
    title: 'Airport Transfers',
    desc: 'Enjoy a smoother airport journey with professional chauffeur service, comfortable vehicles, and coordinated pickup arrangements.',
  },
  {
    num: '02',
    img: '/services/corporate-chauffeur.jpg',
    icon: '/services/icons/1.svg',
    link: '/services/corporate-chauffeur',
    title: 'Corporate Chauffeur',
    desc: 'Make every business journey count with discreet, professional chauffeur services designed around your schedule, meetings and business commitments.',
  },
  {
    num: '03',
    img: '/services/cruise-seaport.jpg',
    icon: '/services/icons/3.svg',
    link: '/services/cruise-seaport',
    title: 'Cruise and Seaport Transfers',
    desc: 'Travel to your cruise terminal in comfort with a private chauffeur service that takes the stress out of getting to your departure point.',
  },
  {
    num: '04',
    img: '/services/sightseeing-chauffeur.jpg',
    icon: '/services/icons/4.svg',
    link: '/services/sightseeing',
    title: 'Sightseeing Chauffeur',
    desc: 'Discover London\'s famous landmarks and the surrounding areas at your own pace, with the comfort of a private vehicle and a professional driver.',
  },
  {
    num: '05',
    img: '/services/intercity-travel.jpg',
    icon: '/services/icons/2.svg',
    link: '/services/intercity-travel',
    title: 'Intercity Travel',
    desc: 'Travel between cities without the hassle of driving, parking or navigating unfamiliar routes. Sit back and enjoy a comfortable journey from door to door.',
  },
  {
    num: '06',
    img: '/services/special-events.jpg',
    icon: '/services/icons/4.svg',
    link: '/services/special-events',
    title: 'Special Events & Private Travel',
    desc: 'Arrive in style for celebrations, important occasions and private engagements with a chauffeur service tailored to your plans.',
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

  return (
    <div className="sticky" style={{ top: `${80 + index * 28}px` }}>
      <motion.div
        style={{ scale: cardScale, transformOrigin: 'top center', willChange: 'transform' }}
        className="w-full"
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
            height: 'clamp(340px, 55vw, 580px)',
          }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Blue warm overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(22, 72, 216, 0.28)' }}
            />
            {/* Bottom-up dark gradient for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)',
              }}
            />
          </div>


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

          {/* Bottom info panel — glassmorphism */}
          <div
            className="absolute bottom-4 left-4 right-4"
            style={{
              borderRadius: 16,
              padding: '1px',
              background:
                'linear-gradient(110deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 60%, rgba(22,72,216,0.40) 100%)',
            }}
          >
            <div
              style={{
                borderRadius: 15,
                padding: 'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)',
                background: 'rgba(0,0,0,0.24)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
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
                    className="group inline-flex items-center gap-1.5 underline underline-offset-2 transition-all duration-300 hover:translate-x-1 hover:opacity-80"
                    style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#93c5fd' }}
                  >
                    Explore Service <ArrowRight size={13} color="#93c5fd" />
                  </a>
                </div>
                <span
                  className="text-white/40 select-none shrink-0"
                  style={{ fontSize: 'clamp(64px, 8vw, 100px)', fontWeight: 800, lineHeight: 1 }}
                >
                  {card.num}
                </span>
              </div>
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
  const headerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const perCard = isMobile ? 50 : 75
  const sectionHeight = `${CARDS.length * perCard}vh`

  return (
    <section className="w-full bg-white">
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
