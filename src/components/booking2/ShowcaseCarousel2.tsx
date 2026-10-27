"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ServiceType2, Vehicle2 } from "@/lib/booking2";

const HERO_IMAGE: Record<ServiceType2, string> = {
  "airport-transfer": "/assets/images/uts_airport_hero_1793099459464.jpg",
  "day-booking": "/assets/images/uts_city_day_hero_1793099459902.jpg",
  "hourly-chauffeur": "/assets/images/uts_hourly_hero_1793099460597.jpg",
};

export function ShowcaseCarousel2({
  serviceType,
  selectedVehicle,
}: {
  serviceType: ServiceType2;
  selectedVehicle: Vehicle2;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: HERO_IMAGE[serviceType],
      caption:
        serviceType === "airport-transfer"
          ? "A composed, private journey from door to terminal."
          : serviceType === "day-booking"
            ? "Effortless mobility through London's financial heart."
            : "Bespoke chauffeur travel, precisely on your schedule.",
      subtext:
        serviceType === "airport-transfer"
          ? `Refined executive travel for every airport journey. ${selectedVehicle.name} provides a composed, private environment with a professional chauffeur and full luggage assistance across London airports.`
          : serviceType === "day-booking"
            ? `Your dedicated executive chauffeur is on standby throughout your day in Mayfair, Canary Wharf, or the City. Step out between meetings with zero parking or transit friction.`
            : `From private boutique shopping on Bond Street to fine dining in Mayfair, experience seamless hourly chauffeur freedom with wait-and-return flexibility.`,
    },
    {
      image: selectedVehicle.image,
      caption: `Exemplary ${selectedVehicle.name} craftsmanship and comfort.`,
      subtext: `Every ${selectedVehicle.modelExample} in the UTS fleet is meticulously maintained, climate-regulated, and inspected before pickup.`,
    },
  ];

  const activeSlide = slides[currentSlide % slides.length];
  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section className="mb-14">
      <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#050B22] shadow-md sm:aspect-[21/9]">
        <Image src={activeSlide.image} alt={activeSlide.caption} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B22]/90 via-[#0B1330]/30 to-transparent" />
        <div className="absolute right-5 top-4 text-sm font-black uppercase tracking-widest text-white/70">UTS</div>

        <button
          onClick={prevSlide}
          aria-label="Previous showcase slide"
          className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0B1330] opacity-90 shadow-md transition-all hover:scale-110 hover:bg-white group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next showcase slide"
          className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0B1330] opacity-90 shadow-md transition-all hover:scale-110 hover:bg-white group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-5 left-5 right-5 sm:left-7 sm:right-7">
          <p className="max-w-2xl text-base font-medium tracking-tight text-white drop-shadow-sm sm:text-xl lg:text-2xl">
            {activeSlide.caption}
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`no-fill h-1.5 rounded-full transition-all hover:scale-125 ${
                  i === currentSlide % slides.length ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 max-w-3xl">
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{activeSlide.subtext}</p>
      </div>
    </section>
  );
}
