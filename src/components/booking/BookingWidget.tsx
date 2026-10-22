"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  Clock,
  FileText,
  Hourglass,
  Mail,
  MapPin,
  Navigation,
  Phone,
  PlaneTakeoff,
  Route,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import {
  DEMO_LOCATIONS,
  DRAFT_KEY,
  SERVICE_LABELS,
  VEHICLES,
  calculateFare,
  defaultBookingState,
  tomorrowISO,
  estimateDistanceKm,
  type BookingDraft,
  type BookingState,
  type ServiceType,
  type Vehicle,
} from "@/lib/booking";

const STEPS = ["JOURNEY", "VEHICLE", "PASSENGER", "REVIEW", "CONFIRM"];

const LABEL = "block text-xs font-semibold uppercase tracking-wider text-[#9DB0E3]";
const ERROR = "mt-1 pl-1 text-xs font-medium text-red-400";
const INPUT = "w-full bg-transparent text-sm text-white placeholder-[#9DB0E3] focus:outline-none";
const PRIMARY_BTN =
  "flex w-full items-center justify-center gap-3 rounded-full bg-[#1648D8] py-4 px-6 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-600/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[#1E4FD9] hover:shadow-xl hover:shadow-blue-600/50 active:translate-y-0 active:scale-100";
const BACK_BTN = "flex items-center gap-1 text-xs text-[#9DB0E3] transition-colors hover:text-white";

type Errors = Partial<Record<"pickup" | "dropoff" | "date" | "time", string>>;

export function BookingWidget({ initialDraft }: { initialDraft?: BookingDraft } = {}) {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BookingState>(defaultBookingState);
  const [errors, setErrors] = useState<Errors>({});
  const [openSuggest, setOpenSuggest] = useState<"pickup" | "dropoff" | null>(null);
  const [selected, setSelected] = useState<{ vehicle: Vehicle; fare: number } | null>(null);
  const [ref, setRef] = useState("");
  const lenis = useLenis();
  const rootRef = useRef<HTMLDivElement>(null);

  // Pre-fill the journey from whatever the hero "Find Your Ride" bar saved.
  useEffect(() => {
    setState((s) => (s.date ? s : { ...s, date: tomorrowISO() }));
    try {
      // A draft passed in directly (popup) wins; otherwise pick up one saved for the /book page.
      let draft = initialDraft;
      if (!draft) {
        const raw = sessionStorage.getItem(DRAFT_KEY);
        if (raw) {
          draft = JSON.parse(raw) as BookingDraft;
          sessionStorage.removeItem(DRAFT_KEY);
        }
      }
      if (draft) {
        const d = draft;
        setState((s) => ({
          ...s,
          pickup: d.pickup || s.pickup,
          date: d.date || s.date,
          passengerInfo: { ...s.passengerInfo, name: d.name || "", phone: d.phone || "" },
        }));
      }
    } catch {
      /* storage unavailable — start from step 1 */
    }
    setReady(true);
  }, []);

  const update = (patch: Partial<BookingState>) => setState((s) => ({ ...s, ...patch }));

  const isTransfer = state.service === "transfer";

  const selectService = (service: ServiceType) => {
    update({ service });
    setErrors({});
  };

  const setAddress = (field: "pickup" | "dropoff", value: string) => {
    const next = { ...state, [field]: value };
    next.distanceKm =
      next.pickup.trim() && next.dropoff.trim()
        ? estimateDistanceKm(next.pickup, next.dropoff)
        : state.distanceKm;
    setState(next);
    setErrors((e) => ({ ...e, [field]: undefined }));
    setOpenSuggest(value.length > 1 ? field : null);
  };

  const adjust = (type: "passengers" | "luggage", delta: number) => {
    const [min, max] = type === "passengers" ? [1, 8] : [0, 10];
    update({ [type]: Math.max(min, Math.min(max, state[type] + delta)) });
  };

  const validateJourney = (): boolean => {
    const e: Errors = {};
    if (!state.pickup.trim()) e.pickup = "Please enter a valid pickup address, airport, or hotel.";
    if (isTransfer) {
      if (!state.dropoff.trim()) e.dropoff = "Please enter a valid drop-off destination.";
      else if (state.pickup.trim().toLowerCase() === state.dropoff.trim().toLowerCase())
        e.dropoff = "Drop-off location must be different from pickup location.";
    }
    if (!state.date) e.date = "Please select a date.";
    if (!state.time) e.time = "Please select a pickup time.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goStep = (n: number) => {
    setStep(n);
    // Inside the popup the form scrolls within its own overlay, not the page.
    const popup = rootRef.current?.closest("[data-modal-scroll]");
    if (popup) popup.dispatchEvent(new CustomEvent("booking-scroll-top"));
    else if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitJourney = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validateJourney()) goStep(2);
  };

  const submitPassenger = (ev: React.FormEvent) => {
    ev.preventDefault();
    // Arrived from the hero without a drop-off? Finish the journey details first.
    if (!validateJourney()) {
      goStep(1);
      return;
    }
    goStep(4);
  };

  const confirm = () => {
    setRef("UTS-" + Math.floor(10000 + Math.random() * 90000));
    goStep(5);
  };

  const reset = () => {
    setState({ ...defaultBookingState(), date: tomorrowISO() });
    setSelected(null);
    setErrors({});
    goStep(1);
  };

  const setPassenger = (patch: Partial<BookingState["passengerInfo"]>) =>
    update({ passengerInfo: { ...state.passengerInfo, ...patch } });

  if (!ready) {
    return <div className="uts-card min-h-[420px] w-full max-w-5xl rounded-2xl" />;
  }

  return (
    <div ref={rootRef} className="uts-book uts-card w-full max-w-5xl rounded-2xl p-4 text-[#F6F6F4] sm:p-6 md:p-8">
      {/* Progress */}
      <nav aria-label="Booking Progress" className="mb-8 border-b border-white/10 pb-5">
        <ol className="flex items-center justify-between text-xs font-medium sm:text-sm">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <li key={label} className="contents">
                <span
                  className={`flex items-center space-x-2 ${
                    active ? "text-white" : done ? "text-white/80" : "text-[#9DB0E3]"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      active
                        ? "bg-[#1648D8] font-bold text-white shadow-md shadow-blue-600/40"
                        : done
                          ? "bg-white/20 font-bold text-white"
                          : "border border-white/20"
                    }`}
                  >
                    {n}
                  </span>
                  <span className="hidden font-medium tracking-wider sm:inline">{label}</span>
                </span>
                {n < STEPS.length && <div className="mx-2 h-px flex-1 bg-white/10 sm:mx-4" />}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* STEP 1 — JOURNEY */}
      {step === 1 && (
        <section className="space-y-6">
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-[#050B22]/70 p-1">
            {(
              [
                ["transfer", "Airport Transfer", PlaneTakeoff],
                ["day", "Day Booking", Sun],
                ["hourly", "Hourly Chauffeur", Clock],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => selectService(key)}
                className={`flex items-center justify-center gap-2 rounded-lg px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all md:text-sm ${
                  state.service === key ? "uts-tab-active" : "text-[#9DB0E3] hover:text-white"
                }`}
              >
                <Icon className="hidden h-4 w-4 sm:inline" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submitJourney} className="space-y-5" noValidate>
            <div className={`grid grid-cols-1 gap-4 ${isTransfer ? "md:grid-cols-2" : ""}`}>
              <AddressField
                label="Pickup Location"
                icon={<MapPin className="h-5 w-5 shrink-0 text-white/70" />}
                placeholder="Enter pickup address, airport or hotel"
                value={state.pickup}
                error={errors.pickup}
                open={openSuggest === "pickup"}
                onChange={(v) => setAddress("pickup", v)}
                onPick={(v) => {
                  setAddress("pickup", v);
                  setOpenSuggest(null);
                }}
                onClose={() => setOpenSuggest(null)}
              />
              {isTransfer && (
                <AddressField
                  label="Drop-off Location"
                  icon={<Navigation className="h-5 w-5 shrink-0 text-white/70" />}
                  placeholder="Enter destination address, airport or hotel"
                  value={state.dropoff}
                  error={errors.dropoff}
                  open={openSuggest === "dropoff"}
                  onChange={(v) => setAddress("dropoff", v)}
                  onPick={(v) => {
                    setAddress("dropoff", v);
                    setOpenSuggest(null);
                  }}
                  onClose={() => setOpenSuggest(null)}
                />
              )}
            </div>

            <div className={`grid grid-cols-1 gap-4 ${isTransfer ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              <div className="space-y-1.5">
                <label className={LABEL}>
                  {isTransfer ? "Pickup Date" : "Booking Date"} <span className="text-red-400">*</span>
                </label>
                <div className="uts-input-box flex items-center space-x-2 rounded-xl p-3">
                  <Calendar className="h-5 w-5 shrink-0 text-white/70" />
                  <input
                    type="date"
                    value={state.date}
                    onChange={(e) => {
                      update({ date: e.target.value });
                      setErrors((x) => ({ ...x, date: undefined }));
                    }}
                    className={`${INPUT} cursor-pointer [color-scheme:dark]`}
                  />
                </div>
                {errors.date && <p className={ERROR}>{errors.date}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={LABEL}>
                  {isTransfer ? "Pickup Time" : "Start Time"} <span className="text-red-400">*</span>
                </label>
                <div className="uts-input-box flex items-center space-x-2 rounded-xl p-3">
                  <Clock className="h-5 w-5 shrink-0 text-white/70" />
                  <input
                    type="time"
                    value={state.time}
                    onChange={(e) => {
                      update({ time: e.target.value });
                      setErrors((x) => ({ ...x, time: undefined }));
                    }}
                    className={`${INPUT} cursor-pointer [color-scheme:dark]`}
                  />
                </div>
                {errors.time && <p className={ERROR}>{errors.time}</p>}
              </div>

              {!isTransfer && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={LABEL}>
                      Duration <span className="text-red-400">*</span>
                    </label>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-white/60">
                      4 hr min
                    </span>
                  </div>
                  <div className="uts-input-box flex items-center space-x-2 rounded-xl p-3">
                    <Hourglass className="h-5 w-5 shrink-0 text-white/70" />
                    <select
                      value={state.duration}
                      onChange={(e) => update({ duration: parseInt(e.target.value) })}
                      className={`${INPUT} cursor-pointer [&>option]:bg-[#0B1330] [&>option]:text-white`}
                    >
                      <option value={4}>4 Hours (Minimum)</option>
                      <option value={5}>5 Hours</option>
                      <option value={6}>6 Hours</option>
                      <option value={8}>8 Hours (Full Day)</option>
                      <option value={10}>10 Hours</option>
                      <option value={12}>12 Hours</option>
                      <option value={24}>24 Hours (Multi-Day)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Full Name"
                icon={<User className="h-5 w-5 text-white/70" />}
                placeholder="Enter Full Name"
                value={state.passengerInfo.name}
                onChange={(v) => setPassenger({ name: v })}
              />
              <TextField
                label="Mobile Number"
                type="tel"
                icon={<Phone className="h-5 w-5 text-white/70" />}
                placeholder="+44 7000 000000"
                value={state.passengerInfo.phone}
                onChange={(v) => setPassenger({ phone: v })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Counter
                label="Passengers"
                icon={<Users className="h-5 w-5 text-white/70" />}
                text={`${state.passengers} Passenger${state.passengers > 1 ? "s" : ""}`}
                value={state.passengers}
                onMinus={() => adjust("passengers", -1)}
                onPlus={() => adjust("passengers", 1)}
              />
              <Counter
                label="Luggage"
                icon={<Briefcase className="h-5 w-5 text-white/70" />}
                text={`${state.luggage} Luggage`}
                value={state.luggage}
                onMinus={() => adjust("luggage", -1)}
                onPlus={() => adjust("luggage", 1)}
              />
            </div>

            {isTransfer && state.pickup.trim() && state.dropoff.trim() && (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-[#9DB0E3]">
                <div className="flex items-center space-x-2">
                  <Route className="h-4 w-4 text-white" />
                  <span>
                    Estimated Road Distance: <strong className="text-white">{state.distanceKm} km</strong>
                  </span>
                </div>
                <span className="text-[10px] italic text-white/40">Demo Route Matrix</span>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" className={PRIMARY_BTN}>
                <span>Find Your Ride</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 2 — VEHICLE */}
      {step === 2 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-lg font-medium text-white">
                Select Your Vehicle Class
              </h2>
              <p className="text-xs text-[#9DB0E3]">
                All vehicles include complimentary bottled water, Wi-Fi &amp; flight tracking.
              </p>
            </div>
            <button type="button" onClick={() => goStep(1)} className={BACK_BTN}>
              <ChevronLeft className="h-4 w-4" /> Back to Details
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {VEHICLES.map((v) => {
              const fare = calculateFare(state, v.rateClass);
              return (
                <div
                  key={v.id}
                  className="uts-glass-panel flex flex-col justify-between rounded-xl border border-white/10 p-4 transition-all duration-200 hover:border-white/30"
                >
                  <div>
                    <div className="relative mb-3 aspect-[571/330] w-full overflow-hidden rounded-lg">
                      <Image
                        src={v.image}
                        alt={v.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    <div className="mb-2">
                      <h3 className="flex items-baseline gap-2 whitespace-nowrap text-white">
                        <span className="shrink-0 font-[family-name:var(--font-cinzel)] text-base font-semibold">
                          {v.title}
                        </span>
                        <span className="shrink-0 text-[#9DB0E3]">|</span>
                        <span
                          title={v.models}
                          className="min-w-0 truncate font-[family-name:var(--font-cinzel)] text-xs font-semibold text-white/90"
                        >
                          {v.models}
                        </span>
                      </h3>
                      <div className="mt-1.5 flex items-end justify-between">
                        <div className="flex items-center space-x-3 text-xs text-[#9DB0E3]">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {v.passengers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" /> {v.luggage}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] uppercase text-[#9DB0E3]">Est. Total</span>
                          <span className="text-xl font-bold text-white">£{fare}</span>
                        </div>
                      </div>
                    </div>

                    <ul className="mb-4 space-y-1 border-t border-white/5 pt-2 text-[11px] text-[#9DB0E3]">
                      {v.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-white/70" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelected({ vehicle: v, fare });
                      goStep(3);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1648D8] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#1E4FD9] hover:shadow-lg hover:shadow-blue-600/40"
                  >
                    <span>Select Vehicle</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* STEP 3 — PASSENGER */}
      {step === 3 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-lg font-medium text-white">
                Passenger Information
              </h2>
              <p className="text-xs text-[#9DB0E3]">
                Enter primary passenger contact details for dispatch confirmation.
              </p>
            </div>
            <button type="button" onClick={() => goStep(2)} className={BACK_BTN}>
              <ChevronLeft className="h-4 w-4" /> Back to Vehicles
            </button>
          </div>

          <form onSubmit={submitPassenger} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Full Name"
                required
                icon={<User className="h-5 w-5 text-white/70" />}
                placeholder="Lord / Lady / Mr / Ms..."
                value={state.passengerInfo.name}
                onChange={(v) => setPassenger({ name: v })}
              />
              <TextField
                label="Email Address"
                required
                type="email"
                icon={<Mail className="h-5 w-5 text-white/70" />}
                placeholder="client@domain.com"
                value={state.passengerInfo.email}
                onChange={(v) => setPassenger({ email: v })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Mobile Phone"
                required
                type="tel"
                icon={<Phone className="h-5 w-5 text-white/70" />}
                placeholder="+44 7000 000000"
                value={state.passengerInfo.phone}
                onChange={(v) => setPassenger({ phone: v })}
              />
              <TextField
                label="Flight No. or Special Requirements"
                icon={<FileText className="h-5 w-5 text-white/70" />}
                placeholder="e.g. Flight BA123, Child Seat Needed"
                value={state.passengerInfo.notes}
                onChange={(v) => setPassenger({ notes: v })}
              />
            </div>
            <button type="submit" className={`${PRIMARY_BTN} mt-4`}>
              <span>Review Reservation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      {/* STEP 4 — REVIEW */}
      {step === 4 && selected && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-lg font-medium text-white">
                Review Journey Summary
              </h2>
              <p className="text-xs text-[#9DB0E3]">Please verify your booking itinerary before confirmation.</p>
            </div>
            <button type="button" onClick={() => goStep(3)} className={BACK_BTN}>
              <ChevronLeft className="h-4 w-4" /> Edit Details
            </button>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-[#050B22]/60 p-5">
            <div className="flex flex-col items-start justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {SERVICE_LABELS[state.service]}
                </span>
                <h3 className="mt-2 flex flex-wrap items-baseline gap-2 text-white">
                  <span className="font-[family-name:var(--font-cinzel)] text-xl font-semibold">
                    {selected.vehicle.title}
                  </span>
                  <span className="text-[#9DB0E3]">|</span>
                  <span className="font-[family-name:var(--font-cinzel)] text-sm font-semibold text-white/90">
                    {selected.vehicle.models}
                  </span>
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs uppercase text-[#9DB0E3]">Estimated Fare</p>
                <p className="text-2xl font-bold text-white">£{selected.fare}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
              <div className="space-y-2">
                <p className="font-semibold uppercase text-[#9DB0E3]">Route Details</p>
                <Row k="From" v={state.pickup} />
                {isTransfer ? <Row k="To" v={state.dropoff} /> : <Row k="Duration" v={`${state.duration} Hours`} />}
              </div>
              <div className="space-y-2">
                <p className="font-semibold uppercase text-[#9DB0E3]">Date &amp; Time</p>
                <Row k="Date" v={state.date} />
                <Row k="Time" v={state.time} />
                <p className="text-white">
                  <strong className="text-[#9DB0E3]">Passengers:</strong> {state.passengers} |{" "}
                  <strong className="text-[#9DB0E3]">Luggage:</strong> {state.luggage}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 border-t border-white/10 pt-3 text-xs md:grid-cols-2">
              <Row k="Lead Passenger" v={state.passengerInfo.name} />
              <Row k="Contact Phone" v={state.passengerInfo.phone} />
              <div className="md:col-span-2">
                <Row k="Email" v={state.passengerInfo.email} />
              </div>
            </div>
          </div>

          <button type="button" onClick={confirm} className={`${PRIMARY_BTN} shadow-2xl`}>
            <CheckCircle className="h-5 w-5" />
            <span>Confirm Chauffeur Reservation</span>
          </button>
        </section>
      )}

      {/* STEP 5 — CONFIRM */}
      {step === 5 && (
        <section className="space-y-6 py-4 text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white">
            <Check className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9DB0E3]">Reservation Received</span>
            <h2 className="mt-1 text-2xl font-medium text-white md:text-3xl">
              Journey Confirmed
            </h2>
            <p className="mt-2 text-xs text-[#9DB0E3]">
              Reference Code: <strong className="font-mono text-white">{ref}</strong>
            </p>
          </div>
          <div className="mx-auto max-w-md space-y-2 rounded-xl border border-white/10 bg-[#050B22]/60 p-5 text-left text-xs">
            <p className="border-b border-white/10 pb-2 font-semibold uppercase text-[#9DB0E3]">
              Status: Demo Reservation Logged
            </p>
            <p className="text-white">A dispatch representative will contact you via mobile prior to pickup time.</p>
            <p className="pt-2 text-[#9DB0E3]">Thank you for choosing United Travel Services.</p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-white/25 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:border-white/40"
          >
            Book Another Journey
          </button>
        </section>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <p className="text-white">
      <strong className="text-[#9DB0E3]">{k}:</strong> <span>{v || "--"}</span>
    </p>
  );
}

function Counter({
  label,
  icon,
  text,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  icon: React.ReactNode;
  text: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white transition hover:bg-white/20";
  return (
    <div className="space-y-1.5">
      <label className={LABEL}>{label}</label>
      <div className="uts-input-box flex items-center justify-between rounded-xl p-3">
        <div className="flex items-center space-x-3">
          {icon}
          <span className="text-sm font-medium text-white">{text}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button type="button" aria-label={`Decrease ${label}`} onClick={onMinus} className={btn}>
            -
          </button>
          <span className="w-6 text-center text-sm font-bold">{value}</span>
          <button type="button" aria-label={`Increase ${label}`} onClick={onPlus} className={btn}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className={LABEL}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="uts-input-box flex items-center space-x-2 rounded-xl p-3">
        {icon}
        <input
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT}
        />
      </div>
    </div>
  );
}

function AddressField({
  label,
  icon,
  placeholder,
  value,
  error,
  open,
  onChange,
  onPick,
  onClose,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  error?: string;
  open: boolean;
  onChange: (v: string) => void;
  onPick: (v: string) => void;
  onClose: () => void;
}) {
  const matches = open ? DEMO_LOCATIONS.filter((l) => l.toLowerCase().includes(value.toLowerCase())) : [];
  return (
    <div className="relative space-y-1.5">
      <label className={LABEL}>
        {label} <span className="text-red-400">*</span>
      </label>
      <div className="uts-input-box flex items-center space-x-3 rounded-xl p-3.5">
        {icon}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTimeout(onClose, 150)}
          className={INPUT}
        />
        {value && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              onChange("");
              onClose();
            }}
            className="text-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className={ERROR}>{error}</p>}
      {matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/15 bg-[#0B1330] shadow-2xl">
          {matches.map((loc) => (
            <div
              key={loc}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(loc)}
              className="flex cursor-pointer items-center gap-2 border-b border-white/5 px-4 py-2.5 text-xs text-white/90 last:border-0 hover:bg-white/10"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9DB0E3]" />
              <span>{loc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
