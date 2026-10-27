import { Info } from "lucide-react";
import { calculatePrice2, type ServiceType2, type Vehicle2 } from "@/lib/booking2";

export function PriceBreakdown2({
  serviceType,
  selectedVehicle,
  distanceKm,
  durationHours,
  onDistanceChange,
}: {
  serviceType: ServiceType2;
  selectedVehicle: Vehicle2;
  distanceKm: number;
  durationHours: number;
  onDistanceChange?: (d: number) => void;
}) {
  const calc = calculatePrice2(serviceType, selectedVehicle, { distanceKm, durationHours });
  const row = "py-3 flex items-center justify-between text-sm";
  const label = "text-slate-500 font-normal";
  const value = "font-semibold text-[#0B1330]";

  return (
    <section className="mb-14 border-t border-slate-200 pt-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1330] sm:text-2xl">Price Breakdown</h2>
        <span className="rounded-md bg-[#1648D8]/8 px-2.5 py-1 text-[11px] font-medium text-[#1648D8]">
          Illustrative values — confirmed by UTS before travel
        </span>
      </div>

      <div className="mb-6 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {serviceType === "airport-transfer" ? (
          <>
            <div className={row}>
              <span className={label}>{selectedVehicle.name} base tariff rate</span>
              <span className={value}>
                {selectedVehicle.airportRateKm !== null ? `£${selectedVehicle.airportRateKm.toFixed(2)} / km` : "To be confirmed"}
              </span>
            </div>

            <div className={row}>
              <div className="flex items-center gap-2">
                <span className={label}>Sample journey distance</span>
                {onDistanceChange && <span className="text-[11px] text-slate-400">(configurable)</span>}
              </div>
              {onDistanceChange ? (
                <select
                  value={distanceKm}
                  onChange={(e) => onDistanceChange(Number(e.target.value))}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-[#0B1330]"
                >
                  <option value={20}>20 km (Inner London)</option>
                  <option value={28}>28 km (Central London → Heathrow T5)</option>
                  <option value={45}>45 km (Mayfair → Gatwick)</option>
                  <option value={60}>60 km (London → Stansted)</option>
                  <option value={75}>75 km (London → Luton / Outlying)</option>
                </select>
              ) : (
                <span className={value}>{distanceKm} km</span>
              )}
            </div>

            <div className={row}>
              <span className={label}>Calculated illustrative base fare ({distanceKm} km)</span>
              <span className={value}>{calc.baseFare !== null ? `£${calc.baseFare.toFixed(2)}` : "Price to be confirmed"}</span>
            </div>

            <div className={row}>
              <span className={label}>Booking & administration fee</span>
              <span className="font-normal italic text-slate-400">Not configured</span>
            </div>
          </>
        ) : (
          <>
            <div className={row}>
              <span className={label}>{selectedVehicle.name} hourly rate</span>
              <span className={value}>
                {(serviceType === "day-booking" ? selectedVehicle.dayRateHour : selectedVehicle.hourlyRateHour) !== null
                  ? `£${(serviceType === "day-booking" ? selectedVehicle.dayRateHour! : selectedVehicle.hourlyRateHour!).toFixed(2)} / hr`
                  : "To be confirmed"}
              </span>
            </div>
            <div className={row}>
              <span className={label}>Booked duration</span>
              <span className={value}>{durationHours} hours</span>
            </div>
            <div className={row}>
              <span className={label}>Minimum booking requirement</span>
              <span className="font-medium text-slate-700">4 hours (enforced)</span>
            </div>
            <div className={row}>
              <span className={label}>Additional configured surcharges</span>
              <span className="font-normal italic text-slate-400">None configured</span>
            </div>
          </>
        )}

        <div className="flex items-baseline justify-between pb-1 pt-4">
          <div>
            <span className="block text-base font-bold text-[#0B1330]">Illustrative estimated total</span>
            <span className="text-[11px] text-slate-400">
              {serviceType === "airport-transfer"
                ? "Per-km distance tariff estimate"
                : `${serviceType === "day-booking" ? "Day Booking" : "Hourly Chauffeur"} (${durationHours} hrs)`}
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#1648D8] sm:text-2xl">
            {calc.total !== null ? `£${calc.total.toFixed(2)}` : "Price to be confirmed"}
          </span>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        <p className="text-xs font-semibold text-slate-800">Please note:</p>
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <p>
            All prices shown are illustrative values only and do not represent confirmed UTS fares. Route details, vehicle
            models, fees and service inclusions are examples for demonstration purposes.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <p>Please confirm route, airport, terminal, passenger and luggage details with UTS before completing your booking.</p>
        </div>
      </div>
    </section>
  );
}
