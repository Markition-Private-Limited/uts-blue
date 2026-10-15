import { HeroBadge } from "@/components/hero/HeroBadge";
import { AboutCarousel } from "./AboutCarousel";

export function AboutSection() {
  return (
    <section className="w-full overflow-hidden bg-white py-20">
      {/* Text content */}
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 text-center">
        <HeroBadge text="Executive Chauffeur Services" />

        <h2 className="text-4xl font-bold leading-tight tracking-tight text-gray-900">
          More Than a Ride.
          <br />
          A Better{" "}
          <span style={{ color: "#1648D8" }}>Way to Travel</span>
        </h2>

        <p className="text-sm leading-relaxed text-gray-500">
          Every journey should feel effortless. From everyday business travel to special occasions
          and airport transfers, United Travel Services brings together comfort, reliability and
          personal service to make every mile count.
        </p>
      </div>

      {/* Fan carousel */}
      <div className="mt-14 px-6">
        <AboutCarousel />
      </div>
    </section>
  );
}
