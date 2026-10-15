import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero";
import { HeroCircleBadge } from "@/components/hero";
import { AboutSection } from "@/components/about/AboutSection";
import { WhySection } from "@/components/why/WhySection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { FleetSection } from "@/components/fleet/FleetSection";
import { ChauffeurPromoSection } from "@/components/chauffeur-promo";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <HeroSection />
        <div className="absolute bottom-0 left-1/2 z-30 -translate-x-1/2 translate-y-1/2">
          <HeroCircleBadge />
        </div>
      </div>

      <main>
        <AboutSection />
        <WhySection />
        <ServicesSection />
        <FleetSection />
        <ChauffeurPromoSection />
      </main>
    </>
  );
}
