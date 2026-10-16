"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";

const CARDS = [
  { src: "/about/driver-smile.jpg",   alt: "Professional driver smiling" },
  { src: "/about/driver-luggage.jpg", alt: "Driver assisting with luggage" },
  { src: "/about/passenger.jpg",      alt: "Passenger enjoying the journey" },
  { src: "/about/car-door.jpg",       alt: "Driver opening car door" },
  { src: "/about/driver-suit.jpg",    alt: "Smartly dressed driver" },
];

// ─── Cylinder geometry ────────────────────────────────────────────────────────
const TOTAL        = CARDS.length;          // 5
const ANGLE_STEP   = 72;                    // 360° ÷ 5 cards = evenly fills the full circle
const RADIUS       = 340;                   // cylinder radius — smaller = cards closer together
const PERSPECTIVE  = 3200;                  // very high = almost flat, organised look
const CARD_W       = 188;                   // card width  (px)
const CARD_H       = 360;                   // card height (px)
const TILT_X       = -1;                    // barely any top-down tilt
const CENTER_IDX   = Math.floor(TOTAL / 2); // 2
// Shadow: same width as card, reaches exactly 20% of card height downward
// box-shadow offset + blur ≈ CARD_H * 0.2 = 58px
const SHADOW_REACH = Math.round(CARD_H * 0.1); // 29px offset + 29px blur = 58px ≈ 20%

export function AboutCarousel() {
  // `rotation` is the Y-rotation of the entire cylinder — dragging/clicking shifts it
  const [rotation, setRotation] = useState(0);

  // Drag state
  const dragStart   = useRef<number | null>(null);
  const dragOrigin  = useRef(0);
  const hasDragged  = useRef(false);
  const clickTarget = useRef<number | null>(null);

  // Bring card i to the front of the cylinder
  const focusCard = useCallback((i: number) => {
    const cardAngle = (i - CENTER_IDX) * ANGLE_STEP;
    setRotation(-cardAngle);
  }, []);

  // Auto-advance every 3.5 s; pause while dragging
  const autoRef = useRef(0);
  useEffect(() => {
    const tick = () => {
      if (dragStart.current !== null) return;
      autoRef.current = (autoRef.current + 1) % TOTAL;
      focusCard(autoRef.current);
    };
    const id = setInterval(tick, 3500);
    return () => clearInterval(id);
  }, [focusCard]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current  = e.clientX;
    dragOrigin.current = rotation;
    hasDragged.current = false;
    // Record which card (if any) was the original press target
    const cardEl = (e.target as HTMLElement).closest('[data-card-index]') as HTMLElement | null;
    clickTarget.current = cardEl ? parseInt(cardEl.dataset.cardIndex!, 10) : null;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [rotation]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    if (Math.abs(e.clientX - dragStart.current) > 5) hasDragged.current = true;
    const delta = (e.clientX - dragStart.current) * 0.25;
    setRotation(dragOrigin.current + delta);
  }, []);

  const onPointerUp = useCallback(() => {
    dragStart.current = null;
    if (!hasDragged.current && clickTarget.current !== null) {
      // Tap on a card — bring it to front
      focusCard(clickTarget.current);
    } else {
      // Drag ended — snap to nearest card
      const snapped = Math.round(rotation / ANGLE_STEP) * ANGLE_STEP;
      setRotation(snapped);
    }
    clickTarget.current = null;
  }, [rotation, focusCard]);

  return (
    <div
      // Perspective must live on the *parent* of the preserve-3d element
      className="relative mx-auto select-none overflow-visible"
      style={{ width: "100%", height: CARD_H + 80, perspective: PERSPECTIVE }}
    >
      {/* Cylinder stage — preserve-3d so children truly live in 3D space */}
      <div
        className="absolute left-1/2 top-0 cursor-grab active:cursor-grabbing"
        style={{
          width: 0,
          height: CARD_H,
          transformStyle: "preserve-3d",
          // rotation = user-controlled spin; TILT_X = subtle top-down camera angle
          transform: `translateX(0) rotateX(${TILT_X}deg) rotateY(${rotation}deg)`,
          transition: dragStart.current !== null ? "none" : "transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {CARDS.map((card, i) => {
          // Each card's fixed angle on the cylinder
          const cardAngle = (i - CENTER_IDX) * ANGLE_STEP;
          // How close is this card to facing the camera after user rotation?
          const effectiveAngle = ((cardAngle + rotation) % 360 + 360) % 360;
          const distFromFront = Math.min(effectiveAngle, 360 - effectiveAngle);
          const isFront = distFromFront < ANGLE_STEP / 2;

          return (
            <div
              key={card.src}
              data-card-index={i}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: CARD_W,
                marginLeft: -CARD_W / 2,
                cursor: isFront ? "grab" : "pointer",
                // Place card on cylinder surface: rotate around Y, then push out along card's own Z
                transform: `rotateY(${cardAngle}deg) translateZ(${RADIUS}px)`,
                opacity: 1,
              }}
            >
              <div
                className="overflow-hidden rounded-2xl"
                style={{
                  // Shadow: full card width (no spread tweak), reaches 20% of card height downward
                  boxShadow: `0 ${SHADOW_REACH}px ${SHADOW_REACH}px 0px rgba(0,0,0,0.18)`,
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={CARD_W}
                  height={CARD_H}
                  className="block object-cover"
                  draggable={false}
                  priority={i === CENTER_IDX}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
