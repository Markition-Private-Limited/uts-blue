"use client";

import { useEffect } from "react";

// Decides, per button, which way the hover fill goes (see the button-hover rules in
// globals.css): a button with light text (blue / dark buttons) gets a white fill, a
// button with dark or blue text (white / light buttons) gets a dark-blue fill.
// It reads the RESTING text colour as the pointer or keyboard focus arrives, then
// clears the tone again on leave so state changes (selected, disabled…) re-evaluate.

const TARGET = "button:not(.no-fill), .btn-fill";

function isLightText(color: string): boolean {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return false;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 200;
}

export function ButtonFillTone() {
  useEffect(() => {
    const arrive = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.(TARGET) as HTMLElement | null;
      if (!el || el.dataset.tone) return;
      el.dataset.tone = isLightText(getComputedStyle(el).color) ? "on-dark" : "on-light";
    };
    const leave = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.(TARGET) as HTMLElement | null;
      if (!el) return;
      // Ignore moves between children of the same button.
      const next = (e as PointerEvent | FocusEvent).relatedTarget as Node | null;
      if (next && el.contains(next)) return;
      delete el.dataset.tone;
    };

    document.addEventListener("pointerover", arrive, true);
    document.addEventListener("focusin", arrive, true);
    document.addEventListener("pointerout", leave, true);
    document.addEventListener("focusout", leave, true);
    return () => {
      document.removeEventListener("pointerover", arrive, true);
      document.removeEventListener("focusin", arrive, true);
      document.removeEventListener("pointerout", leave, true);
      document.removeEventListener("focusout", leave, true);
    };
  }, []);

  return null;
}
