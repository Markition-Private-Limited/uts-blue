import type { HeroContent } from "@/types/hero";

// ─── EDIT THIS FILE TO UPDATE HERO COPY ───────────────────────────────────────
// Layout and styling live in src/components/hero/ — touch this file for text only.

export const heroContent: HeroContent = {
  badge: "Executive Chauffeur Services",
  headline: "Your Journey Deserves More Than a Ride",
  subheadline: "",
  description:
    "Experience luxury chauffeur services across London and beyond, with professional drivers, premium vehicles and a journey planned around your needs.",
  cta: [
    { label: "Book Your Chauffeur", href: "/book", variant: "primary" },
    { label: "Explore Our Fleet", href: "/fleet", variant: "secondary" },
  ],
};
