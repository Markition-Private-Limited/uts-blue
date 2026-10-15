import { HeroBadge } from "./HeroBadge";
import { HeroCTA } from "./HeroCTA";
import { HeroHeadline } from "./HeroHeadline";
import { HeroBookingBar } from "./HeroBookingBar";
import { heroContent } from "@/content/hero.content";

const BADGE_RADIUS = 52;

export function HeroSection() {
  const { badge, headline, description, cta } = heroContent;

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden bg-white"
      style={{
        WebkitMaskImage: `radial-gradient(circle ${BADGE_RADIUS}px at 50% 100%, transparent ${BADGE_RADIUS}px, white ${BADGE_RADIUS + 1}px)`,
        maskImage: `radial-gradient(circle ${BADGE_RADIUS}px at 50% 100%, transparent ${BADGE_RADIUS}px, white ${BADGE_RADIUS + 1}px)`,
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          filter: "blur(4px)",
          transform: "scale(1.05)",
        }}
        aria-hidden
      />

      {/* Blue-tinted overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "#1E4FD926" }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-40 lg:px-8">
        <div className="flex w-full max-w-4xl flex-col items-center gap-8">
          {badge && <HeroBadge text={badge} />}
          <HeroHeadline headline={headline} description={description} />
          <HeroCTA buttons={cta} />
        </div>
      </div>

      {/* Booking bar */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 lg:px-8">
        <HeroBookingBar />
      </div>
    </section>
  );
}
