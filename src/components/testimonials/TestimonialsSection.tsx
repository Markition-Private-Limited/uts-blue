'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { HeroBadge } from '@/components/hero/HeroBadge'

const ease = [0.22, 1, 0.36, 1] as const
const AUTOPLAY_MS = 1800

// 6 testimonials — fills a 4-per-view carousel with 2 unseen cards cycling in
const BASE = [
  {
    id: 1,
    name: 'William Harris',
    role: 'Frequent Traveller',
    img: '/testimonials/person-1.jpg',
    quote: 'UTS is my first choice for London travel. Punctual pickups, refined vehicles, and professional chauffeurs make every business trip stress-free.',
  },
  {
    id: 2,
    name: 'Oliver Thompson',
    role: 'Private Client',
    img: '/testimonials/person-2.jpg',
    quote: 'Travelling with UTS is always a pleasure. The immaculate vehicles, courteous chauffeurs, and attention to detail make every London trip special.',
  },
  {
    id: 3,
    name: 'Sophie Williams',
    role: 'Business Traveller',
    img: '/testimonials/person-3.jpg',
    quote: 'UTS makes airport transfers effortless. My chauffeur arrived on time, handled my luggage, and ensured a comfortable journey throughout London.',
  },
  {
    id: 4,
    name: 'James Anderson',
    role: 'Corporate Executive',
    img: '/testimonials/person-4.jpg',
    quote: 'UTS delivers exceptional chauffeur service across London. Every journey is smooth, the driver is punctual, and the luxury experience is always outstanding.',
  },
  {
    id: 5,
    name: 'Charlotte Davies',
    role: 'Personal Traveller',
    img: '/testimonials/person-1.jpg',
    quote: 'From the first call to the final drop-off, every detail was handled perfectly. UTS sets the standard for what chauffeur travel should feel like.',
  },
  {
    id: 6,
    name: 'Edward Clarke',
    role: 'Business Executive',
    img: '/testimonials/person-4.jpg',
    quote: 'I rely on UTS for every corporate trip. The professionalism, punctuality, and quality of vehicles is consistently outstanding across all journeys.',
  },
]

// Triple for a seamless infinite loop: start in the middle copy, scroll right,
// when we hit the end of the 2nd copy silently jump back to the 1st copy start.
const ITEMS = [...BASE, ...BASE, ...BASE]

function QuoteIcon({ active }: { active: boolean }) {
  return (
    <svg width="34" height="26" viewBox="0 0 36 28" fill="none" aria-hidden>
      <path
        d="M0 28V17.6C0 12.693 1.387 8.64 4.16 5.44 6.933 2.24 10.88 0.373333 16 0L17.6 3.2C14.507 3.84 12.107 5.12 10.4 7.04 8.693 8.96 7.84 11.253 7.84 13.92H14.4V28H0ZM20 28V17.6C20 12.693 21.387 8.64 24.16 5.44 26.933 2.24 30.88 0.373333 36 0L37.6 3.2C34.507 3.84 32.107 5.12 30.4 7.04 28.693 8.96 27.84 11.253 27.84 13.92H34.4V28H20Z"
        fill={active ? 'rgba(255,255,255,0.7)' : '#1648D8'}
      />
    </svg>
  )
}

function Card({ name, role, img, quote, active, onClick }: {
  name: string; role: string; img: string; quote: string; active: boolean; onClick?: () => void
}) {
  return (
    <div
      className="flex-none flex flex-col items-center select-none"
      style={{ paddingTop: 44, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {/* Avatar overflows above card */}
      <div
        className="rounded-full z-10"
        style={{
          width: 110, height: 110, padding: 4, marginBottom: -42,
          background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
          border: `2px solid ${active ? 'rgba(180,180,180,0.7)' : '#1648D8'}`,
          borderRadius: '50%',
          flexShrink: 0,
        }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image src={img} alt={name} fill className="object-cover object-top" sizes="110px" draggable={false} />
        </div>
      </div>

      {/* Card body */}
      <div
        className="w-full rounded-3xl pt-14 pb-8 px-6 flex flex-col items-center gap-3 text-center"
        style={{
          background: active ? '#1648D8' : '#e8edf8',
          transition: 'background 0.4s ease',
          minHeight: 340,
        }}
      >
        {/* Stars */}
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="17" height="17" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={active ? '#fff' : '#1648D8'} />
            </svg>
          ))}
        </div>

        <div>
          <p className="font-bold text-[18px] leading-tight" style={{ color: active ? '#fff' : '#111' }}>{name}</p>
          <p className="mt-0.5 text-[12px]" style={{ color: active ? 'rgba(255,255,255,0.65)' : '#6b7280' }}>{role}</p>
        </div>

        <QuoteIcon active={active} />

        <p className="text-[13px] leading-relaxed italic flex-1 flex items-center justify-center" style={{ color: active ? 'rgba(255,255,255,0.88)' : '#374151' }}>
          {quote}
        </p>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  const perView = 3

  // offset = index of the leftmost VISIBLE card in ITEMS[]
  // Start in the middle copy so we can silently reset to the 1st copy (same visual content).
  const [offset, setOffset] = useState(BASE.length)
  const [animated, setAnimated] = useState(true)
  const pausedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    // Pure functional update — no side effects inside the updater.
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return
      setOffset(p => p + 1)
    }, AUTOPLAY_MS)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When the slide animation ends and we've reached the 3rd copy, silently jump
  // back to the identical position in the 2nd copy. No setTimeout needed —
  // onTransitionEnd fires exactly when the animation finishes.
  // `offset` captured here is always current because React re-renders on every
  // setOffset tick, so this closure is recreated before each paint.
  const handleTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return
    if (offset >= BASE.length * 2) {
      const resetTo = BASE.length + (offset % BASE.length)
      // Batch both updates: one paint with no transition at the new position
      setAnimated(false)
      setOffset(resetTo)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)))
    }
  }

  // Active card = the one at perView-1 from left (rightmost, newly entered)
  // Actually let's highlight the 2nd card from left so it's visually prominent
  const activeVisualIdx = 1 // 2nd card from left

  const cardWidthVw = 100 / perView // e.g. 25vw per card at perView=4
  // translateX: shift so that ITEMS[offset] is the leftmost visible card
  const translatePct = -offset * (100 / (ITEMS.length)) // as % of track width

  const dotActiveIdx = offset % BASE.length

  return (
    <section
      className="w-full bg-white pt-8 pb-16 sm:pt-10 sm:pb-20 overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 28 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-2xl px-6 text-center mb-2"
      >
        <HeroBadge text="Our Clients, Our Priority" variant="blue" />
        <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Real Journeys.{' '}
          <span style={{ color: '#1648D8', fontStyle: 'italic' }}>Lasting Impressions.</span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-500">
          The best journeys are remembered for how they make you feel. We aim to deliver a
          professional, comfortable and dependable experience every time you travel with us.
        </p>
      </motion.div>

      {/* Carousel track — spans full viewport width, no padding */}
      <div className="relative">
        <div
          onTransitionEnd={handleTrackTransitionEnd}
          style={{
            display: 'flex',
            width: `${(ITEMS.length / perView) * 100}%`,
            transform: `translateX(${translatePct}%)`,
            transition: animated ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        >
          {ITEMS.map((t, i) => {
            const visibleSlot = i - offset // 0 = leftmost, perView-1 = rightmost
            const active = visibleSlot === activeVisualIdx
            return (
              <div
                key={`${t.id}-${Math.floor(i / BASE.length)}`}
                // Each card = 1/ITEMS.length of the track width = 1/perView of viewport
                style={{ width: `${100 / ITEMS.length}%`, flexShrink: 0, padding: '0 10px' }}
              >
                <Card
                  name={t.name}
                  role={t.role}
                  img={t.img}
                  quote={t.quote}
                  active={active}
                  onClick={() => {
                    if (active) return
                    // Map the clicked card's base index to the middle copy so we
                    // stay in [BASE.length, BASE.length*2) and the reset logic works.
                    const baseIdx = i % BASE.length
                    const newOffset = BASE.length + ((baseIdx - activeVisualIdx) % BASE.length + BASE.length) % BASE.length
                    setAnimated(true)
                    setOffset(newOffset)
                    startTimer()
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-10 flex items-center justify-center gap-2.5">
        {BASE.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              // Dot i → show BASE[i] as the active card (slot 1 from left)
              const newOffset = BASE.length + ((i - activeVisualIdx) % BASE.length + BASE.length) % BASE.length
              setAnimated(true)
              setOffset(newOffset)
              startTimer()
            }}
            aria-label={`Go to testimonial ${i + 1}`}
            style={{
              width: dotActiveIdx === i ? 28 : 8,
              height: 8,
              borderRadius: 999,
              background: dotActiveIdx === i ? '#1648D8' : '#d1d5db',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  )
}
