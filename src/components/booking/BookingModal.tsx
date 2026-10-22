"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { BookingWidget } from "./BookingWidget";
import type { BookingDraft } from "@/lib/booking";

interface BookingModalApi {
  /** Open the booking form as a popup, optionally pre-filled. */
  open: (draft?: BookingDraft) => void;
}

const BookingModalContext = createContext<BookingModalApi | null>(null);

export function useBookingModal(): BookingModalApi {
  const ctx = useContext(BookingModalContext);
  if (!ctx) throw new Error("useBookingModal must be used inside <BookingModalProvider>");
  return ctx;
}

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<BookingDraft | undefined>(undefined);
  // Bumped on every open so the form always starts fresh.
  const [nonce, setNonce] = useState(0);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  const open = useCallback((d?: BookingDraft) => {
    setDraft(d);
    setNonce((n) => n + 1);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  // Lock the page behind the popup (Lenis smooth-scroll + native overflow) and close on Esc.
  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [isOpen, lenis, close]);

  const api = useMemo(() => ({ open }), [open]);

  return (
    <BookingModalContext.Provider value={api}>
      {children}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Book your chauffeur"
            data-lenis-prevent
            data-modal-scroll
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#050B22]/80 px-4 pb-10 pt-6 backdrop-blur-md sm:pt-10"
          >
            <div className="relative w-full max-w-5xl pt-12">
              <button
                type="button"
                onClick={close}
                aria-label="Close booking form"
                className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <BookingWidget key={nonce} initialDraft={draft} />
            </div>
          </div>,
          document.body,
        )}
    </BookingModalContext.Provider>
  );
}
