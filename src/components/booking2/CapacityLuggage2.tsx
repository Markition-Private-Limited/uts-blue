"use client";

import { useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { getLuggageImage, type Vehicle2 } from "@/lib/booking2";

const LUGGAGE_OPTIONS = [
  { id: "carry-on" as const, label: "2 × Carry-on", subtitle: "Cabin bags (up to 55 × 40 × 20 cm)" },
  { id: "check-in" as const, label: "2 × Check-in", subtitle: "Standard checked suitcases (up to 23 kg)" },
  { id: "large" as const, label: "1 × Large Check-in", subtitle: "Oversized / heavy luggage (up to 32 kg)" },
];

export function CapacityLuggage2({
  selectedVehicle,
  currentLuggageType,
  onLuggageTypeChange,
}: {
  selectedVehicle: Vehicle2;
  currentLuggageType: "carry-on" | "check-in" | "large";
  onLuggageTypeChange: (type: "carry-on" | "check-in" | "large") => void;
}) {
  const [activeTab, setActiveTab] = useState<"seating" | "luggage">("luggage");

  return (
    <section className="mb-14 border-t border-slate-200 pt-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1330] sm:text-2xl">Capacity & Luggage</h2>

        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("seating")}
            className={`rounded-md px-3 py-1.5 transition-all hover:-translate-y-0.5 ${
              activeTab === "seating" ? "bg-[#1648D8] text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-[#0B1330]"
            }`}
          >
            Seating
          </button>
          <button
            onClick={() => setActiveTab("luggage")}
            className={`rounded-md px-3 py-1.5 transition-all hover:-translate-y-0.5 ${
              activeTab === "luggage" ? "bg-[#1648D8] text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-[#0B1330]"
            }`}
          >
            Luggage
          </button>
        </div>
      </div>

      <p className="mb-6 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">
        Select a luggage configuration to visualise how your bags may fit. All passenger and luggage capacities shown are
        indicative only and subject to confirmation with UTS before booking.
      </p>

      {activeTab === "luggage" ? (
        <>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {LUGGAGE_OPTIONS.map((opt) => {
              const isSelected = currentLuggageType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onLuggageTypeChange(opt.id)}
                  className={`rounded-xl border px-4 py-2.5 text-center text-xs font-semibold transition-all hover:-translate-y-0.5 sm:text-sm ${
                    isSelected
                      ? "border-[#1648D8] bg-[#1648D8] text-white shadow-sm hover:shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="relative aspect-[1024/374] overflow-hidden rounded-2xl bg-[#050B22] shadow-md">
            <Image
              key={`${selectedVehicle.id}-${currentLuggageType}`}
              src={getLuggageImage(selectedVehicle.id, currentLuggageType)}
              alt={`${selectedVehicle.name} luggage capacity — ${LUGGAGE_OPTIONS.find((o) => o.id === currentLuggageType)?.label}`}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B22]/80 via-[#050B22]/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-[#050B22]/50 px-4 py-2.5 text-xs text-white backdrop-blur-sm">
              <div>
                <span className="font-semibold">{selectedVehicle.name} Luggage Volume</span>
                <p className="text-[11px] text-slate-300">
                  {LUGGAGE_OPTIONS.find((o) => o.id === currentLuggageType)?.subtitle}
                </p>
              </div>
              <span className="rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
                Max {selectedVehicle.luggage} Standard Bags
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1648D8] text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1330]">{selectedVehicle.name} Seating Arrangement</h3>
              <p className="text-xs text-slate-500">Maximum comfortable capacity: {selectedVehicle.passengers} passengers</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 text-xs text-slate-600 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="mb-1 block font-bold text-[#0B1330]">Cabin Configuration</span>
              <p>
                {selectedVehicle.id === "first-class-van" || selectedVehicle.id === "van"
                  ? "Conference or forward-facing club seating with generous legroom."
                  : "Individual executive rear seats with armrest controls and footwells."}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="mb-1 block font-bold text-[#0B1330]">Child Seats & Boosters</span>
              <p>ISOFIX points available upon request. Please specify requirements in booking notes.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="mb-1 block font-bold text-[#0B1330]">Accessibility</span>
              <p>Wide-opening doors and kerb-level step coordination provided by chauffeur.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
