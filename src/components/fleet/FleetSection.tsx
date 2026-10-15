'use client'

import Image from 'next/image'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Phone, CalendarCheck, MessageSquare, Briefcase, Users } from 'lucide-react'
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

const CARDS_PER_PAGE = 3
const PAGE_COUNT = Math.ceil(FLEET.length / CARDS_PER_PAGE)
const GAP = 16       // px — gap-4
const H_PAD = 24     // px — px-6 on each side

// ─── Individual fleet card ────────────────────────────────────────────────────
function FleetCard({ car }: { car: (typeof FLEET)[number] }) {
  return (
    <div
      className="fleet-card flex-none snap-start rounded-2xl overflow-hidden"
      style={{
        // 3 cards fill the visible area (track width minus horizontal padding minus gaps)
        width: `calc((100% - ${2 * H_PAD + GAP * (CARDS_PER_PAGE - 1)}px) / ${CARDS_PER_PAGE})`,
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
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#1648D8' }}
        >
          <Phone size={12} />
          Call Now
        </button>
        <button
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#22c55e' }}
        >
          <CalendarCheck size={12} />
          Book Now
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 py-2 text-[12px] font-semibold text-blue-700 transition-colors hover:bg-blue-50">
          <MessageSquare size={12} />
          Check Enquiry
        </button>
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function FleetSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState(0)

  // Drag-scroll state
  const dragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)

  // ── Scroll → dot sync ──────────────────────────────────────────────────────
  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cardWidth = (track.clientWidth - 2 * H_PAD - GAP * (CARDS_PER_PAGE - 1)) / CARDS_PER_PAGE
    const pageWidth = cardWidth * CARDS_PER_PAGE + GAP * CARDS_PER_PAGE
    const page = Math.round(track.scrollLeft / pageWidth)
    setActivePage(Math.min(page, PAGE_COUNT - 1))
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track) return
    dragging.current = true
    dragStartX.current = e.pageX - track.getBoundingClientRect().left
    dragScrollLeft.current = track.scrollLeft
    // Disable snap while dragging so it doesn't fight the drag
    track.style.scrollSnapType = 'none'
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    e.preventDefault()
    const track = trackRef.current
    if (!track) return
    const x = e.pageX - track.getBoundingClientRect().left
    track.scrollLeft = dragScrollLeft.current - (x - dragStartX.current)
  }, [])

  const handleDragEnd = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    const track = trackRef.current
    if (!track) return
    // Re-enable snap — browser will snap to nearest card
    track.style.scrollSnapType = 'x mandatory'
  }, [])

  // ── Dot click → scroll to page ────────────────────────────────────────────
  const goToPage = (page: number) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll<HTMLElement>('.fleet-card')
    const target = cards[page * CARDS_PER_PAGE]
    if (!target) return
    track.scrollTo({ left: target.offsetLeft - H_PAD, behavior: 'smooth' })
  }

  return (
    <section className="w-full bg-white py-16 sm:py-24 overflow-hidden">
      {/* Scoped CSS: hide webkit scrollbar + grab cursor */}
      <style>{`
        .fleet-track::-webkit-scrollbar { display: none; }
        .fleet-track { cursor: grab; }
        .fleet-track.is-dragging { cursor: grabbing; }
      `}</style>

      {/* Header */}
      <div className="mx-auto max-w-2xl px-6 text-center mb-12">
        <HeroBadge text="Our Premium Fleet" />
        <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Luxury Chauffeur Cars for{' '}
          <span style={{ color: '#1648D8' }}>Every Journey</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          Discover a carefully selected range of chauffeur vehicles for business travel, airport
          transfers and special occasions. Choose the comfort and space that suit your journey.
        </p>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        className="fleet-track flex overflow-x-auto select-none"
        style={{
          gap: GAP,
          paddingLeft: H_PAD,
          paddingRight: H_PAD,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {FLEET.map((car) => (
          <FleetCard key={car.id} car={car} />
        ))}
      </div>

      {/* Pagination dots — one per page */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: activePage === i ? 20 : 8,
              height: 8,
              background: activePage === i ? '#1648D8' : '#d1d5f5',
            }}
          />
        ))}
      </div>
    </section>
  )
}
