export type ServiceType = "transfer" | "day" | "hourly";
export type ClassKey = "economy" | "business" | "first" | "mpv";

export interface Vehicle {
  id: string;
  /** Fleet category, e.g. "Business Class". */
  title: string;
  /** Example car + alternative, e.g. "Mercedes-Benz E-Class or similar". */
  models: string;
  image: string;
  passengers: number;
  luggage: number;
  features: string[];
  /** Which fare table this class is priced from. */
  rateClass: ClassKey;
}

export interface PassengerInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface BookingState {
  service: ServiceType;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  duration: number;
  passengers: number;
  luggage: number;
  distanceKm: number;
  passengerInfo: PassengerInfo;
}

/** Data the hero "Find Your Ride" bar hands over to the /book page. */
export interface BookingDraft {
  pickup: string;
  date: string;
  name: string;
  phone: string;
}

export const DRAFT_KEY = "uts-booking-draft";

export const UTS_RATES: Record<ServiceType, Record<ClassKey, number>> = {
  transfer: { economy: 1.48, business: 2.28, first: 2.77, mpv: 1.97 }, // £/km
  day: { economy: 30, business: 40, first: 60, mpv: 40 }, // £/hour
  hourly: { economy: 60, business: 60, first: 60, mpv: 80 }, // £/hour
};

// Same seven classes (and photos) as the Fleet section on the home page.
export const VEHICLES: Vehicle[] = [
  {
    id: "economy-saloon",
    title: "Economy Saloon",
    models: "VW Passat / Kia Niro or similar",
    image: "/fleet/economy-saloon-vw-passat.webp",
    passengers: 3,
    luggage: 2,
    features: ["Climate Control", "Quiet Cabin", "Smooth Ride"],
    rateClass: "economy",
  },
  {
    id: "business-class",
    title: "Business Class",
    models: "Mercedes-Benz E-Class or similar",
    image: "/fleet/business-class-mercedes-e-class.webp",
    passengers: 3,
    luggage: 2,
    features: ["Leather Interior", "Complimentary Water", "Wi-Fi Onboard"],
    rateClass: "business",
  },
  {
    id: "first-class",
    title: "First Class",
    models: "Mercedes-Benz S-Class or similar",
    image: "/fleet/first-class-mercedes-s-class.webp",
    passengers: 3,
    luggage: 3,
    features: ["Reclining Rear Seats", "Ambient Lighting", "Privacy Blinds"],
    rateClass: "first",
  },
  {
    id: "first-class-van",
    title: "First Class Van",
    models: "Mercedes-Benz V-Class or similar",
    image: "/fleet/first-class-van-mercedes-v-class.webp",
    passengers: 6,
    luggage: 6,
    features: ["Conference Seating", "Extra Luggage Space", "Power Outlets"],
    rateClass: "mpv",
  },
  {
    id: "van",
    title: "Van",
    models: "8/9 - Seater Van",
    image: "/fleet/van-8-9-seater.webp",
    passengers: 8,
    luggage: 8,
    features: ["Spacious Cabin", "Group Travel", "Ample Luggage Room"],
    rateClass: "mpv",
  },
  {
    id: "mpv",
    title: "MPV",
    models: "VW Sharan / Ford Galaxy or similar",
    image: "/fleet/mpv-vw-sharan.webp",
    passengers: 7,
    luggage: 5,
    features: ["Seven Seats", "Sliding Doors", "Family Friendly"],
    rateClass: "mpv",
  },
  {
    id: "standard-van",
    title: "Standard Van",
    models: "Hyundai i800 / VW Transporter or similar",
    image: "/fleet/standard-van-hyundai-i800.webp",
    passengers: 6,
    luggage: 6,
    features: ["Versatile Seating", "Large Boot Space", "Climate Control"],
    rateClass: "mpv",
  },
];

export const DEMO_LOCATIONS = [
  "London Heathrow Airport (LHR), Terminal 5",
  "London Gatwick Airport (LGW), South Terminal",
  "London City Airport (LCY)",
  "The Ritz London, 150 Piccadilly",
  "The Savoy Hotel, Strand, London",
  "Claridge's, Brook Street, Mayfair",
  "Harrods, Brompton Road, Knightsbridge",
  "St Pancras International Station, London",
  "Canary Wharf Financial District, London",
  "Central London, Mayfair District",
];

export const SERVICE_LABELS: Record<ServiceType, string> = {
  transfer: "AIRPORT TRANSFER",
  day: "DAY BOOKING",
  hourly: "HOURLY CHAUFFEUR",
};

export function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/** Deterministic demo distance (km) from the two address strings. */
export function estimateDistanceKm(pickup: string, dropoff: string): number {
  return ((pickup.length + dropoff.length) % 40) + 15;
}

export function calculateFare(state: BookingState, classKey: ClassKey): number {
  const rate = UTS_RATES[state.service][classKey];
  if (state.service === "transfer") {
    return Math.max(50, Math.round(state.distanceKm * rate));
  }
  return Math.round(Math.max(4, state.duration) * rate);
}

export function defaultBookingState(): BookingState {
  return {
    service: "transfer",
    pickup: "",
    dropoff: "",
    date: "", // filled client-side (tomorrowISO) — avoids new Date() during render
    time: "10:00",
    duration: 4,
    passengers: 1,
    luggage: 2,
    distanceKm: 28.5,
    passengerInfo: { name: "", email: "", phone: "", notes: "" },
  };
}
