'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HeroBadge } from '@/components/hero/HeroBadge'

const ease = [0.22, 1, 0.36, 1] as const

const TESTIMONIALS = [
  {
    id: 1,
    name: 'James Harrington',
    img: '/testimonials/person-1.jpg',
    quote: 'Professional service and pricing. The car condition was excellent, customer support was very responsive.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    img: '/testimonials/person-2.jpg',
    quote: 'Absolutely seamless experience from booking to drop-off. The chauffeur was punctual, courteous, and incredibly professional.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Daniel Chambers',
    img: '/testimonials/person-3.jpg',
    quote: 'Outstanding service every single time. UTS Blue has become my go-to for all airport transfers and business travel.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Michael Torres',
    img: '/testimonials/person-4.jpg',
    quote: 'From the pristine vehicle to the white-glove service, every detail was handled with care. Highly recommend.',
    rating: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 28 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-2xl px-6 text-center mb-12"
      >
        <HeroBadge text="Our Happy Clients" />
        <h2
          className="mt-5 text-gray-900 leading-tight"
          style={{ fontWeight: 300, fontSize: 'clamp(26px, 5vw, 48px)' }}
        >
          Real Journeys.{' '}
          <span style={{ fontWeight: 700, fontStyle: 'italic', color: '#1648D8' }}>
            Lasting Impressions.
          </span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          The best journeys are remembered for how they make you feel. We aim to deliver a
          professional, comfortable and dependable experience every time you travel with us.
        </p>
      </motion.div>

      {/* Cards — full width, 4 across, same padding as fleet */}
      <div className="px-6 overflow-hidden">
        <div className="flex gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.09, ease }}
              className="relative flex-none rounded-2xl overflow-hidden"
              style={{
                width: 'calc((100% - 48px) / 4)',
                height: 420,
              }}
            >
              <Image
                src={t.img}
                alt={t.name}
                fill
                className="object-cover object-top"
                sizes="25vw"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.0627451) 45%, rgba(0,0,0,0.627451) 58%, #000000 100%)',
                }}
              />

              <div className="absolute inset-x-0 bottom-0 px-5 pb-5 flex flex-col gap-2">
                <Stars count={t.rating} />
                <p className="text-white/85 leading-relaxed" style={{ fontSize: 13 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-white font-semibold text-sm">{t.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
