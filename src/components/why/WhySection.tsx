'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { HeroBadge } from '@/components/hero/HeroBadge'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function StatCircle({ number, label }: { number: string; label: string }) {
  return (
    <div
      className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full"
      style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <span className="text-[40px] font-bold leading-none text-white">{number}</span>
      <span className="mt-1.5 text-[12px] text-white/60">{label}</span>
    </div>
  )
}

export function WhySection() {
  const colRef = useRef<HTMLDivElement>(null)
  const inView = useInView(colRef, { once: true, amount: 0.4 })

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: '#1E4FD9' }}
    >

      <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-16 lg:py-20">
        {/* 3-column layout */}
        <div className="grid items-start gap-10 lg:grid-cols-[38%_1fr_220px]">

          {/* ── Col 1: image mosaic ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4" style={{ height: 560 }}>
            <div className="flex h-full flex-col gap-4">
              <div className="relative flex-[3] overflow-hidden rounded-2xl">
                <Image src="/why/chauffeur.png" alt="Professional chauffeur" fill className="object-cover object-top" sizes="18vw" />
              </div>
              <div className="relative flex-[2] overflow-hidden rounded-2xl">
                <Image src="/why/coastal-car.png" alt="Luxury fleet vehicle" fill className="object-cover object-center" sizes="18vw" />
              </div>
            </div>
            <div className="flex h-full flex-col gap-4">
              <div className="relative flex-[2] overflow-hidden rounded-2xl">
                <Image src="/why/interior.png" alt="Luxury car interior" fill className="object-cover object-center" sizes="18vw" />
              </div>
              <div className="relative flex-[3] overflow-hidden rounded-2xl">
                <Image src="/why/door.png" alt="Chauffeur opening door" fill className="object-cover object-center" sizes="18vw" />
              </div>
            </div>
          </div>

          {/* ── Col 2: text + stats ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 py-4">
            <HeroBadge text="Why Travel With UTS" />
            <h2 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
              The Difference Is in Every Detail.
            </h2>
            <p className="text-[15px] leading-relaxed text-white/70">
              At United Travel Services, great service goes beyond getting you to your
              destination. We focus on professional chauffeurs, well presented vehicles,
              dependable journeys and personal attention from pickup to drop off. Whether
              you are travelling for business or pleasure, your comfort remains our priority.
            </p>
            <div>
              <button
                className="inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-6 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.22)',
                }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: 'rgba(255,255,255,0.20)' }}
                >
                  <ArrowRight size={16} color="white" />
                </span>
                Discover Our Story
              </button>
            </div>
            <div className="flex items-center gap-12">
              <StatCircle number="120" label="Vehicles" />
              <div className="h-16 w-px" style={{ background: 'rgba(255,255,255,0.20)' }} />
              <StatCircle number="25" label="Awwards" />
            </div>
          </div>

          {/* ── Col 3: car drops in, RIDES text trails behind (above) it ────── */}
          <div
            ref={colRef}
            className="relative overflow-hidden"
            style={{ height: 560 }}
          >
            {/* RIDES + car fall as one unit — RIDES trails above the car */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
              style={{ bottom: 16 }}
              initial={{ y: -900 }}
              animate={inView ? { y: 0 } : undefined}
              transition={{ duration: 1.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* RIDES — normal word in a sized container so it stays above car */}
              <div
                aria-hidden
                className="pointer-events-none select-none flex items-center justify-center"
                style={{ height: 540, width: 220 }}
              >
                <span
                  className="font-black text-white whitespace-nowrap"
                  style={{
                    fontSize: 160,
                    lineHeight: 1,
                    letterSpacing: 0,
                    opacity: 1,
                    transform: 'rotate(-90deg)',
                    display: 'block',
                  }}
                >
                  RIDES
                </span>
              </div>

              {/* Car — 240px, rotated 268deg facing downward */}
              <Image
                src="/why/car-top.png"
                alt=""
                width={240}
                height={408}
                className="h-auto object-contain"
                style={{ width: 240, transform: 'rotate(268deg)' }}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
