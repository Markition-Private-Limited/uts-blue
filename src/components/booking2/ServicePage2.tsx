"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Clock, Calendar } from "lucide-react";
import { FLEET2, type BookingState2, type ServiceType2, type Vehicle2 } from "@/lib/booking2";
import { VehicleSelector2 } from "./VehicleSelector2";
import { ShowcaseCarousel2 } from "./ShowcaseCarousel2";
import { WhatsIncluded2 } from "./WhatsIncluded2";
import { CapacityLuggage2 } from "./CapacityLuggage2";
import { PriceBreakdown2 } from "./PriceBreakdown2";

const COPY: Record<
  ServiceType2,
  { eyebrow?: string; title: string; description: string; itinerary?: { heading: string; description: string; badge: string; pickupLabel: string; stopsLabel: string; emptyStops: string; addPlaceholder: string; durationMax: number } }
> = {
  "airport-transfer": {
    eyebrow: "UTS Executive Service · London Airport Transfer",
    title: "Your Airport Transfer, Elevated.",
    description:
      "Experience a seamless airport journey with professional chauffeurs, premium vehicles, and carefully coordinated pickups across London.",
  },
  "day-booking": {
    eyebrow: "UTS Executive Service · London Day Chauffeur",
    title: "Your Day, Driven Around You.",
    description:
      "Enjoy the freedom of a dedicated chauffeur for business meetings, private appointments, shopping, and special occasions across London.",
    itinerary: {
      heading: "Day Itinerary & Planned Stops",
      description: "Specify your key appointments or leave the itinerary flexible. Your chauffeur is at your disposal.",
      badge: "Hours Dedicated",
      pickupLabel: "Starting Pickup Address",
      stopsLabel: "Planned Appointments / Intermediate Stops",
      emptyStops: "No intermediate stops added yet. You may add specific destinations or guide your chauffeur on the day.",
      addPlaceholder: "Add another stop (e.g. 1 Canada Square, Canary Wharf or Mayfair Dining)",
      durationMax: 14,
    },
  },
  "hourly-chauffeur": {
    eyebrow: "UTS Flexible Hire · By The Hour",
    title: "Your Chauffeur, On Your Schedule.",
    description:
      "Book a private chauffeur by the hour and travel across London with the flexibility, comfort, and professionalism your day deserves.",
    itinerary: {
      heading: "Hourly Service & Flexible Itinerary",
      description: "Enjoy complete freedom without fixed drop-offs. Your chauffeur remains on standby throughout London.",
      badge: "Hours Reserved",
      pickupLabel: "Chauffeur Meet / Pickup Location",
      stopsLabel: "Optional Destinations or Planned Stops",
      emptyStops: "No predetermined stops required. You may direct your chauffeur in real time throughout your booked duration.",
      addPlaceholder: "Add planned stop (e.g. Bond Street Boutiques, Scott's Restaurant)",
      durationMax: 12,
    },
  },
};

export function ServicePage2({
  serviceType,
  state,
  selectedVehicle,
  onSelectVehicle,
  onUpdateState,
}: {
  serviceType: ServiceType2;
  state: BookingState2;
  selectedVehicle: Vehicle2;
  onSelectVehicle: (id: Vehicle2["id"]) => void;
  onUpdateState: (updates: Partial<BookingState2>) => void;
}) {
  const [newStop, setNewStop] = useState("");
  const copy = COPY[serviceType];

  const handleAddStop = () => {
    if (!newStop.trim()) return;
    onUpdateState({ stops: [...state.stops, { id: `stop-${Date.now()}`, address: newStop.trim() }] });
    setNewStop("");
  };
  const handleRemoveStop = (id: string) => onUpdateState({ stops: state.stops.filter((s) => s.id !== id) });

  return (
    <div className="min-w-0 w-full flex-1">
      <div className="mb-10">
        {copy.eyebrow && (
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1648D8]">
            {copy.eyebrow.split(" · ").map((part, i, arr) => (
              <span key={part} className="inline-flex items-center gap-2">
                <span>{part}</span>
                {i < arr.length - 1 && <span>·</span>}
              </span>
            ))}
          </div>
        )}
        <h1
          className="mb-3 text-3xl font-black uppercase tracking-tight leading-tight text-[#0B1330] sm:text-4xl lg:text-[42px]"
          style={{ WebkitTextStroke: "0.6px #0B1330" }}
        >
          {copy.title}
        </h1>
        <p className="max-w-2xl text-sm font-normal leading-relaxed text-slate-600 sm:text-base">{copy.description}</p>
      </div>

      <VehicleSelector2
        selectedVehicleId={state.selectedVehicleId}
        onSelectVehicle={onSelectVehicle}
        serviceType={serviceType}
        distanceKm={state.sampleDistanceKm}
        durationHours={state.durationHours}
      />

      {copy.itinerary && (
        <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0B1330]">{copy.itinerary.heading}</h2>
              <p className="mt-0.5 text-xs text-slate-500">{copy.itinerary.description}</p>
            </div>
            <span className="rounded-full bg-[#1648D8]/8 px-3 py-1 text-xs font-semibold text-[#1648D8]">
              {state.durationHours} {copy.itinerary.badge}
            </span>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">{copy.itinerary.pickupLabel}</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                type="text"
                value={state.pickupAddress}
                onChange={(e) => onUpdateState({ pickupAddress: e.target.value })}
                className="w-full bg-transparent text-xs font-medium text-[#0B1330] focus:outline-none sm:text-sm"
                placeholder="e.g. The Langham, 1c Portland Place, London"
              />
            </div>
          </div>

          <div className="mb-5 space-y-2.5">
            <label className="block text-[11px] font-bold uppercase text-slate-500">{copy.itinerary.stopsLabel}</label>

            {state.stops.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500">
                {copy.itinerary.emptyStops}
              </div>
            ) : (
              state.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 truncate">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1648D8] text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="truncate font-medium text-[#0B1330]">{stop.address}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveStop(stop.id)}
                    className="p-1 text-slate-400 transition-all hover:scale-110 hover:text-red-500"
                    title="Remove stop"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder={copy.itinerary.addPlaceholder}
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStop();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-[#0B1330] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4FD9] sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1648D8] px-4 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E4FD9] hover:shadow-md"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Stop</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-3 text-xs sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Pickup Date & Time</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <Calendar className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={state.pickupDate}
                  onChange={(e) => onUpdateState({ pickupDate: e.target.value })}
                  className="w-full bg-transparent text-xs font-semibold text-[#0B1330] focus:outline-none"
                />
                <Clock className="ml-2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={state.pickupTime}
                  onChange={(e) => onUpdateState({ pickupTime: e.target.value })}
                  className="w-20 bg-transparent text-xs font-semibold text-[#0B1330] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                Booked Hours (4 Hours Minimum)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={4}
                  max={copy.itinerary.durationMax}
                  step={1}
                  value={state.durationHours}
                  onChange={(e) => onUpdateState({ durationHours: Number(e.target.value) })}
                  className="flex-1 cursor-pointer accent-[#1648D8]"
                />
                <span className="w-16 text-right text-sm font-bold text-[#0B1330]">{state.durationHours} hrs</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <ShowcaseCarousel2 serviceType={serviceType} selectedVehicle={selectedVehicle} />
      <WhatsIncluded2 serviceType={serviceType} />
      <CapacityLuggage2
        selectedVehicle={selectedVehicle}
        currentLuggageType={state.luggageType}
        onLuggageTypeChange={(t) => onUpdateState({ luggageType: t })}
      />
      <PriceBreakdown2
        serviceType={serviceType}
        selectedVehicle={selectedVehicle}
        distanceKm={state.sampleDistanceKm}
        durationHours={state.durationHours}
        onDistanceChange={serviceType === "airport-transfer" ? (d) => onUpdateState({ sampleDistanceKm: d }) : undefined}
      />
    </div>
  );
}

export { FLEET2 };
