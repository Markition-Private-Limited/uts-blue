"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User, Briefcase, ChevronLeft, ChevronRight, ChevronsUpDown, Check } from "lucide-react";
import { FLEET2, calculatePrice2, type ServiceType2, type Vehicle2, type VehicleTier2 } from "@/lib/booking2";

const SETTLE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const RUBBER_BAND = 0.35;
const DRAG_THRESHOLD = 5;

export function VehicleSelector2({
  selectedVehicleId,
  onSelectVehicle,
  serviceType,
  distanceKm,
  durationHours,
}: {
  selectedVehicleId: VehicleTier2;
  onSelectVehicle: (id: VehicleTier2) => void;
  serviceType: ServiceType2;
  distanceKm: number;
  durationHours: number;
}) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const selectedVehicle = FLEET2.find((v) => v.id === selectedVehicleId) || FLEET2[0];

  // Which card the slider is currently showing (drives the dots below it).
  const [activeIndex, setActiveIndex] = useState(0);

  // Card width computed so exactly 3 fit in the viewport at once.
  const GAP_PX = 16;
  const [cardWidth, setCardWidth] = useState(280);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0); // current translateX target (<= 0)
  const drag = useRef({
    pointerId: -1,
    down: false,
    dragging: false,
    startX: 0,
    startY: 0,
    startOffset: 0,
    startSnap: 0,
    samples: [] as { t: number; x: number }[],
    suppressClick: false,
  });

  // Track geometry: how far it can travel, and the resting offset for each card.
  const metrics = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return { max: 0, cards: [] as number[], snaps: [0] };
    const max = Math.max(0, track.offsetWidth - viewport.clientWidth);
    const cards = Array.from(track.children).map((c) => -Math.min((c as HTMLElement).offsetLeft, max));
    const snaps = Array.from(new Set(cards)).sort((a, b) => b - a);
    return { max, cards, snaps };
  }, []);

  const apply = (x: number, animate: boolean, duration = 450) => {
    const track = trackRef.current;
    if (!track) return;
    offsetRef.current = x;
    track.style.transition = animate ? `transform ${duration}ms ${SETTLE_EASE}` : "none";
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };

  const indexForOffset = useCallback(
    (x: number) => {
      const { max, cards } = metrics();
      if (max > 0 && -x >= max - 2) return FLEET2.length - 1;
      let best = 0;
      cards.forEach((pos, i) => {
        if (Math.abs(pos - x) < Math.abs(cards[best] - x)) best = i;
      });
      return best;
    },
    [metrics],
  );

  const settleTo = (x: number, duration = 450) => {
    apply(x, true, duration);
    setActiveIndex(indexForOffset(x));
  };

  // Where the track is right now, even if it's mid-animation.
  const currentX = () => {
    const track = trackRef.current;
    if (!track) return 0;
    return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
  };

  const nearestSnapIndex = (x: number, snaps: number[]) => {
    let best = 0;
    snaps.forEach((pos, i) => {
      if (Math.abs(pos - x) < Math.abs(snaps[best] - x)) best = i;
    });
    return best;
  };

  const step = (direction: 1 | -1) => {
    const { snaps } = metrics();
    const x = currentX();
    const i = nearestSnapIndex(x, snaps);
    const atSnap = Math.abs(snaps[i] - x) < 2;
    let target = i;
    if (direction === 1) target = atSnap ? i + 1 : snaps[i] < x ? i : i + 1;
    else target = atSnap ? i - 1 : snaps[i] > x ? i : i - 1;
    settleTo(snaps[Math.max(0, Math.min(snaps.length - 1, target))]);
  };

  const goToCard = (index: number) => {
    const { cards } = metrics();
    if (cards[index] === undefined) return;
    apply(cards[index], true, 500);
    setActiveIndex(index);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const d = drag.current;
    const x = currentX();
    apply(x, false); // catch the track wherever the last animation left it
    const { snaps } = metrics();
    d.down = true;
    d.dragging = false;
    d.suppressClick = false;
    d.pointerId = e.pointerId;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.startOffset = x;
    d.startSnap = nearestSnapIndex(x, snaps);
    d.samples = [{ t: e.timeStamp, x: e.clientX }];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const viewport = viewportRef.current;
    if (!d.down || !viewport || e.pointerId !== d.pointerId) return;

    const dx = e.clientX - d.startX;
    if (!d.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      // A mostly-vertical gesture belongs to the page, not the carousel.
      if (Math.abs(e.clientY - d.startY) > Math.abs(dx)) {
        d.down = false;
        return;
      }
      d.dragging = true;
      viewport.setPointerCapture(e.pointerId);
      viewport.style.cursor = "grabbing";
    }

    const { max } = metrics();
    let x = d.startOffset + dx;
    // Resist, rather than stop dead, when pulled past either end.
    if (x > 0) x *= RUBBER_BAND;
    else if (x < -max) x = -max + (x + max) * RUBBER_BAND;
    apply(x, false);

    const now = e.timeStamp;
    d.samples.push({ t: now, x: e.clientX });
    while (d.samples.length > 2 && now - d.samples[0].t > 100) d.samples.shift();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const viewport = viewportRef.current;
    if (!d.down || e.pointerId !== d.pointerId) return;
    d.down = false;
    if (!d.dragging || !viewport) return;
    d.dragging = false;
    d.suppressClick = true;
    viewport.style.cursor = "";
    if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);

    const { max, snaps } = metrics();
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const dt = Math.max(1, last.t - first.t);
    const velocity = (last.x - first.x) / dt; // px per ms, negative = dragging left

    // Where a flick would carry it, then snap to the nearest card from there.
    const x = offsetRef.current;
    const cardStep = snaps.length > 1 ? snaps[0] - snaps[1] : 0;
    const carry = Math.max(-cardStep * 2, Math.min(cardStep * 2, velocity * 320));
    const projected = Math.max(-max, Math.min(0, x + carry));
    let target = nearestSnapIndex(projected, snaps);

    // A deliberate drag always advances at least one card in the drag direction.
    const dx = e.clientX - d.startX;
    if (target === d.startSnap && Math.abs(dx) > 40) {
      target = Math.max(0, Math.min(snaps.length - 1, d.startSnap + (dx < 0 ? 1 : -1)));
    }

    const speed = Math.abs(velocity);
    settleTo(snaps[target], speed > 1 ? 650 : 480);
  };

  // A drag ends in a click on whatever's underneath — don't let it select a card.
  const handleClickCapture = (e: React.MouseEvent) => {
    if (drag.current.suppressClick) {
      e.stopPropagation();
      e.preventDefault();
      drag.current.suppressClick = false;
    }
  };

  // Keep the track inside its bounds and recompute card widths when layout changes.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(() => {
      const vpw = viewport.clientWidth;
      // Show 3 cards on wide screens, 2 on narrow, minimum 200px per card.
      const perRow = vpw >= 600 ? 3 : 2;
      setCardWidth(Math.max(200, Math.floor((vpw - (perRow - 1) * GAP_PX) / perRow)));
      const { max } = metrics();
      const x = Math.max(-max, Math.min(0, offsetRef.current));
      apply(x, false);
      setActiveIndex(indexForOffset(x));
    });
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [metrics, indexForOffset]);

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1330] sm:text-2xl">Select Your Vehicle</h2>
        <span className="rounded-full bg-[#1648D8]/8 px-3 py-1 text-xs font-medium text-[#1648D8]">
          Multiple vehicle classes available
        </span>
      </div>

      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
        style={{ touchAction: "pan-y" }}
        className="w-full cursor-grab select-none overflow-hidden pb-4 pt-1"
      >
        <div ref={trackRef} className="relative flex w-max will-change-transform" style={{ gap: GAP_PX }}>
          {FLEET2.map((vehicle) => {
            const isSelected = vehicle.id === selectedVehicleId;
            const priceCalc = calculatePrice2(serviceType, vehicle, { distanceKm, durationHours });

            return (
              <div
                key={vehicle.id}
                onClick={() => onSelectVehicle(vehicle.id)}
                style={{ width: cardWidth }}
                className={`group flex shrink-0 cursor-pointer flex-col justify-between rounded-2xl border bg-white p-3 shadow-sm transition-all sm:p-3.5 ${
                  isSelected ? "border-[#1648D8] shadow-md ring-1 ring-[#1648D8]/25" : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="relative mb-3 aspect-[9/10] overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <Image
                      src={vehicle.image.replace("-1.webp", "-1-card.webp")}
                      alt={vehicle.name}
                      fill
                      sizes="33vw"
                      draggable={false}
                      className="pointer-events-none select-none object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    {isSelected && (
                      <div className="absolute right-2.5 top-2.5 rounded-full bg-[#1648D8] p-1 text-white shadow">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <h3 className="text-base font-bold tracking-tight text-[#0B1330]">{vehicle.name}</h3>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{vehicle.modelExample}</p>
                  </div>

                  <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex flex-col">
                      {priceCalc.total !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold tracking-tight text-[#0B1330] sm:text-xl">
                            £{priceCalc.total.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-normal text-slate-400">est.</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-700">Price to be confirmed</span>
                      )}
                      <span className="text-[10px] text-slate-400">{priceCalc.rateLabel}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1" title={`${vehicle.passengers} passengers`}>
                        <User className="h-3.5 w-3.5" /> {vehicle.passengers}
                      </span>
                      <span className="flex items-center gap-1" title={`${vehicle.luggage} bags`}>
                        <Briefcase className="h-3.5 w-3.5" /> {vehicle.luggage}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVehicle(vehicle.id);
                  }}
                  className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold transition-all hover:-translate-y-0.5 ${
                    isSelected ? "bg-[#1648D8] text-white shadow hover:bg-[#1E4FD9] hover:shadow-lg" : "bg-slate-100 text-[#0B1330] hover:bg-slate-200"
                  }`}
                >
                  {isSelected ? `Selected: ${vehicle.name}` : `Select ${vehicle.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1">
        <button
          onClick={() => step(-1)}
          aria-label="Previous vehicles"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1648D8] text-white shadow-sm transition-all hover:-translate-y-0.5 hover:scale-105 hover:bg-[#1E4FD9] hover:shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {FLEET2.map((v, i) => (
            <button
              key={v.id}
              onClick={() => {
                goToCard(i);
                onSelectVehicle(v.id);
              }}
              aria-label={`Go to ${v.name}`}
              aria-current={i === activeIndex}
              className={`no-fill h-1.5 rounded-full transition-all duration-300 hover:scale-125 ${
                i === activeIndex ? "w-5 bg-[#1648D8]" : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => step(1)}
          aria-label="Next vehicles"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1648D8] text-white shadow-sm transition-all hover:-translate-y-0.5 hover:scale-105 hover:bg-[#1E4FD9] hover:shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 pt-2">
        <button
          onClick={() => setDetailsExpanded((v) => !v)}
          className="inline-flex items-center gap-2 py-1 text-xs font-semibold text-[#0B1330] transition-all hover:-translate-y-0.5 hover:text-[#1648D8]"
        >
          <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
          <span>{detailsExpanded ? `Hide ${selectedVehicle.name} details` : `Explore ${selectedVehicle.name} details`}</span>
        </button>

        {detailsExpanded && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-1 font-bold text-[#0B1330]">Vehicle Specifications</h4>
                <p className="mb-2 leading-relaxed text-slate-600">{selectedVehicle.description}</p>
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Passenger Capacity:</span> Up to {selectedVehicle.passengers} guests
                  <br />
                  <span className="font-semibold text-slate-700">Luggage Allowance:</span> Up to {selectedVehicle.luggage} standard cases
                </div>
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#0B1330]">Standard Inclusions & Comfort</h4>
                <ul className="space-y-1 text-slate-600">
                  {selectedVehicle.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1648D8]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export type { Vehicle2 };
