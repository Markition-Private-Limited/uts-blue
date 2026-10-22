import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { BookingWidget } from "@/components/booking/BookingWidget";

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

      {/* Cinematic dark backdrop */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg-new.png')" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B22]/85 via-[#0A1A55]/88 to-[#050B22]/95" />
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
    </div>
  );
}
