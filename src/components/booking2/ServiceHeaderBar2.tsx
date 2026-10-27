"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, PlaneTakeoff, Sun, Clock, ChevronDown, ChevronLeft } from "lucide-react";
import { SERVICE_LABELS2, type ServiceType2 } from "@/lib/booking2";

const TABS: { key: ServiceType2; label: string; icon: typeof PlaneTakeoff }[] = [
  { key: "airport-transfer", label: SERVICE_LABELS2["airport-transfer"], icon: PlaneTakeoff },
  { key: "day-booking", label: SERVICE_LABELS2["day-booking"], icon: Sun },
  { key: "hourly-chauffeur", label: SERVICE_LABELS2["hourly-chauffeur"], icon: Clock },
];

export function ServiceHeaderBar2({
  currentService,
  onServiceChange,
  pickupSummary,
  destinationSummary,
  dateTimeSummary,
}: {
  currentService: ServiceType2;
  onServiceChange: (s: ServiceType2) => void;
  pickupSummary: string;
  destinationSummary?: string;
  dateTimeSummary: string;
}) {
  const [open, setOpen] = useState(false);
  const active = TABS.find((t) => t.key === currentService) ?? TABS[0];
  const others = TABS.filter((t) => t.key !== active.key);

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#050B22]/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1520px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Back arrow + logo — left */}
        <div className="flex items-center gap-3 justify-self-start">
          <Link
            href="/"
            aria-label="Back to homepage"
            title="Back to homepage"
            className="group -ml-1 flex h-10 w-8 shrink-0 items-center justify-center text-white/60 transition-colors duration-300 hover:text-white"
          >
            <ChevronLeft
              strokeWidth={1.25}
              className="h-7 w-7 transition-transform duration-300 ease-out group-hover:-translate-x-1"
            />
          </Link>
          <span aria-hidden className="h-6 w-px bg-white/15" />
          <Link href="/" aria-label="United Travel Services — home" className="flex items-center">
            <Image
              src="/logo.png"
              alt="United Travel Services"
              width={180}
              height={64}
              className="h-12 w-auto object-contain sm:h-14"
              priority
            />
          </Link>
        </div>

        {/* Active service — centre; the other two appear on hover */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
          }}
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10 sm:text-[13px]"
          >
            <active.icon className="hidden h-4 w-4 text-[#9DB0E3] sm:inline" />
            <span>{active.label}</span>
            <ChevronDown className={`h-4 w-4 text-[#9DB0E3] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>

          {/* pt-2 keeps the hover alive while the pointer crosses the gap to the menu */}
          <div
            role="menu"
            className={`absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 transition-all duration-200 ${
              open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-xl border border-white/15 bg-[#0B1330] p-1.5 shadow-2xl shadow-black/50">
              {others.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onServiceChange(key);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#9DB0E3] transition-all hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trip summary — right */}
        <div className="hidden min-w-0 justify-end lg:flex">
        <div className="flex min-w-0 max-w-full items-center gap-2 truncate text-xs text-[#9DB0E3]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9DB0E3]" />
          <span className="truncate">
            <strong className="font-medium text-white">{pickupSummary}</strong>
            {destinationSummary && (
              <>
                <span className="mx-1.5 text-[#9DB0E3]/60">→</span>
                <span>{destinationSummary}</span>
              </>
            )}
          </span>
          <span className="mx-1 text-[#9DB0E3]/40">|</span>
          <span className="whitespace-nowrap text-[#9DB0E3]">{dateTimeSummary}</span>
        </div>
        </div>
      </div>
    </div>
  );
}
