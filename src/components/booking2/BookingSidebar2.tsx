"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Plane,
  User,
  Briefcase,
  Plus,
  Trash2,
  Bookmark,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { calculatePrice2, type BookingState2, type Vehicle2 } from "@/lib/booking2";

export function BookingSidebar2({
  state,
  selectedVehicle,
  onUpdateState,
  onContinue,
  onSave,
}: {
  state: BookingState2;
  selectedVehicle: Vehicle2;
  onUpdateState: (updates: Partial<BookingState2>) => void;
  onContinue: () => void;
  onSave: () => void;
}) {
  const [editingPickup, setEditingPickup] = useState(false);
  const [editingDestination, setEditingDestination] = useState(false);
  const [newStopAddress, setNewStopAddress] = useState("");
  const [showAddStopInput, setShowAddStopInput] = useState(false);

  const priceCalc = calculatePrice2(state.serviceType, selectedVehicle, {
    distanceKm: state.sampleDistanceKm,
    durationHours: state.durationHours,
  });
  const isMinHoursValid = state.serviceType === "airport-transfer" || state.durationHours >= 4;

  const handleAddStop = () => {
    if (!newStopAddress.trim()) return;
    onUpdateState({ stops: [...state.stops, { id: `stop-${Date.now()}`, address: newStopAddress.trim() }] });
    setNewStopAddress("");
    setShowAddStopInput(false);
  };
  const handleRemoveStop = (id: string) => onUpdateState({ stops: state.stops.filter((s) => s.id !== id) });

  const labelCls = "text-[10px] uppercase font-bold tracking-wider text-slate-400 block";

  return (
    <aside data-lenis-prevent className="no-scrollbar overscroll-contain w-full shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-[360px] lg:self-start lg:overflow-y-auto xl:w-[390px]">
      <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* 1. Route overview graphic — dark accent panel */}
        <div className="relative border-b border-slate-100 bg-slate-50 p-4">
          <div className="relative flex h-44 flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-br from-[#0d1a4d] to-[#070f2e] p-3">
            <svg className="absolute inset-0 h-full w-full text-white/5" viewBox="0 0 300 180" fill="currentColor" preserveAspectRatio="none">
              <polygon points="20,40 80,20 160,25 240,15 280,60 260,130 190,165 110,160 40,120" />
            </svg>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 180" fill="none" stroke="#1E4FD9" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round">
              <path d="M 10 110 Q 70 80, 140 100 T 290 85" />
            </svg>
            <svg
              className="absolute inset-0 z-10 h-full w-full"
              viewBox="0 0 300 180"
              fill="none"
              stroke="#fff"
              strokeWidth="3.5"
              strokeDasharray={state.serviceType === "airport-transfer" ? "none" : "4 3"}
              strokeLinecap="round"
            >
              {state.serviceType === "airport-transfer" ? (
                <path d="M 210 35 C 190 70, 160 90, 140 145" />
              ) : (
                <path d="M 180 50 C 220 80, 130 110, 160 140" />
              )}
            </svg>

            <div className="relative z-20 flex items-start justify-between">
              <div className="max-w-[130px] rounded-lg border border-white/10 bg-white/10 p-1.5 text-[10px] backdrop-blur-xs">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#9DB0E3]">
                  {state.serviceType === "airport-transfer" ? "Drop-off" : "Destination"}
                </span>
                <span className="block truncate font-semibold text-white">
                  {state.serviceType === "airport-transfer" ? "Heathrow - T5" : "London Standby"}
                </span>
              </div>
              <div className="max-w-[130px] rounded-lg border border-white/15 bg-[#1648D8] p-1.5 text-right text-[10px]">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-white/70">Pickup</span>
                <span className="block truncate font-semibold text-white">The Langham, W1</span>
              </div>
            </div>

            {state.serviceType === "airport-transfer" && (
              <div className="relative z-20 flex items-center gap-1.5 self-center rounded-md bg-white/15 px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                <Plane className="h-3 w-3 text-[#9DB0E3]" />
                <span>LHR Terminal 5</span>
              </div>
            )}

            <div className="relative z-20 flex items-center justify-between text-[9px] font-medium text-[#9DB0E3]">
              <span>Route overview · Not to scale</span>
              <span>Indicative only</span>
            </div>
          </div>
        </div>

        {/* 2. Service summary */}
        <div className="p-4 sm:p-5">
          {state.serviceType === "airport-transfer" ? (
            <>
              <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  onClick={() => onUpdateState({ transferDirection: "departure" })}
                  className={`rounded-lg px-3 py-2 transition-all hover:-translate-y-0.5 ${
                    state.transferDirection === "departure" ? "bg-[#1648D8] text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-[#0B1330]"
                  }`}
                >
                  Airport Departure
                </button>
                <button
                  onClick={() => onUpdateState({ transferDirection: "arrival" })}
                  className={`rounded-lg px-3 py-2 transition-all hover:-translate-y-0.5 ${
                    state.transferDirection === "arrival" ? "bg-[#1648D8] text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-[#0B1330]"
                  }`}
                >
                  Airport Arrival
                </button>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <span className={labelCls}>
                    Airport {state.transferDirection === "departure" ? "Departure Drop-Off" : "Arrival Pickup"}
                  </span>
                  <h4 className="text-base font-bold capitalize text-[#0B1330]">{state.transferDirection}</h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">{selectedVehicle.name} · One-way · Illustrative price</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400">Illustrative est.</span>
                  <span className="text-xl font-extrabold text-[#1648D8]">
                    {priceCalc.total !== null ? `£${priceCalc.total.toFixed(2)}` : "To be confirmed"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div>
              <span className={labelCls}>{state.serviceType === "day-booking" ? "Chauffeur Day Service" : "Hourly Chauffeur Service"}</span>
              <div className="mt-1 flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0B1330]">{state.durationHours} Hours Dedicated Chauffeur</h4>
                  <p className="text-[11px] text-slate-500">{selectedVehicle.name} · London Standby</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400">Illustrative est.</span>
                  <span className="text-xl font-extrabold text-[#1648D8]">
                    {priceCalc.total !== null ? `£${priceCalc.total.toFixed(2)}` : "To be confirmed"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Duration */}
        {state.serviceType !== "airport-transfer" && (
          <div className="bg-slate-50 p-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B1330]">Booking Duration (Hours)</label>
              <span className="text-[11px] text-slate-500">Minimum: 4 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateState({ durationHours: Math.max(1, state.durationHours - 1) })}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-[#0B1330] transition-all hover:-translate-y-0.5 hover:border-[#1648D8]/40 hover:bg-slate-100"
              >
                -
              </button>
              <div className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-center">
                <span className="text-base font-bold text-[#0B1330]">{state.durationHours} Hours</span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateState({ durationHours: Math.min(16, state.durationHours + 1) })}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-[#0B1330] transition-all hover:-translate-y-0.5 hover:border-[#1648D8]/40 hover:bg-slate-100"
              >
                +
              </button>
            </div>
            {!isMinHoursValid && (
              <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  UTS policy enforces a strict <strong>4-hour minimum</strong> for{" "}
                  {state.serviceType === "day-booking" ? "Day Booking" : "Hourly Chauffeur"}.
                </span>
              </div>
            )}
          </div>
        )}

        {/* 4. Pickup / drop-off */}
        <div className="space-y-3.5 p-4 sm:p-5">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <div className="h-2 w-2 rounded-full bg-[#1648D8]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className={labelCls}>Pickup address (hotel, home or office)</span>
              {editingPickup ? (
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={state.pickupAddress}
                    onChange={(e) => onUpdateState({ pickupAddress: e.target.value })}
                    className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-[#0B1330]"
                  />
                  <button
                    onClick={() => setEditingPickup(false)}
                    className="rounded bg-[#1648D8] px-2 py-1 text-[11px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E4FD9]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <p onClick={() => setEditingPickup(true)} className="cursor-pointer truncate text-xs font-medium text-[#0B1330] hover:underline">
                  {state.pickupAddress}
                </p>
              )}
            </div>
          </div>

          {state.serviceType === "airport-transfer" ? (
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <MapPin className="h-3.5 w-3.5 text-[#1648D8]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className={labelCls}>Airport & terminal (e.g. LHR T5, LGW North, STN)</span>
                {editingDestination ? (
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={state.destinationAddress}
                      onChange={(e) => onUpdateState({ destinationAddress: e.target.value })}
                      className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-[#0B1330]"
                    />
                    <button
                      onClick={() => setEditingDestination(false)}
                      className="rounded bg-[#1648D8] px-2 py-1 text-[11px] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E4FD9]"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <p onClick={() => setEditingDestination(true)} className="cursor-pointer truncate text-xs font-medium text-[#0B1330] hover:underline">
                    {state.destinationAddress}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-2">
              <div className="mb-2 flex items-center justify-between">
                <span className={labelCls}>Planned Stops ({state.stops.length})</span>
                <button
                  type="button"
                  onClick={() => setShowAddStopInput(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1648D8] transition-all hover:-translate-y-0.5 hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Stop</span>
                </button>
              </div>

              {state.stops.length === 0 ? (
                <p className="text-xs italic text-slate-500">No intermediate stops specified. Flexible itinerary.</p>
              ) : (
                <div className="mb-2 space-y-2">
                  {state.stops.map((stop, idx) => (
                    <div key={stop.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-[#0B1330]">
                          {idx + 1}
                        </span>
                        <span className="truncate font-medium text-[#0B1330]">{stop.address}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveStop(stop.id)}
                        className="p-1 text-slate-400 transition-all hover:scale-110 hover:text-red-500"
                        title="Remove stop"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showAddStopInput && (
                <div className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Enter stop address (e.g. Harrods, Knightsbridge)"
                    value={newStopAddress}
                    onChange={(e) => setNewStopAddress(e.target.value)}
                    className="flex-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-[#0B1330] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4FD9]"
                  />
                  <button
                    onClick={handleAddStop}
                    className="rounded bg-[#1648D8] px-3 py-1.5 text-xs font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E4FD9]"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Date & time */}
        <div className="space-y-3 p-4 sm:p-5">
          <div>
            <span className={labelCls}>Date & Pickup Time</span>
            <p className="mt-0.5 font-semibold text-[#0B1330]">
              {state.pickupDate} · {state.pickupTime}
            </p>
          </div>

          {state.serviceType === "airport-transfer" && (
            <div className="flex items-center gap-2.5 pt-1 text-xs text-slate-500">
              <Plane className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="flex-1">
                <span className="block text-[10px] text-slate-400">Flight number — optional, for airport pickup coordination</span>
                <input
                  type="text"
                  placeholder="e.g. BA 142 / VS 004"
                  value={state.flightNumber}
                  onChange={(e) => onUpdateState({ flightNumber: e.target.value })}
                  className="w-full border-b border-slate-200 py-0.5 text-xs text-[#0B1330] placeholder:text-slate-400 focus:border-[#1E4FD9] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 6. Selected vehicle */}
        <div className="p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className={labelCls}>Selected Vehicle</span>
            <span className="text-xs font-bold text-[#0B1330]">
              {priceCalc.total !== null ? `£${priceCalc.total.toFixed(2)} est.` : "Price to be confirmed"}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200">
              <Image src={selectedVehicle.image} alt={selectedVehicle.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="truncate text-xs font-bold text-[#0B1330]">{selectedVehicle.name}</h5>
              <p className="truncate text-[11px] text-slate-500">{selectedVehicle.modelExample}</p>
            </div>
          </div>
        </div>

        {/* 7. Passengers & luggage */}
        <div className="space-y-3 p-4 sm:p-5">
          <div>
            <span className={labelCls}>Passengers & Luggage</span>
            <span className="mt-0.5 block text-[10px] leading-tight text-slate-400">
              Requested values below. Actual capacity subject to confirmation.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2">
              <div className="flex items-center gap-1.5 text-slate-500">
                <User className="h-3.5 w-3.5" />
                <span className="text-[11px]">Passengers</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateState({ passengers: Math.max(1, state.passengers - 1) })}
                  className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white font-bold text-[#0B1330] transition-all hover:scale-110 hover:border-[#1648D8]/40 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-4 text-center font-bold text-[#0B1330]">{state.passengers}</span>
                <button
                  type="button"
                  onClick={() => onUpdateState({ passengers: Math.min(selectedVehicle.passengers + 2, state.passengers + 1) })}
                  className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white font-bold text-[#0B1330] transition-all hover:scale-110 hover:border-[#1648D8]/40 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="text-[11px]">Luggage</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateState({ luggageCount: Math.max(0, state.luggageCount - 1) })}
                  className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white font-bold text-[#0B1330] transition-all hover:scale-110 hover:border-[#1648D8]/40 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-4 text-center font-bold text-[#0B1330]">{state.luggageCount}</span>
                <button
                  type="button"
                  onClick={() => onUpdateState({ luggageCount: Math.min(selectedVehicle.luggage + 3, state.luggageCount + 1) })}
                  className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white font-bold text-[#0B1330] transition-all hover:scale-110 hover:border-[#1648D8]/40 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {state.passengers > selectedVehicle.passengers && (
            <p className="rounded border border-amber-300 bg-amber-50 p-1.5 text-[11px] text-amber-800">
              Note: Requested {state.passengers} passengers exceeds standard {selectedVehicle.name} seating ({selectedVehicle.passengers}).
            </p>
          )}

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Additional pickup instructions (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. entrance, terminal door, child seat"
              value={state.specialInstructions}
              onChange={(e) => onUpdateState({ specialInstructions: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-[#0B1330] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4FD9]"
            />
          </div>
        </div>

        {/* 8. Actions */}
        <div className="space-y-2.5 bg-slate-50 p-4 sm:p-5">
          <button
            type="button"
            disabled={!isMinHoursValid}
            onClick={onContinue}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-bold tracking-wide shadow-md transition-all sm:text-sm ${
              isMinHoursValid
                ? "cursor-pointer bg-[#1648D8] text-white hover:-translate-y-0.5 hover:bg-[#1E4FD9] hover:shadow-lg active:translate-y-0 active:scale-[0.99]"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            <span>Continue to Booking</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#0B1330] transition-all hover:-translate-y-0.5 hover:border-[#1648D8]/30 hover:bg-slate-100 hover:shadow-sm"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Save Journey Details</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
