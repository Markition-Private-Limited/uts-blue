"use client";

import { useEffect, useState } from "react";
import { BookmarkCheck } from "lucide-react";
import { DRAFT_KEY, type BookingDraft } from "@/lib/booking";
import { ServiceHeaderBar2 } from "@/components/booking2/ServiceHeaderBar2";
import { ServicePage2 } from "@/components/booking2/ServicePage2";
import { BookingSidebar2 } from "@/components/booking2/BookingSidebar2";
import { BookingReviewModal2 } from "@/components/booking2/BookingReviewModal2";
import {
  FLEET2,
  defaultBookingState2,
  type BookingState2,
  type ServiceType2,
  type VehicleTier2,
} from "@/lib/booking2";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** 2026-11-14 -> "14 November 2026" (the format this page uses for dates). */
function longDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${Number(m[3])} ${MONTH_NAMES[Number(m[2]) - 1]} ${m[1]}` : iso;
}

export default function BookPage() {
  const [currentService, setCurrentService] = useState<ServiceType2>("airport-transfer");
  const [bookingState, setBookingState] = useState<BookingState2>(defaultBookingState2());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  // Arrived from the home page hero? Fill the pickup and date the visitor already entered.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      sessionStorage.removeItem(DRAFT_KEY);
      const draft = JSON.parse(raw) as BookingDraft;
      setBookingState((s) => ({
        ...s,
        pickupAddress: draft.pickup?.trim() || s.pickupAddress,
        pickupDate: draft.date ? longDate(draft.date) : s.pickupDate,
      }));
      setToastMessage("Your pickup and date from the homepage have been filled in.");
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      /* nothing saved, or storage unavailable — keep the defaults */
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleServiceChange = (service: ServiceType2) => {
    setCurrentService(service);
    setBookingState((s) => ({ ...s, serviceType: service }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateBookingState = (updates: Partial<BookingState2>) => setBookingState((s) => ({ ...s, ...updates }));

  const selectedVehicle = FLEET2.find((v) => v.id === bookingState.selectedVehicleId) || FLEET2[0];
  const handleSelectVehicle = (id: VehicleTier2) => updateBookingState({ selectedVehicleId: id });

  const handleSaveJourney = () => {
    try {
      localStorage.setItem("uts_chauffeur_booking_data", JSON.stringify(bookingState));
      showToast("Journey details saved to browser storage.");
    } catch {
      showToast("Details saved for this session.");
    }
  };

  const handleContinue = () => {
    if (currentService !== "airport-transfer" && bookingState.durationHours < 4) {
      showToast("Minimum booking duration of 4 hours is required.");
      return;
    }
    setReviewOpen(true);
  };

  const pickupSummary = bookingState.pickupAddress;
  const destinationSummary = currentService === "airport-transfer" ? "Heathrow T5 (LHR)" : undefined;
  const dateTimeSummary =
    currentService === "airport-transfer"
      ? `${bookingState.pickupDate} · ${bookingState.pickupTime} · ${bookingState.transferDirection === "departure" ? "Departure" : "Arrival"}`
      : `${bookingState.pickupDate} · ${bookingState.pickupTime} · ${bookingState.durationHours} Hours`;

  return (
    <div className="min-h-screen bg-white">
      {toastMessage && (
        <div className="fixed right-6 top-6 z-[60] flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B1330] px-4 py-3 text-xs font-semibold text-white shadow-2xl">
          <BookmarkCheck className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <ServiceHeaderBar2
        currentService={currentService}
        onServiceChange={handleServiceChange}
        pickupSummary={pickupSummary}
        destinationSummary={destinationSummary}
        dateTimeSummary={dateTimeSummary}
      />

      <main className="mx-auto w-full max-w-[1520px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row xl:gap-12">
          <ServicePage2
            serviceType={currentService}
            state={bookingState}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            onUpdateState={updateBookingState}
          />

          <BookingSidebar2
            state={bookingState}
            selectedVehicle={selectedVehicle}
            onUpdateState={updateBookingState}
            onContinue={handleContinue}
            onSave={handleSaveJourney}
          />
        </div>
      </main>

      <BookingReviewModal2 isOpen={reviewOpen} onClose={() => setReviewOpen(false)} state={bookingState} vehicle={selectedVehicle} />
    </div>
  );
}
