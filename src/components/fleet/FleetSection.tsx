'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Phone, CalendarCheck, MessageSquare, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroBadge } from '@/components/hero/HeroBadge'

// ─── Fleet data ───────────────────────────────────────────────────────────────
const FLEET = [
  { id: 'economy-saloon', category: 'Economy Saloon', name: 'VW Passat / Kia Niro or similar', seating: 'According to model', img: '/fleet/economy-saloon-vw-passat.webp' },
  { id: 'business-class', category: 'Business Class', name: 'Mercedes-Benz E-Class or similar', seating: 'According to model', img: '/fleet/business-class-mercedes-e-class.webp' },
  { id: 'first-class', category: 'First Class', name: 'Mercedes-Benz S-Class or similar', seating: 'According to model', img: '/fleet/first-class-mercedes-s-class.webp' },
  { id: 'first-class-van', category: 'First Class Van', name: 'Mercedes-Benz V-Class or similar', seating: 'According to model', img: '/fleet/first-class-van-mercedes-v-class.webp' },
  { id: 'van', category: 'Van', name: '8/9 - Seater Van', seating: '8–9 passengers', img: '/fleet/van-8-9-seater.webp' },
  { id: 'mpv', category: 'MPV', name: 'VW Sharan / Ford Galaxy or similar', seating: '7 passengers', img: '/fleet/mpv-vw-sharan.webp' },
  { id: 'standard-van', category: 'Standard Van', name: 'Hyundai i800 / VW Transporter or similar', seating: 'According to model', img: '/fleet/standard-van-hyundai-i800.webp' },
]

const AMENITIES = [
  { label: 'Wifi Available', icon: '/fleet/icons/wifi-available.png' },
  { label: 'GPS Tracking', icon: '/fleet/icons/gps-tracking.png' },
  { label: 'Water Available', icon: '/fleet/icons/water-available.png' },
  { label: 'Child Seat Available', icon: '/fleet/icons/child-seat-available.png' },
]

const VISIBLE = 3
const TABS = ['All Vehicles', 'Business Class', 'First Class', 'Economy Saloon', 'First Class Van', 'Van', 'MPV', 'Standard Van']
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
      <div className="px-4 pt-4">
        <div className="relative h-48 w-full overflow-hidden rounded-xl">
          <Image
            src={car.img}
            alt={car.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 33vw, 420px"
          />
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
            style={{ background: '#1648D8' }}
          >
            {car.category}
          </span>
        </div>
      </div>

      <div className="px-5 pt-4 pb-3">
        <h3 className="mb-3 text-[15px] font-bold leading-snug tracking-wide text-gray-900">{car.name}</h3>

        <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-[11px]">
          <span className="flex shrink-0 items-center gap-1.5 font-bold uppercase tracking-wide text-gray-900">
            <Users size={13} className="shrink-0 text-blue-600" />
            Seating:
          </span>
          <span className="text-right text-gray-600">{car.seating}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {AMENITIES.map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span
                aria-hidden
                className="block h-5 w-5"
                style={{
                  background: '#1648D8',
                  WebkitMask: `url(${icon}) center / contain no-repeat`,
                  mask: `url(${icon}) center / contain no-repeat`,
                }}
              />
              <span className="text-[10px] leading-tight text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 h-px bg-blue-100" />

      <div className="flex items-center gap-1.5 px-4 py-4">
        <button
          className="flex-1 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 max-xl:[&>svg]:hidden py-2 text-[12px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
          style={{ background: '#1648D8' }}
        >
          <Phone size={12} />
          Call Now
        </button>
        <button
          className="flex-1 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 max-xl:[&>svg]:hidden py-2 text-[12px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
          style={{ background: '#22c55e' }}
        >
          <CalendarCheck size={12} />
          Book Now
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 max-xl:[&>svg]:hidden border border-blue-200 py-2 text-[12px] font-semibold text-blue-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 hover:bg-blue-50">
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

  const [activeTab, setActiveTab] = useState('All Vehicles')

  const filtered = activeTab === 'All Vehicles' ? FLEET : FLEET.filter((c) => c.category === activeTab)
  const PAGE_COUNT = Math.max(1, Math.ceil(filtered.length / VISIBLE))
  const pageCards = filtered.slice(page * VISIBLE, (page + 1) * VISIBLE)

  const selectTab = (tab: string) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setDir(1)
    setPage(0)
  }

  const navigate = (newPage: number) => {
    if (newPage === page) return
    setDir(newPage > page ? 1 : -1)
    setPage(newPage)
  }

  return (
    <section id="fleet" className="w-full scroll-mt-24 bg-white pt-8 pb-0 sm:pt-10 sm:pb-0">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 36 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease }}
        className="mx-auto max-w-2xl px-6 text-center mb-8"
      >
        <HeroBadge text="Our Premium Fleet" variant="blue" />
        <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Luxury Chauffeur Cars for{' '}
          <span style={{ color: '#1648D8', fontStyle: 'italic' }}>Every Journey</span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-500">
          Discover a carefully selected range of chauffeur vehicles for business travel, airport
          transfers and special occasions. Choose the comfort and space that suit your journey.
        </p>
      </motion.div>

      {/* Filter */}
      <div className="mx-auto mb-8 flex max-w-5xl flex-wrap items-center justify-center gap-2 px-6">
        {TABS.map((tab) => {
          const active = tab === activeTab
          return (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`rounded-full border px-4 py-2 text-[12px] font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                active
                  ? 'border-[#1648D8] bg-[#1648D8] text-white shadow-lg shadow-blue-600/30'
                  : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Carousel */}
      <div className="px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`${activeTab}-${page}`}
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
