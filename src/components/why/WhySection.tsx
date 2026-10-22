'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { HeroBadge } from '@/components/hero/HeroBadge'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from 'framer-motion'
import { useRef, useEffect } from 'react'

// ─── Animated count-up number ─────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' })
    return controls.stop
  }, [inView, count, value])

  return (
    <span ref={ref} className="text-[40px] font-bold leading-none text-white">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

function StatCircle({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div
      className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full"
      style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <AnimatedNumber value={value} suffix={suffix} />
      <span className="mt-1.5 text-[12px] text-white/60">{label}</span>
    </div>
  )
}

const ease = [0.22, 1, 0.36, 1] as const

export function WhySection() {
  const colRef = useRef<HTMLDivElement>(null)
  const inView = useInView(colRef, { once: true, amount: 0.4 })
  const sectionRef = useRef<HTMLElement>(null)
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Parallax: each image moves at a slightly different rate
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const img1Y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const img2Y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const img3Y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const img4Y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl mx-6 mt-8 mb-4 sm:mt-10 sm:mb-6 lg:mx-16"
      style={{ background: '#1E4FD9' }}
    >

      <div className="relative z-10 px-8 py-12">
        {/* 3-column layout */}
        <div className="grid items-stretch gap-10 lg:grid-cols-[38%_1fr_300px]">

          {/* ── Col 1: image mosaic with parallax + hover ────────────────────── */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: -40 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease }}
          >
            <div className="grid h-full gap-4" style={{ gridTemplateRows: '3fr 2fr' }}>
              <div className="relative overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  style={{ transformOrigin: 'top center' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src="/why/chauffeur-v2.png" alt="Professional chauffeur" fill unoptimized className="object-cover object-top" />
                </motion.div>
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.12 }}
                  whileHover={{ scale: 1.18 }}
                  style={{ y: img2Y }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src="/why/coastal-car-v2.png" alt="Luxury fleet vehicle" fill unoptimized className="object-cover object-center" />
                </motion.div>
              </div>
            </div>
            <div className="grid h-full gap-4" style={{ gridTemplateRows: '2fr 3fr' }}>
              <div className="relative overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.12 }}
                  whileHover={{ scale: 1.18 }}
                  style={{ y: img3Y }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src="/why/interior-v2.png" alt="Luxury car interior" fill unoptimized className="object-cover object-center" />
                </motion.div>
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.12 }}
                  whileHover={{ scale: 1.18 }}
                  style={{ y: img4Y }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src="/why/door-v2.png" alt="Chauffeur opening door" fill unoptimized className="object-cover object-center" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── Col 2: text + stats ──────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-8 py-4"
            initial={{ opacity: 0, y: 32 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease }}
          >
            <HeroBadge text="Why Travel With UTS" />
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
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
                className="inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-6 text-[14px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
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
              <StatCircle value={120} label="Vehicles" />
              <div className="h-16 w-px" style={{ background: 'rgba(255,255,255,0.20)' }} />
              <StatCircle value={25} label="Awards" />
            </div>
          </motion.div>

          {/* ── Col 3: car + RIDES ── */}
          <div ref={colRef} className="relative">
            <div
              aria-hidden
              className="pointer-events-none select-none absolute inset-x-0 top-0 bottom-0 translate-x-[10px] overflow-hidden"
            >
              <div className="rides-ticker-inner">
                {[0, 1].map((i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <span
                      style={{
                        fontSize: 100,
                        fontWeight: 900,
                        lineHeight: 1,
                        color: 'white',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      LUXURY RIDES
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              className="absolute right-[-30px]"
              style={{ bottom: 0 }}
              initial={{ y: -1000 }}
              animate={inView ? { y: 0 } : undefined}
              transition={{ duration: 1.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/why/car-top.png"
                alt=""
                width={500}
                height={333}
                style={{ width: 500, height: 'auto', transform: 'rotate(268deg)' }}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
