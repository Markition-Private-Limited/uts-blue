"use client";

import Image from "next/image";
import type { ServiceType2, Vehicle2 } from "@/lib/booking2";

// The wide banner under the vehicle cards: the selected class's own wide photo
// (same behaviour as the UTS 2nd variation), with a caption that follows the service.
export function ShowcaseCarousel2({
  serviceType,
  selectedVehicle,
}: {
  serviceType: ServiceType2;
  selectedVehicle: Vehicle2;
}) {
  const copy =
    serviceType === "airport-transfer"
      ? {
          caption: `Exemplary ${selectedVehicle.name} craftsmanship and comfort.`,
          subtext: `Every ${selectedVehicle.modelExample} in the UTS fleet is meticulously sanitised, climate-regulated, and inspected before pickup.`,
        }
      : serviceType === "day-booking"
        ? {
            caption: "Mobile sanctuary for your full working day.",
            subtext: `Conduct conference calls, review documents, or relax between appointments in the private cabin of your ${selectedVehicle.modelExample}.`,
          }
        : {
            caption: "Flawless presentation and quiet elegance.",
            subtext:
              "Your personal chauffeur ensures punctuality, discretion, and courteous British hospitality for every stop on your itinerary.",
          };

  return (
    <section className="mb-14">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#050B22] shadow-md sm:aspect-[21/9]">
        <Image
          key={selectedVehicle.image2}
          src={selectedVehicle.image2}
          alt={copy.caption}
          fill
          sizes="100vw"
          className="banner-fade object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B22]/80 via-[#0B1330]/25 to-[#050B22]/10" />
        <div className="absolute right-5 top-4 text-sm font-black uppercase tracking-widest text-white/70">UTS</div>

        <div className="absolute bottom-5 left-5 right-5 sm:left-7 sm:right-7">
          <p className="max-w-2xl text-base font-medium tracking-tight text-white drop-shadow-sm sm:text-xl lg:text-2xl">
            {copy.caption}
          </p>
        </div>
      </div>

      <div className="mt-5 max-w-3xl">
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{copy.subtext}</p>
      </div>
    </section>
  );
}
