"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

interface ChauffeurPromoCarProps {
  src: string;
  alt: string;
}

const DRIVE_DURATION = 2200;
const BODY_DURATION = 3200;
// Ease-out quad: constant deceleration, like a car braking to a stop.
const DRIVE_EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Wheel contact points as a fraction of the car image (front-left three-quarter view).
const REAR_WHEEL = { x: 0.8, y: 0.86 };
const FRONT_WHEEL = { x: 0.49, y: 0.9 };

function buildBodyKeyframes(): Keyframe[] {
  const frames: Keyframe[] = [];
  const steps = 140;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ms = t * BODY_DURATION;
    let pitch: number;
    let jitter = 0;
    if (ms < DRIVE_DURATION) {
      const speed = 1 - ms / DRIVE_DURATION;
      const dive = Math.min(1, ms / 280);
      pitch = -1.8 * dive * dive * (3 - 2 * dive);
      jitter = Math.sin(ms * 0.08) * 1.6 * speed * speed;
    } else {
      const s = (ms - DRIVE_DURATION) / (BODY_DURATION - DRIVE_DURATION);
      pitch = -1.8 * Math.cos(s * Math.PI * 3) * Math.exp(-s * 4.5);
    }
    frames.push({
      transform: `translateY(${jitter.toFixed(2)}px) rotate(${pitch.toFixed(3)}deg)`,
      offset: t,
    });
  }
  return frames;
}

function spawnPuff(
  layer: HTMLElement,
  x: number,
  y: number,
  size: number,
  opacity: number,
  driftX: number,
  rise: number,
  grow: number,
  duration: number,
) {
  if (layer.childElementCount > 80) return;
  const el = document.createElement("span");
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size * 0.72}px;border-radius:9999px;pointer-events:none;will-change:transform,opacity;filter:blur(4px);background:radial-gradient(closest-side, rgba(236,240,246,0.95) 0%, rgba(168,179,198,0.7) 50%, rgba(140,152,172,0) 100%);`;
  layer.appendChild(el);
  const anim = el.animate(
    [
      { transform: "translate(-50%, -50%) scale(0.25)", opacity: 0 },
      { opacity, offset: 0.18 },
      {
        transform: `translate(calc(-50% + ${driftX}px), calc(-50% - ${rise}px)) scale(${grow})`,
        opacity: 0,
      },
    ],
    { duration, easing: "cubic-bezier(0.2, 0.65, 0.3, 1)", fill: "forwards" },
  );
  anim.onfinish = () => el.remove();
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function ChauffeurPromoCar({ src, alt }: ChauffeurPromoCarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mover = moverRef.current;
    const body = bodyRef.current;
    const smoke = smokeRef.current;
    if (!root || !mover || !body || !smoke) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      return;
    }

    mover.style.opacity = "0";

    let visible = false;
    let playing = false;
    let played = false;
    let raf = 0;
    let driveAnim: Animation | null = null;
    let bodyAnim: Animation | null = null;
    let beepAnim: Animation | null = null;

    const reset = () => {
      cancelAnimationFrame(raf);
      driveAnim?.cancel();
      bodyAnim?.cancel();
      beepAnim?.cancel();
      driveAnim = null;
      bodyAnim = null;
      beepAnim = null;
      smoke.replaceChildren();
      mover.style.opacity = "0";
      playing = false;
      played = false;
    };

    const play = () => {
      playing = true;
      played = true;

      const moverRect = mover.getBoundingClientRect();
      const startX = window.innerWidth - moverRect.left + 40;
      const vMax = (2 * startX) / DRIVE_DURATION;

      mover.style.opacity = "1";
      driveAnim = mover.animate(
        [
          { transform: `translateX(${startX}px)`, filter: "blur(7px)", offset: 0 },
          { filter: "blur(2px)", offset: 0.25 },
          { transform: "translateX(0px)", filter: "blur(0px)", offset: 1 },
        ],
        { duration: DRIVE_DURATION, easing: DRIVE_EASING, fill: "both" },
      );
      bodyAnim = body.animate(buildBodyKeyframes(), {
        duration: BODY_DURATION,
        easing: "linear",
        fill: "both",
      });

      const startedAt = performance.now();
      let lastLeft = moverRect.left + startX;
      let lastTime = startedAt;
      let rearCarry = 0;
      let frontTimer = 0;

      const tick = (now: number) => {
        const rect = mover.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        const dx = Math.max(0, lastLeft - rect.left);
        const dt = Math.max(1, now - lastTime);
        const sf = Math.min(1, dx / dt / vMax);
        lastLeft = rect.left;
        lastTime = now;

        const rearX = rect.left + rect.width * REAR_WHEEL.x - rootRect.left;
        const rearY = rect.height * REAR_WHEEL.y;
        const frontX = rect.left + rect.width * FRONT_WHEEL.x - rootRect.left;
        const frontY = rect.height * FRONT_WHEEL.y;

        rearCarry += dx;
        while (rearCarry >= 18 && sf > 0.03) {
          rearCarry -= 18;
          spawnPuff(
            smoke,
            rearX + rand(-6, 14),
            rearY + rand(-8, 6),
            rand(90, 150) * (0.7 + sf * 0.6),
            0.55 + sf * 0.35,
            rand(70, 170) * (0.6 + sf),
            rand(40, 110),
            rand(2.6, 4.4),
            rand(1400, 2200),
          );
        }

        const progress = (now - startedAt) / DRIVE_DURATION;
        frontTimer += dt;
        if (progress > 0.18 && sf > 0.02 && sf < 0.55 && frontTimer > 55) {
          frontTimer = 0;
          spawnPuff(
            smoke,
            frontX + rand(-10, 10),
            frontY + rand(-4, 6),
            rand(110, 170),
            0.65,
            rand(70, 170),
            rand(20, 70),
            rand(2.6, 4.4),
            rand(1500, 2300),
          );
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      driveAnim.finished
        .then(() => {
          cancelAnimationFrame(raf);
          const rect = mover.getBoundingClientRect();
          const rootRect = root.getBoundingClientRect();
          const wheels = [REAR_WHEEL, FRONT_WHEEL];
          for (const w of wheels) {
            for (let i = 0; i < 4; i++) {
              spawnPuff(
                smoke,
                rect.left + rect.width * w.x - rootRect.left + rand(-14, 14),
                rect.height * w.y + rand(-4, 6),
                rand(110, 170),
                0.55,
                rand(50, 170),
                rand(25, 90),
                rand(2.8, 4.8),
                rand(1700, 2600),
              );
            }
          }
          playing = false;
          if (!visible) window.setTimeout(reset, 2400);
        })
        .catch(() => {});

      bodyAnim.finished
        .then(() => {
          if (!body || !visible) return;
          // Clear the fill-frozen WAAPI state
          bodyAnim?.cancel();
          /*
           * Double-beep idle pulse — mimics pressing a car key fob:
           * two quick bounces, then a long pause before repeating.
           * scale + tiny vertical lift gives a "chirp" feel.
           */
          beepAnim = body.animate(
            [
              { transform: "scale(1) translateY(0px)",     offset: 0    },
              { transform: "scale(1.045) translateY(-4px)", offset: 0.07 },
              { transform: "scale(0.97) translateY(2px)",  offset: 0.16 },
              { transform: "scale(1.02) translateY(-1px)", offset: 0.22 },
              { transform: "scale(1) translateY(0px)",     offset: 0.30 },
              // second beep
              { transform: "scale(1.045) translateY(-4px)", offset: 0.40 },
              { transform: "scale(0.97) translateY(2px)",  offset: 0.49 },
              { transform: "scale(1.02) translateY(-1px)", offset: 0.55 },
              { transform: "scale(1) translateY(0px)",     offset: 0.63 },
              // rest until next cycle
              { transform: "scale(1) translateY(0px)",     offset: 1    },
            ],
            {
              duration: 3200,
              easing: "ease-in-out",
              iterations: Infinity,
              delay: 400,
            },
          );
        })
        .catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.45 && !playing && !played) play();
        else if (!entry.isIntersecting && !playing) reset();
      },
      { threshold: [0, 0.45] },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      driveAnim?.cancel();
      bodyAnim?.cancel();
      beepAnim?.cancel();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto mt-2 w-full max-w-[460px] sm:mt-3 sm:max-w-[560px] lg:max-w-[680px]"
    >
      <div ref={moverRef} className="relative will-change-transform">
        <div
          aria-hidden
          className="absolute inset-x-[7%] bottom-[3%] h-[9%] rounded-[50%] bg-black/45 blur-lg"
        />
        <div ref={bodyRef} className="origin-[50%_88%] will-change-transform">
          <Image
            src={src}
            alt={alt}
            width={1088}
            height={385}
            priority
            className="relative h-auto w-full drop-shadow-2xl"
          />
        </div>
      </div>
      <div
        ref={smokeRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
      />
    </div>
  );
}
