import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { WhySection } from "@/components/why/WhySection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { ChauffeurPromoSection } from "@/components/chauffeur-promo";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Book Your Chauffeur — UTS Blue",
  description: "Bespoke chauffeur reservations with United Travel Services.",
};

export default function BookPage() {
  return (
    <div className={`${cinzel.variable} relative min-h-screen bg-[#050B22]`}>
      <Navbar />

      {/* Same hero video + dark blue gradient as the home page */}
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <video
          src="/HERO%20VIDEO/Untitled%20design%20(1)_4K_upscaled.mp4"
          poster="/hero-bg.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full select-none object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,11,34,0.88) 0%, rgba(10,26,85,0.74) 45%, rgba(5,11,34,0.93) 100%)',
          }}
        />
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 pb-16 pt-32 md:pb-24 md:pt-40">
        <header className="mb-6 text-center md:mb-8">
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-[#9DB0E3] md:text-sm">
            United Travel Services
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your Journey, Perfectly Arranged
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-[#9DB0E3]">Bespoke Chauffeur Reservations</p>
        </header>

        <BookingWidget />
      </main>

      {/* Home-page sections, from "The Difference Is in Every Detail." onwards */}
      <div className="relative z-10 bg-white pb-12 pt-4">
        <FadeInSection>
          <WhySection />
        </FadeInSection>
        <FadeInSection>
          <TestimonialsSection />
        </FadeInSection>
        <FadeInSection>
          <ChauffeurPromoSection />
        </FadeInSection>
      </div>
    </div>
  );
}
