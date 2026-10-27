"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { User, Briefcase, ChevronLeft, ChevronRight, ChevronsUpDown, Check } from "lucide-react";
import { FLEET2, calculatePrice2, type ServiceType2, type Vehicle2, type VehicleTier2 } from "@/lib/booking2";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedVehicle = FLEET2.find((v) => v.id === selectedVehicleId) || FLEET2[0];

  // Which card the slider is currently showing (drives the dots below it).
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = containerRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    const step = first.offsetWidth + gap;
    const max = el.scrollWidth - el.clientWidth;
    // At the very end the last card is shown even if it can't reach the left edge.
    const index = el.scrollLeft >= max - 2 ? FLEET2.length - 1 : Math.round(el.scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(FLEET2.length - 1, index)));
  };

  const goToCard = (index: number) => {
    const el = containerRef.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    const left = card.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft;
    el.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1330] sm:text-2xl">Select Your Vehicle</h2>
        <span className="rounded-full bg-[#1648D8]/8 px-3 py-1 text-xs font-medium text-[#1648D8]">
          Multiple vehicle classes available
        </span>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth sm:gap-5"
      >
        {FLEET2.map((vehicle) => {
          const isSelected = vehicle.id === selectedVehicleId;
          const priceCalc = calculatePrice2(serviceType, vehicle, { distanceKm, durationHours });

          return (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id)}
              className={`group flex w-[280px] shrink-0 cursor-pointer snap-start flex-col justify-between rounded-2xl border bg-white p-3 shadow-sm transition-all sm:w-[310px] sm:p-3.5 ${
                isSelected ? "border-[#1648D8] shadow-md ring-1 ring-[#1648D8]/25" : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div>
                <div className="relative mb-3 aspect-[9/10] overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  <Image
                    src={vehicle.image.replace("-1.webp", "-1-card.webp")}
                    alt={vehicle.name}
                    fill
                    sizes="310px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
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

      <div className="mt-4 flex items-center justify-between px-1">
        <button
          onClick={() => scroll("left")}
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
          onClick={() => scroll("right")}
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
