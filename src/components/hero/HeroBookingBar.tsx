"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DRAFT_KEY, tomorrowISO, type BookingDraft } from "@/lib/booking";

const EMPTY_DRAFT: BookingDraft = { name: "", phone: "", pickup: "", date: "" };

export function HeroBookingBar() {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);

  // Earliest selectable date — read after mount so no Date is evaluated during render.
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  useEffect(() => {
    setMinDate(tomorrowISO());
    // A fresh visit/refresh of the home page always starts with a clean form.
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const set = (patch: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  // Hand the details to /book (which continues from the Vehicle step).
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, date: draft.date || tomorrowISO() }));
    } catch {
      /* storage unavailable — the booking page just starts at step 1 */
    }
    // Reset the bar so coming back to the home page shows an empty form.
    setDraft(EMPTY_DRAFT);
    router.push("/book");
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="w-full rounded-2xl border border-white/10 px-6 py-5"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0) 90%), radial-gradient(circle at 80% 200%, rgba(255,255,255,0.25), rgba(255,255,255,0) 80%), linear-gradient(rgba(15,19,25,0.2), rgba(15,19,25,0.2))",
        boxShadow:
          "0 2px 8px 0 rgba(6,10,13,0.12), inset 4px 4px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        {/* Label */}
        <div className="shrink-0">
          <p className="text-base font-bold text-white leading-tight">
            Need to Rent a<br />Luxury Car?
          </p>
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-10 w-px bg-white/20" />

        {/* Fields */}
        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <BookingField
            label="Full Name"
            placeholder="Enter Full Name"
            type="text"
            value={draft.name}
            onChange={(name) => set({ name })}
          />
          <BookingField
            label="Mobile Number"
            placeholder="Enter Phone no."
            type="tel"
            value={draft.phone}
            onChange={(phone) => set({ phone })}
          />
          <BookingField
            label="Pickup Location"
            placeholder="Enter Location"
            type="text"
            required
            value={draft.pickup}
            onChange={(pickup) => set({ pickup })}
          />
          <BookingField
            label="Pickup Date"
            placeholder="dd/mm/yyyy"
            type="date"
            required
            min={minDate}
            value={draft.date}
            onChange={(date) => set({ date })}
          />
        </div>

        {/* Find Your Ride button */}
        <button
          type="submit"
          className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
          style={{
            background: "#194BD9",
          }}
        >
          Find Your Ride
        </button>
      </div>
    </form>
  );
}

function BookingField({
  label,
  placeholder,
  type,
  value,
  onChange,
  required,
  min,
}: {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  min?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1 min-w-0">
      <label className="text-xs font-medium text-white/60">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none border-b border-white/20 pb-1 focus:border-white/60 transition-colors [color-scheme:dark]"
      />
    </div>
  );
}
