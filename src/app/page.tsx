import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero";
import { HeroCircleBadge } from "@/components/hero";
import { AboutSection } from "@/components/about/AboutSection";
import { WhySection } from "@/components/why/WhySection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { FleetSection } from "@/components/fleet/FleetSection";
import { ChauffeurPromoSection } from "@/components/chauffeur-promo";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { HowItWorksSection } from "@/components/how-it-works/HowItWorksSection";
import { VideoStatsSection } from "@/components/video-stats/VideoStatsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative overflow-x-clip">
        <HeroSection />
        {/* White union, built from fixed-pixel parts so its size and position are
            identical at every viewport width: a full-width body with rounded top
            corners (flat edge 66px above the hero's bottom) plus a fixed-size
            center bump cropped from the supplied union asset. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
          aria-hidden
        >
          <div className="absolute inset-x-0 -bottom-[30px] h-[96px] rounded-t-[30px] bg-[#fefefe]" />
          <div
            className="absolute left-1/2 h-[84px] w-[160px]"
            style={{
              bottom: 63,
              transform: "translateX(-50%)",
              backgroundImage: "url(/hero-bottom-union.png)",
              backgroundSize: "1280px auto",
              backgroundPosition: "50% 0",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
        <div
          className="absolute bottom-0 left-1/2 z-30"
          style={{ transform: "translate(-50%, calc(50% - 100px))" }}
        >
          <HeroCircleBadge />
        </div>
      </div>

      <main>
        <AboutSection />
        <ServicesSection />
        <HowItWorksSection />
        <VideoStatsSection />
        <FleetSection />
        <WhySection />
        <TestimonialsSection />
        <ChauffeurPromoSection />
      </main>
    </>
  );
}
