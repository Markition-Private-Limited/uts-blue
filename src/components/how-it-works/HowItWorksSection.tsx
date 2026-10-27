'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { HeroBadge } from '@/components/hero/HeroBadge'

const ease   = [0.22, 1, 0.36, 1] as const
const BLUE   = '#1648D8'
const CARD_H = 340
const PEAK_X = 80
const COL_W  = 200

function arcX(y: number): number {
  const t = y / CARD_H
  return 4 * PEAK_X * t * (1 - t)
}

const Y_TOP    = CARD_H * 0.20
const Y_ACTIVE = CARD_H * 0.50
const Y_BOTTOM = CARD_H * 0.80
const Y_OFF_T  = -CARD_H * 0.28
const Y_OFF_B  =  CARD_H * 1.28

const STEPS = [
  { num: '01', title: 'Choose Your Car',   desc: 'Select the chauffeur service and vehicle that suit your plans.' },
  { num: '02', title: 'Set Your Details',  desc: 'Tell us where and when you would like to travel.' },
  { num: '03', title: 'Confirm Your Ride', desc: 'Review your journey details and confirm your arrangements.' },
  { num: '04', title: 'Enjoy The Drive',   desc: 'Sit back, relax and let your professional chauffeur take care of the road.' },
]

const NUM_GAP = 28
function slotPos(offset: number): { x: number; y: number } {
  const rightOf = (y: number) => arcX(y) + NUM_GAP
  if (offset === -1) return { y: Y_TOP,    x: rightOf(Y_TOP) }
  if (offset ===  0) return { y: Y_ACTIVE, x: rightOf(Y_ACTIVE) }
  if (offset === +1) return { y: Y_BOTTOM, x: rightOf(Y_BOTTOM) }
  if (offset <   -1) return { y: Y_OFF_T,  x: 4 }
  return                     { y: Y_OFF_B,  x: 4 }
}

function slotRotate(offset: number): number {
  if (offset === -1) return  22
  if (offset ===  0) return  0
  if (offset === +1) return -22
  return offset < -1 ? 22 : -22
}

export function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  // Autoplay — cycles through steps every 2.5 s
  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % STEPS.length)
    }, 1700)
    return () => clearInterval(id)
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: "url('/how-it-works-bg.png')" }} />
      <div className="absolute inset-0" style={{ background: 'rgba(22,72,216,0.88)' }} />

      <div className="relative z-10 flex min-h-[500px] w-full items-center gap-8 px-10 py-16 xl:gap-14 xl:px-20">

        {/* LEFT TEXT */}
        <motion.div
          className="flex w-2/5 shrink-0 flex-col"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, ease }}
        >
          <div className="mb-5 w-fit">
            <HeroBadge text="Travel Your Way" />
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Luxury, Made Effortless
          </h2>

          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">
            From the first booking to your final destination, enjoy a chauffeur
            experience shaped around your schedule. We take care of the journey,
            so you can focus on what matters most.
          </p>

          <div className="mt-8">
            <a href="#fleet"
              className="btn-fill [--fill-x:1.5rem] inline-flex items-center gap-3 rounded-full py-1 pl-1 pr-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.30)',
              }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                <ArrowRight size={14} color={BLUE} />
              </span>
              Explore Our Fleet
            </a>
          </div>
        </motion.div>

        {/* RIGHT: FROSTED SHELL + WHITE CARD */}
        <motion.div
          className="flex flex-1 items-center justify-end"
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          {/* Frosted glass frame — no overflow:hidden so car can bleed below */}
          <div
            className="relative w-full rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.13)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            {/* White card — overflow-hidden restored for rounded corners */}
            <div
              className="relative flex w-full overflow-hidden rounded-xl bg-white"
              style={{ height: CARD_H }}
            >

              {/* ARC COLUMN */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{ width: COL_W, height: CARD_H }}
              >
                <svg
                  width={COL_W}
                  height={CARD_H}
                  viewBox={`0 0 ${COL_W} ${CARD_H}`}
                  className="pointer-events-none absolute inset-0"
                >
                  <path
                    d={`M 0 0 Q ${2 * PEAK_X} ${CARD_H / 2} 0 ${CARD_H}`}
                    fill="none"
                    stroke="#d8d8d8"
                    strokeWidth="1.5"
                  />
                  {active > 0 && (
                    <circle cx={arcX(Y_TOP)}    cy={Y_TOP}    r={3.5} fill="#c8c8c8" />
                  )}
                  <circle   cx={arcX(Y_ACTIVE)} cy={Y_ACTIVE} r={5.5} fill={BLUE}    />
                  {active < STEPS.length - 1 && (
                    <circle cx={arcX(Y_BOTTOM)} cy={Y_BOTTOM} r={3.5} fill="#c8c8c8" />
                  )}
                </svg>

                {STEPS.map((s, i) => {
                  const offset    = i - active
                  const pos       = slotPos(offset)
                  const isActive  = offset === 0
                  const isVisible = Math.abs(offset) === 1
                  const rotate    = slotRotate(offset)

                  return (
                    <motion.button
                      key={s.num}
                      onClick={() => setActive(i)}
                      className="absolute"
                      style={{ translateY: '-50%' }}
                      animate={{ left: pos.x, top: pos.y }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.span
                        animate={{
                          color:      isActive  ? BLUE     : '#c0c0c0',
                          fontSize:   isActive  ? 48       : isVisible ? 30 : 18,
                          fontWeight: isActive  ? 900      : 700,
                          opacity:    (isActive || isVisible) ? 1 : 0,
                          rotate,
                        }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{ display: 'block', lineHeight: 1, fontFamily: 'inherit', originX: '50%', originY: '50%' }}
                      >
                        {s.num}
                      </motion.span>
                    </motion.button>
                  )
                })}
              </div>

              {/* DIVIDER */}
              <div
                className="shrink-0 self-center rounded-full"
                style={{ width: 1.5, height: '38%', background: '#e2e2e2' }}
              />

              {/* CONTENT — text + watermark only (car is outside this div) */}
              <div className="relative flex flex-1 flex-col items-start justify-center overflow-hidden px-7 py-6">
                {/* Watermark — crisp SVG, padded equally from top/right */}
                <div className="pointer-events-none absolute" style={{ top: 24, right: 24, bottom: 0, left: 0, transform: 'scale(0.92)', transformOrigin: 'top right' }}>
                  <Image
                    src="/mask-group.svg"
                    alt=""
                    fill
                    className="object-contain object-right-bottom"
                    style={{ opacity: 0.05 }}
                    unoptimized
                  />
                </div>

                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="relative z-10 max-w-[200px] xl:max-w-[280px] 2xl:max-w-[380px]"
                >
                  <h3 className="text-[17px] font-bold leading-snug text-gray-900 xl:text-[21px] 2xl:text-[28px]">
                    {STEPS[active].title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-gray-500 xl:text-[15px] 2xl:text-[19px]">
                    {STEPS[active].desc}
                  </p>
                </motion.div>
              </div>

            </div>

            {/* CAR — sibling of white card, tires hang below it */}
            <div
              className="pointer-events-none absolute"
              style={{ width: 320, height: 200, right: 20, bottom: -4 }}
            >
              <Image
                src="/car-hero.png"
                alt="Luxury chauffeur car"
                fill
                className="object-contain object-right-bottom drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
