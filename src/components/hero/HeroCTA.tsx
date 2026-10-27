"use client";

import { ArrowButton } from "@/components/navbar/ArrowButton";
import type { HeroCTAButton } from "@/types/hero";

interface HeroCTAProps {
  buttons: HeroCTAButton[];
}

export function HeroCTA({ buttons }: HeroCTAProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {buttons.map((btn) => (
        <ArrowButton
          key={btn.label}
          label={btn.label}
          href={btn.href}
          variant={btn.variant === "primary" ? "blue" : "outline"}
        />
      ))}
    </div>
  );
}
