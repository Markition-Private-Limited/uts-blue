"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DRAFT_KEY, tomorrowISO, type BookingDraft } from "@/lib/booking";
import { DateField, LocationField } from "./HeroFields";

const EMPTY_DRAFT: BookingDraft = { name: "", phone: "", pickup: "", date: "" };

export function HeroBookingBar() {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [showErrors, setShowErrors] = useState(false);

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

  // Go to the booking page with the details entered here.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pickup location and date are required: underline whatever is missing in red.
    if (!draft.pickup.trim() || !draft.date) {
      setShowErrors(true);
      return;
    }
    // Hand the details to the booking page (it fills its own fields from them).
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable — the booking page simply opens with its defaults */
    }
    // Reset the bar so it is empty again when the visitor comes back to the home page.
    setDraft(EMPTY_DRAFT);
    setShowErrors(false);
    router.push("/book");
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="w-full rounded-2xl border border-white/10 px-6 py-5"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.10)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        backgroundImage:
          "linear-gradient(rgba(15,19,25,0.08), rgba(15,19,25,0.08))",
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
          <LocationField
            label="Pickup Location"
            placeholder="Enter Location"
            value={draft.pickup}
            invalid={showErrors && !draft.pickup.trim()}
            onChange={(pickup) => set({ pickup })}
          />
          <DateField
            label="Pickup Date"
            min={minDate}
            value={draft.date}
            invalid={showErrors && !draft.date}
            onChange={(date) => set({ date })}
          />
        </div>

        {/* Find Your Ride button */}
        <button
          type="submit"
          className="shrink-0 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100"
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
