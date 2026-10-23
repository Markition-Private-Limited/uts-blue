'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
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

const TABS = ['All Vehicles', 'Business Class', 'First Class', 'Economy Saloon', 'First Class Van', 'Van', 'MPV', 'Standard Van']
const ease = [0.22, 1, 0.36, 1] as const

// ─── Individual fleet card ─────────────────────────────────────────────────────
function FleetCard({ car, i }: { car: (typeof FLEET)[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: i * 0.09, ease }}
      // 1 card on phones, 2 on tablets, 3 on desktop - all sliding in one track
      className="shrink-0 snap-start basis-full overflow-hidden rounded-2xl sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
      style={{
        background: 'linear-gradient(160deg, #ffffff 0%, #eef2ff 100%)',
        border: '1px solid #dde5f7',
        boxShadow: '0 4px 24px rgba(22,72,216,0.07)',
      }}
    >
      <div className="px-4 pt-4">
        <div className="relative h-[240px] w-full overflow-hidden rounded-xl">
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
        <Link href="/book"
          className="flex-1 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 max-xl:[&>svg]:hidden py-2 text-[12px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
          style={{ background: '#22c55e' }}
        >
          <CalendarCheck size={12} />
          Book Now
        </Link>
        <Link href="/book" className="flex-1 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg px-1 max-xl:[&>svg]:hidden border border-blue-200 py-2 text-[12px] font-semibold text-blue-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 hover:bg-blue-50">
          <MessageSquare size={12} />
          Enquiry
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function FleetSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  const [activeTab, setActiveTab] = useState('All Vehicles')
  const filtered = activeTab === 'All Vehicles' ? FLEET : FLEET.filter((c) => c.category === activeTab)

  // ── Slider: a snap-scrolling track, driven by arrows, dots and autoplay ──
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  // Autoplay stays off for a few seconds after someone uses an arrow or a dot.
  const holdUntilRef = useRef(0)
  const hold = () => {
    holdUntilRef.current = Date.now() + 6000
  }
  const animRef = useRef(0)
  const [edge, setEdge] = useState({ start: true, end: false, page: 0, pages: 1 })

  const updateEdge = () => {
    const el = trackRef.current
    if (!el || el.clientWidth <= 0) return
    const max = el.scrollWidth - el.clientWidth
    const pages = Math.min(50, Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05)))
    const page = max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (pages - 1))
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2, page, pages })
  }

  // New filter -> back to the first card.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 })
    updateEdge()
    window.addEventListener('resize', updateEdge)
    return () => window.removeEventListener('resize', updateEdge)
  }, [activeTab])

  // Slow eased glide (native smooth-scroll is too quick and fights scroll-snap).
  const glideTo = (target: number, duration = 900) => {
    const el = trackRef.current
    if (!el) return
    cancelAnimationFrame(animRef.current)
    const from = el.scrollLeft
    const t0 = performance.now()
    el.style.scrollSnapType = 'none'
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      el.scrollLeft = from + (target - from) * e
      if (p < 1) animRef.current = requestAnimationFrame(tick)
      else el.style.scrollSnapType = ''
    }
    animRef.current = requestAnimationFrame(tick)
  }

  const slide = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth
    const max = el.scrollWidth - el.clientWidth
    glideTo(Math.max(0, Math.min(max, el.scrollLeft + dir * step)))
  }

  const goToPage = (page: number) => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    glideTo(edge.pages <= 1 ? 0 : (max * page) / (edge.pages - 1))
  }

  // Autoplay: advance every 3s while the slider is on screen and not hovered; loop at the end.
  useEffect(() => {
    const id = setInterval(() => {
      const el = trackRef.current
      if (!el || pausedRef.current || Date.now() < holdUntilRef.current) return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 2) return
      if (el.scrollLeft >= max - 2) glideTo(0, 1200)
      else slide(1)
    }, 3000)
    return () => clearInterval(id)
  }, [activeTab])

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
              onClick={() => setActiveTab(tab)}
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

      {/* Slider */}
      <div className="relative px-6">
        {(['prev', 'next'] as const).map((d) => {
          const disabled = d === 'prev' ? edge.start : edge.end
          return (
            <button
              key={d}
              type="button"
              aria-label={d === 'prev' ? 'Previous vehicles' : 'Next vehicles'}
              onClick={() => {
                hold()
                slide(d === 'prev' ? -1 : 1)
              }}
              disabled={disabled}
              className={`absolute top-[150px] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-[0_4px_16px_rgba(22,72,216,0.2)] transition-all duration-300 hover:scale-110 hover:bg-[#1648D8] hover:text-white active:scale-100 disabled:pointer-events-none disabled:opacity-0 ${
                d === 'prev' ? 'left-2' : 'right-2'
              }`}
            >
              {d === 'prev' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )
        })}

        <div
          ref={trackRef}
          onScroll={updateEdge}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto"
        >
          {filtered.map((car, i) => (
            <FleetCard key={`${activeTab}-${car.id}`} car={car} i={i} />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {Array.from({ length: edge.pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              hold()
              goToPage(i)
            }}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-300 hover:scale-125"
            style={{
              width: edge.page === i ? 20 : 8,
              height: 8,
              background: edge.page === i ? '#1648D8' : '#d1d5f5',
            }}
          />
        ))}
      </div>
    </section>
  )
}
