'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const ease   = [0.22, 1, 0.36, 1] as const
const BLUE   = '#1648D8'
const CARD_H = 340           // card height
const ARC_CP = 145           // bezier control-point x → peak at 0.75 * 145 ≈ 109
const COL_W  = 200           // total arc column (arc curve + numbers beside it)

// Cubic bezier  M 0 0 C ARC_CP 0, ARC_CP CARD_H, 0 CARD_H
// B_x(t) = 3 * ARC_CP * t * (1 - t)
function arcX(y: number): number {
  const t = y / CARD_H
  return 3 * ARC_CP * t * (1 - t)
}

// The 3 fixed slot y-positions for the visible numbers
const Y_TOP    = CARD_H * 0.20  //  68
const Y_ACTIVE = CARD_H * 0.50  // 170  (arc peak)
const Y_BOTTOM = CARD_H * 0.80  // 272
const Y_OFF_T  = -CARD_H * 0.28
const Y_OFF_B  =  CARD_H * 1.28

const STEPS = [
  { num: '01', title: 'Choose Your Car',   desc: 'Select the chauffeur service and vehicle that suit your plans.' },
  { num: '02', title: 'Set Your Details',  desc: 'Tell us where and when you would like to travel.' },
  { num: '03', title: 'Confirm Your Ride', desc: 'Review your journey details and confirm your arrangements.' },
  { num: '04', title: 'Enjoy The Drive',   desc: 'Sit back, relax and let your professional chauffeur take care of the road.' },
]

// Numbers float to the RIGHT of the arc curve (arc x + clear gap)
const NUM_GAP = 28
function slotPos(offset: number): { x: number; y: number } {
  const rightOf = (y: number) => arcX(y) + NUM_GAP
  if (offset === -1) return { y: Y_TOP,    x: rightOf(Y_TOP) }
  if (offset ===  0) return { y: Y_ACTIVE, x: rightOf(Y_ACTIVE) }
  if (offset === +1) return { y: Y_BOTTOM, x: rightOf(Y_BOTTOM) }
  if (offset <   -1) return { y: Y_OFF_T,  x: 4 }
  return                     { y: Y_OFF_B,  x: 4 }
}

// Tilt angle (degrees) that follows the arc tangent at each slot
// Top: arc heads down-right → number leans clockwise (+)
// Active: tangent is straight down → 0°
// Bottom: arc heads down-left → number leans counter-clockwise (−)
function slotRotate(offset: number): number {
  if (offset === -1) return  22
  if (offset ===  0) return  0
  if (offset === +1) return -22
  return offset < -1 ? 22 : -22
}

export function HowItWorksSection() {
  const [active, setActive] = useState(1)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: "url('/how-it-works-bg.png')" }} />
      <div className="absolute inset-0" style={{ background: 'rgba(22,72,216,0.88)' }} />

      <div className="relative z-10 flex min-h-[500px] w-full items-center gap-8 px-10 py-16 xl:gap-14 xl:px-20">

        {/* ── LEFT TEXT ─────────────────────────────────── */}
        <motion.div
          className="flex w-2/5 shrink-0 flex-col"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, ease }}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-white/50" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/80">
              Travel Your Way
            </span>
            <span className="h-px w-8 bg-white/50" />
          </div>

          <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Luxury, Made Effortless
          </h2>

          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">
            From the first booking to your final destination, enjoy a chauffeur
            experience shaped around your schedule. We take care of the journey,
            so you can focus on what matters most.
          </p>

          <div className="mt-8">
            <button
              className="inline-flex items-center gap-3 rounded-full py-1 pl-1 pr-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
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
            </button>
          </div>
        </motion.div>

        {/* ── RIGHT: FROSTED SHELL + WHITE CARD ─────────── */}
        <motion.div
          className="flex flex-1 items-center justify-end"
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          {/* Frosted glass frame */}
          <div
            className="w-full rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.13)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            {/* White card */}
            <div
              className="relative flex w-full overflow-hidden rounded-xl bg-white"
              style={{ height: CARD_H }}
            >

              {/* ── ARC COLUMN: arc curve + numbers to its right ── */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{ width: COL_W, height: CARD_H }}
              >
                {/* Fixed arc SVG + indicator circles ON the arc */}
                <svg
                  width={COL_W}
                  height={CARD_H}
                  viewBox={`0 0 ${COL_W} ${CARD_H}`}
                  className="pointer-events-none absolute inset-0"
                >
                  {/* Half-ellipse arc: top-left → bow right → bottom-left */}
                  <path
                    d={`M 0 0 C ${ARC_CP} 0, ${ARC_CP} ${CARD_H}, 0 ${CARD_H}`}
                    fill="none"
                    stroke="#d8d8d8"
                    strokeWidth="1.5"
                  />

                  {/* Circle indicators ON the arc — only where a step exists */}
                  {active > 0 && (
                    <circle cx={arcX(Y_TOP)}    cy={Y_TOP}    r={3.5} fill="#c8c8c8" />
                  )}
                  <circle   cx={arcX(Y_ACTIVE)} cy={Y_ACTIVE} r={5.5} fill={BLUE}    />
                  {active < STEPS.length - 1 && (
                    <circle cx={arcX(Y_BOTTOM)} cy={Y_BOTTOM} r={3.5} fill="#c8c8c8" />
                  )}
                </svg>

                {/* Animated step numbers — sit to the RIGHT of the arc */}
                {STEPS.map((s, i) => {
                  const offset    = i - active
                  const pos       = slotPos(offset)
                  const isActive  = offset === 0
                  const isVisible = Math.abs(offset) === 1

                  const rotate = slotRotate(offset)

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

              {/* ── DIVIDER — limited height, centred vertically ── */}
              <div
                className="shrink-0 self-center rounded-full"
                style={{ width: 1.5, height: '38%', background: '#e2e2e2' }}
              />

              {/* ── CONTENT: text + car + watermark ────────────── */}
              <div className="relative flex flex-1 flex-col items-start justify-center overflow-hidden px-7 py-6">

                {/* Mask-group watermark — large, behind the car */}
                <div
                  className="pointer-events-none absolute right-0 bottom-0"
                  style={{ width: '100%', height: '100%' }}
                >
                  <Image
                    src="/mask-group.png"
                    alt=""
                    fill
                    className="object-contain object-right-bottom"
                    style={{ opacity: 0.30 }}
                    unoptimized
                  />
                </div>

                {/* Car — on top of watermark */}
                <div
                  className="pointer-events-none absolute right-0 bottom-0"
                  style={{ width: 260, height: 160 }}
                >
                  <Image
                    src="/car-hero.png"
                    alt="Luxury chauffeur car"
                    fill
                    className="object-contain object-right-bottom drop-shadow-lg"
                    priority
                  />
                </div>

                {/* Step title + description — vertically centred, fade on change */}
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="relative z-10 max-w-[200px]"
                >
                  <h3 className="text-[17px] font-bold leading-snug text-gray-900">
                    {STEPS[active].title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-gray-500">
                    {STEPS[active].desc}
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
