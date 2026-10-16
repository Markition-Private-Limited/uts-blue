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

// Solid white "bite" taken out of the hero's bottom edge, drawn directly as a
// filled path (no masking/compositing) so it renders identically everywhere.
// Both joins — flat-to-fillet and fillet-to-dome — are true circle-tangent arcs,
// so there's no corner where the flat edge meets the curve.
const BITE_WIDTH = 209.22
const BITE_HEIGHT = 48
const BITE_PATH =
  'M0,48 A90,90 0 0,0 68.22,16.7 A48,48 0 0,0 104.61,0 A48,48 0 0,0 141.0,16.7 A90,90 0 0,0 209.22,48 Z'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <HeroSection />
        <svg
          viewBox={`0 0 ${BITE_WIDTH} ${BITE_HEIGHT}`}
          width={BITE_WIDTH}
          height={BITE_HEIGHT}
          className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2"
          aria-hidden
        >
          <path d={BITE_PATH} fill="white" />
        </svg>
        <div className="absolute bottom-0 left-1/2 z-30 -translate-x-1/2 translate-y-1/2">
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
