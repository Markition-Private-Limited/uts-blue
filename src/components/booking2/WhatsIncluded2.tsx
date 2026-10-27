import { UserCheck, Clock, ShieldCheck, MapPin, Briefcase, Navigation, CalendarCheck, Compass, Sparkles, Building2 } from "lucide-react";
import type { ServiceType2 } from "@/lib/booking2";

const ITEMS: Record<ServiceType2, { title: string; icon: typeof UserCheck }[]> = {
  "airport-transfer": [
    { title: "Professional chauffeur service", icon: UserCheck },
    { title: "Airport pickup coordination", icon: Clock },
    { title: "Comfortable travel to and from the airport", icon: ShieldCheck },
    { title: "All major London airports covered", icon: Navigation },
    { title: "Luggage assistance at pickup and drop-off", icon: Briefcase },
    { title: "Direct routing to your terminal or destination", icon: MapPin },
  ],
  "day-booking": [
    { title: "Dedicated chauffeur for the booked period", icon: UserCheck },
    { title: "Flexible itinerary planning across London", icon: Compass },
    { title: "Business and personal travel support", icon: Building2 },
    { title: "Multiple-stop planning with wait-time", icon: CalendarCheck },
    { title: "Professional door-to-door service", icon: MapPin },
    { title: "Comfortable travel between appointments", icon: ShieldCheck },
  ],
  "hourly-chauffeur": [
    { title: "Private chauffeur for the booked period", icon: UserCheck },
    { title: "Flexible journey planning on your schedule", icon: Clock },
    { title: "Multiple-stop coordination and standby", icon: MapPin },
    { title: "Executive travel convenience and privacy", icon: Sparkles },
    { title: "Professional certified chauffeur standards", icon: ShieldCheck },
    { title: "Comfortable luxury travel across London", icon: Navigation },
  ],
};

export function WhatsIncluded2({ serviceType }: { serviceType: ServiceType2 }) {
  const items = ITEMS[serviceType];

  return (
    <section className="mb-14 border-t border-slate-200 pt-10">
      <h2 className="mb-8 text-xl font-bold tracking-tight text-[#0B1330] sm:text-2xl">What&apos;s Included</h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1648D8]/8 text-[#1648D8]">
                <Icon className="h-4 w-4 stroke-[1.75]" />
              </div>
              <p className="pt-1 text-xs font-medium leading-snug text-slate-700 sm:text-sm">{item.title}</p>
            </div>
          );
        })}
      </div>

      {serviceType !== "airport-transfer" && (
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
          <strong className="text-slate-800">Please note:</strong> No specific unlimited mileage allowance is included in
          the base rates. Any applicable journey mileage boundaries outside Greater London must be confirmed directly with
          UTS.
        </p>
      )}
    </section>
  );
}
