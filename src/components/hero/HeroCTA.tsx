"use client";

import { ArrowButton } from "@/components/navbar/ArrowButton";
import { useBookingModal } from "@/components/booking/BookingModal";
import type { HeroCTAButton } from "@/types/hero";

interface HeroCTAProps {
  buttons: HeroCTAButton[];
}

export function HeroCTA({ buttons }: HeroCTAProps) {
  const { open: openBooking } = useBookingModal();
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {buttons.map((btn) => (
        <ArrowButton
          key={btn.label}
          label={btn.label}
          href={btn.href}
          variant={btn.variant === "primary" ? "blue" : "outline"}
          // Booking buttons open the form as a popup; other links navigate as usual.
          onClick={btn.href === "/book" ? () => openBooking() : undefined}
        />
      ))}
    </div>
  );
}
