"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { DEMO_LOCATIONS } from "@/lib/booking";

// Glass fields for the hero booking bar: a location input that suggests places as you
// type, and a calendar date picker. Their pop-ups render in a portal (fixed, opening
// upwards) so the backdrop blur works against the hero behind them instead of being
// swallowed by the booking bar's own backdrop filter.

const LABEL = "text-xs font-medium text-white/60";
const INPUT_BASE =
  "w-full bg-transparent text-sm text-white placeholder-white/40 outline-none border-b pb-1 transition-colors";

const GLASS_PANEL: React.CSSProperties = {
  background: "rgba(10, 26, 85, 0.45)",
  backdropFilter: "blur(10px) saturate(140%)",
  WebkitBackdropFilter: "blur(10px) saturate(140%)",
  border: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
};

type Pos = { left: number; bottom: number; width: number };

/** Fixed position (opening upwards) that tracks an anchor element while open. */
function usePopoverPos(open: boolean, anchor: React.RefObject<HTMLElement | null>, minWidth: number): Pos | null {
  const [pos, setPos] = useState<Pos | null>(null);
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = anchor.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = Math.max(r.width, minWidth);
      const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
      setPos({ left, bottom: window.innerHeight - r.top + 10, width });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, anchor, minWidth]);
  return pos;
}

/** Close when the pointer goes down outside both the anchor and the pop-up. */
function useOutsideClose(open: boolean, onClose: () => void, ...refs: React.RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (refs.some((r) => r.current?.contains(t))) return;
      onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

// ─── Location with suggestions ───────────────────────────────────────────────

export function LocationField({
  label,
  placeholder,
  value,
  onChange,
  invalid = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const query = value.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!query) return [];
    const scored = DEMO_LOCATIONS.filter((l) => l.toLowerCase().includes(query)).map((l) => {
      const low = l.toLowerCase();
      // Places (or words) that START with what was typed come first.
      const rank = low.startsWith(query) ? 0 : low.split(/[\s,()]+/).some((w) => w.startsWith(query)) ? 1 : 2;
      return { l, rank };
    });
    return scored.sort((a, b) => a.rank - b.rank).map((s) => s.l).slice(0, 6);
  }, [query]);

  const show = open && suggestions.length > 0;
  const pos = usePopoverPos(show, anchorRef, 300);
  useOutsideClose(show, () => setOpen(false), anchorRef, popRef);

  const pick = (loc: string) => {
    onChange(loc);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!show) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(suggestions[active] ?? suggestions[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Bold the part the visitor typed.
  const highlight = (loc: string) => {
    const i = loc.toLowerCase().indexOf(query);
    if (i < 0 || !query) return loc;
    return (
      <>
        {loc.slice(0, i)}
        <strong className="font-semibold text-white">{loc.slice(i, i + query.length)}</strong>
        {loc.slice(i + query.length)}
      </>
    );
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <label className={LABEL}>{label}</label>
      <div ref={anchorRef}>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={show}
          aria-autocomplete="list"
          onChange={(e) => {
            onChange(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`${INPUT_BASE} ${invalid ? "border-red-400/80" : "border-white/20 focus:border-white/60"}`}
        />
      </div>

      {show &&
        pos &&
        createPortal(
          <div
            ref={popRef}
            role="listbox"
            style={{ ...GLASS_PANEL, position: "fixed", left: pos.left, bottom: pos.bottom, width: pos.width, zIndex: 90 }}
            className="overflow-hidden rounded-2xl p-1.5"
          >
            {suggestions.map((loc, i) => (
              <button
                key={loc}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(loc)}
                className={`no-fill flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-white/75 transition-colors ${
                  i === active ? "bg-white/15 text-white" : "hover:bg-white/10"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/50" />
                <span className="truncate">{highlight(loc)}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

// ─── Glass date picker ───────────────────────────────────────────────────────

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parseISO = (iso: string) => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null;
};
const formatDisplay = (iso: string) => {
  const p = parseISO(iso);
  return p ? `${pad(p.d)}/${pad(p.m + 1)}/${p.y}` : "";
};

export function DateField({
  label,
  value,
  onChange,
  min,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  /** Earliest selectable day, as YYYY-MM-DD. */
  min?: string;
  invalid?: boolean;
}) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  // Read when the calendar opens (never during render, so prerendering stays date-free).
  const [today, setToday] = useState<{ y: number; m: number; d: number } | null>(null);

  const pos = usePopoverPos(open, anchorRef, 300);
  useOutsideClose(open, () => setOpen(false), anchorRef, popRef);

  const show = () => {
    // Start on the chosen month, else the earliest bookable month, else this month.
    const base = parseISO(value) ?? (min ? parseISO(min) : null);
    const now = new Date();
    setToday({ y: now.getFullYear(), m: now.getMonth(), d: now.getDate() });
    setView(base ? { y: base.y, m: base.m } : { y: now.getFullYear(), m: now.getMonth() });
    setOpen(true);
  };

  const minP = min ? parseISO(min) : null;
  const minKey = minP ? minP.y * 372 + minP.m * 31 + minP.d : -Infinity;

  const grid = useMemo(() => {
    if (!view) return [];
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7; // Monday-first
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    while (cells.length % 7) cells.push(null);
    return cells;
  }, [view]);

  const shift = (delta: number) =>
    setView((v) => {
      if (!v) return v;
      const t = v.y * 12 + v.m + delta;
      return { y: Math.floor(t / 12), m: ((t % 12) + 12) % 12 };
    });

  const sel = parseISO(value);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <label className={LABEL}>{label}</label>
      <div ref={anchorRef}>
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : show())}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`no-fill flex w-full items-center justify-between gap-2 border-b pb-1 text-left text-sm transition-colors ${
            invalid ? "border-red-400/80" : open ? "border-white/60" : "border-white/20 hover:border-white/40"
          } ${value ? "text-white" : "text-white/40"}`}
        >
          <span>{value ? formatDisplay(value) : "dd/mm/yyyy"}</span>
          <Calendar className="h-4 w-4 shrink-0 text-white/60" />
        </button>
      </div>

      {open &&
        view &&
        pos &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label="Choose a date"
            style={{ ...GLASS_PANEL, position: "fixed", left: pos.left, bottom: pos.bottom, width: pos.width, zIndex: 90 }}
            className="rounded-2xl p-4 text-white"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="Previous month"
                className="no-fill flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/15 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold tracking-wide">
                {MONTHS[view.m]} {view.y}
              </span>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Next month"
                className="no-fill flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/15 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-wider text-white/45">
              {WEEKDAYS.map((w) => (
                <span key={w} className="py-1">
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {grid.map((d, i) => {
                if (d === null) return <span key={i} />;
                const key = view.y * 372 + view.m * 31 + d;
                const disabled = key < minKey;
                const isSel = !!sel && sel.y === view.y && sel.m === view.m && sel.d === d;
                const isToday = !!today && today.y === view.y && today.m === view.m && today.d === d;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(toISO(view.y, view.m, d));
                      setOpen(false);
                    }}
                    className={`no-fill mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition-colors ${
                      isSel
                        ? "bg-[#1648D8] font-semibold text-white shadow-lg shadow-blue-600/40"
                        : disabled
                          ? "cursor-not-allowed text-white/25"
                          : `text-white/90 hover:bg-white/20 hover:text-white ${isToday ? "ring-1 ring-white/40" : ""}`
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
