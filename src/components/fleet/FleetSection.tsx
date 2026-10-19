'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Phone, CalendarCheck, MessageSquare, Briefcase, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroBadge } from '@/components/hero/HeroBadge'

// ─── Fleet data ───────────────────────────────────────────────────────────────
const FLEET = [
  {
    id: 1,
    name: 'BMW 7 SERIES 2024',
    desc: 'Mercedes-Benz E-Class and BMW 5 Series vehicles, ideal for refined business travel.',
    img: '/fleet/car-1.png',
    class: 'Business Class',
    passengers: 4,
  },
  {
    id: 2,
    name: 'MERCEDES S-CLASS',
    desc: 'The pinnacle of executive luxury — spacious, whisper-quiet, and impeccably appointed.',
    img: '/fleet/car-2.png',
    class: 'First Class',
    passengers: 4,
  },
  {
    id: 3,
    name: 'RANGE ROVER VOGUE',
    desc: 'Commanding presence with supreme comfort, perfect for VIP transfers and special occasions.',
    img: '/fleet/car-3.png',
    class: 'SUV Class',
    passengers: 5,
  },
  {
    id: 4,
    name: 'BMW 7 SERIES LWB',
    desc: 'Long-wheelbase executive saloon with extended rear cabin, perfect for VIP delegation travel.',
    img: '/fleet/car-1.png',
    class: 'Business Class',
    passengers: 4,
  },
  {
    id: 5,
    name: 'MERCEDES S 580',
    desc: 'The flagship S-Class with AMG styling — first-class airborne comfort on every road.',
    img: '/fleet/car-2.png',
    class: 'First Class',
    passengers: 4,
  },
  {
    id: 6,
    name: 'RANGE ROVER AUTOBIOGRAPHY',
    desc: 'The ultimate Range Rover — hand-crafted luxury, maximum presence, seats up to 6 passengers.',
    img: '/fleet/car-3.png',
    class: 'SUV Class',
    passengers: 6,
  },
]

const VISIBLE = 3
const PAGE_COUNT = Math.ceil(FLEET.length / VISIBLE)
const ease = [0.22, 1, 0.36, 1] as const

// ─── Individual fleet card ─────────────────────────────────────────────────────
function FleetCard({ car, i }: { car: (typeof FLEET)[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: i * 0.09, ease }}
      className="flex-none rounded-2xl overflow-hidden"
      style={{
        width: `calc((100% - ${16 * (VISIBLE - 1)}px) / ${VISIBLE})`,
        background: 'linear-gradient(160deg, #ffffff 0%, #eef2ff 100%)',
        border: '1px solid #dde5f7',
        boxShadow: '0 4px 24px rgba(22,72,216,0.07)',
      }}
    >
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[15px] font-bold text-gray-900 tracking-wide mb-1">{car.name}</h3>
        <p className="text-[13px] text-gray-500 leading-snug">{car.desc}</p>
      </div>

      <div className="relative w-full h-48 px-4">
        <Image
          src={car.img}
          alt={car.name}
          fill
          className="object-contain object-center drop-shadow-lg"
          sizes="(max-width: 1280px) 33vw, 420px"
        />
      </div>

      <div className="flex items-center gap-5 px-5 pt-3 pb-3">
        <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
          <Briefcase size={13} className="text-blue-600 shrink-0" />
          {car.class}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
          <Users size={13} className="text-blue-600 shrink-0" />
          {car.passengers} Passengers
        </span>
      </div>

      <div className="mx-5 h-px bg-blue-100" />

      <div className="flex items-center gap-2 px-5 py-4">
        <button
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
          style={{ background: '#1648D8' }}
        >
          <Phone size={12} />
          Call Now
        </button>
        <button
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
          style={{ background: '#22c55e' }}
        >
          <CalendarCheck size={12} />
          Book Now
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 py-2 text-[12px] font-semibold text-blue-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 hover:bg-blue-50">
          <MessageSquare size={12} />
          Enquiry
        </button>
      </div>
    </motion.div>
  )
}

// ─── Slide variants (direction-aware) ─────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: -dir * 80, opacity: 0 }),
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function FleetSection() {
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  const pageCards = FLEET.slice(page * VISIBLE, (page + 1) * VISIBLE)

  const navigate = (newPage: number) => {
    if (newPage === page) return
    setDir(newPage > page ? 1 : -1)
    setPage(newPage)
  }

  return (
    <section className="w-full bg-white pt-6 pb-16 sm:pt-8 sm:pb-24">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 36 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease }}
        className="mx-auto max-w-2xl px-6 text-center mb-12"
      >
        <HeroBadge text="Our Premium Fleet" />
        <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Luxury Chauffeur Cars for{' '}
          <span style={{ color: '#1648D8' }}>Every Journey</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          Discover a carefully selected range of chauffeur vehicles for business travel, airport
          transfers and special occasions. Choose the comfort and space that suit your journey.
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease }}
            className="flex gap-4"
          >
            {pageCards.map((car, i) => (
              <FleetCard key={car.id} car={car} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => navigate(Math.max(0, page - 1))}
          disabled={page === 0}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-blue-600 transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:shadow-md active:scale-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            aria-label={`Go to page ${i + 1}`}
            className="rounded-full transition-all duration-300 hover:scale-125"
            style={{
              width: page === i ? 20 : 8,
              height: 8,
              background: page === i ? '#1648D8' : '#d1d5f5',
            }}
          />
        ))}

        <button
          onClick={() => navigate(Math.min(PAGE_COUNT - 1, page + 1))}
          disabled={page === PAGE_COUNT - 1}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-blue-600 transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:shadow-md active:scale-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  )
}
