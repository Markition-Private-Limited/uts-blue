"use client";

import { useState } from "react";
import Image from "next/image";
import { X, AlertTriangle, Copy, Printer } from "lucide-react";
import { calculatePrice2, type BookingState2, type Vehicle2 } from "@/lib/booking2";

export function BookingReviewModal2({
  isOpen,
  onClose,
  state,
  vehicle,
}: {
  isOpen: boolean;
  onClose: () => void;
  state: BookingState2;
  vehicle: Vehicle2;
}) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const priceCalc = calculatePrice2(state.serviceType, vehicle, {
    distanceKm: state.sampleDistanceKm,
    durationHours: state.durationHours,
  });

  const copySummary = () => {
    const text = `UTS Booking Summary:
Service: ${state.serviceType.toUpperCase()}
Vehicle: ${vehicle.name} (${vehicle.modelExample})
Pickup: ${state.pickupAddress}
${state.serviceType === "airport-transfer" ? `Drop-off: ${state.destinationAddress}` : `Duration: ${state.durationHours} Hours`}
Date & Time: ${state.pickupDate} at ${state.pickupTime}
Passengers: ${state.passengers}
Luggage: ${state.luggageCount}
Estimated Total: ${priceCalc.total !== null ? `£${priceCalc.total.toFixed(2)}` : "Price to be confirmed"}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl divide-y divide-slate-100">
        <div className="flex items-start justify-between rounded-t-2xl bg-[#050B22] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-serif text-lg font-bold text-white">
              U
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9DB0E3]">UTS Reservation Preview</span>
              <h3 className="text-lg font-bold text-white">Journey Summary & Review</h3>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close modal" className="rounded-lg p-1 text-[#9DB0E3] transition-all hover:scale-110 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-bold">Demonstration Preview Only</p>
            <p className="mt-0.5 leading-relaxed text-amber-800">
              No live reservation or payment has been processed. Official pricing, vehicle allocation, and booking
              confirmation will be finalised directly with United Travel Services.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="relative h-[72px] w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200">
              <Image src={vehicle.image.replace("-1.webp", "-1-thumb.webp")} alt={vehicle.name} fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle Allocated</span>
              <h4 className="text-base font-bold text-[#0B1330]">{vehicle.name}</h4>
              <p className="text-xs text-slate-500">{vehicle.modelExample}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span>{state.passengers} Passengers</span>
                <span>·</span>
                <span>{state.luggageCount} Luggage Bags</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1648D8]" />
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-400">Pickup Location</span>
                <span className="text-sm font-medium text-[#0B1330]">{state.pickupAddress}</span>
              </div>
            </div>

            {state.serviceType === "airport-transfer" ? (
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
                <div>
                  <span className="block text-[10px] font-semibold uppercase text-slate-400">Drop-off Destination</span>
                  <span className="text-sm font-medium text-[#0B1330]">{state.destinationAddress}</span>
                  {state.flightNumber && <span className="mt-0.5 block text-xs text-slate-500">Flight: {state.flightNumber}</span>}
                </div>
              </div>
            ) : (
              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase text-slate-400">Stops / Route Overview</span>
                {state.stops.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-slate-700">
                    {state.stops.map((s) => (
                      <li key={s.id}>{s.address}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-slate-500">Continuous hourly standby service in London.</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-400">Date & Local London Time</span>
                <span className="font-medium text-[#0B1330]">
                  {state.pickupDate} at {state.pickupTime}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-semibold uppercase text-slate-400">Service Term</span>
                <span className="font-medium text-[#0B1330]">
                  {state.serviceType === "airport-transfer" ? `${state.sampleDistanceKm} km One-Way` : `${state.durationHours} Hours Dedicated`}
                </span>
              </div>
            </div>

            {state.specialInstructions && (
              <div className="border-t border-slate-100 pt-2">
                <span className="block text-[10px] font-semibold uppercase text-slate-400">Special Chauffeur Instructions</span>
                <p className="italic text-slate-700">{state.specialInstructions}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>Tariff ({priceCalc.rateLabel}):</span>
              <span className="font-semibold text-[#0B1330]">
                {priceCalc.baseFare !== null ? `£${priceCalc.baseFare.toFixed(2)}` : "To be confirmed"}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>Configured Administrative Fees:</span>
              <span className="italic text-slate-400">£0.00 (not configured)</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-slate-200 pt-2">
              <span className="text-sm font-bold text-[#0B1330]">Illustrative Estimated Total:</span>
              <span className="text-xl font-black text-[#1648D8]">
                {priceCalc.total !== null ? `£${priceCalc.total.toFixed(2)}` : "Price to be confirmed"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <button
              onClick={copySummary}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1330] transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{copied ? "Copied to Clipboard!" : "Copy Summary"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1330] transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </div>

          <button onClick={onClose} className="rounded-xl bg-[#1648D8] px-6 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E4FD9] hover:shadow-lg">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
