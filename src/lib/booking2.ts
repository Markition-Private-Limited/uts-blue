// Data + pricing for the full booking page (/book), ported from the UTS 2nd
// variation booking prototype and re-themed to the site's dark blue palette.

export type ServiceType2 = "airport-transfer" | "day-booking" | "hourly-chauffeur";

export type VehicleTier2 =
  | "economy"
  | "business"
  | "first"
  | "mpv"
  | "first-class-van"
  | "van"
  | "standard-van";

export interface Vehicle2 {
  id: VehicleTier2;
  name: string;
  modelExample: string;
  passengers: number;
  luggage: number;
  image: string;
  description: string;
  features: string[];
  /** £ per unit for each service; null = "price to be confirmed". */
  airportRateKm: number | null;
  dayRateHour: number | null;
  hourlyRateHour: number | null;
}

export interface ItineraryStop2 {
  id: string;
  address: string;
}

export interface BookingState2 {
  serviceType: ServiceType2;
  selectedVehicleId: VehicleTier2;
  transferDirection: "departure" | "arrival";
  sampleDistanceKm: number;
  flightNumber: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  pickupTime: string;
  durationHours: number;
  stops: ItineraryStop2[];
  passengers: number;
  luggageCount: number;
  luggageType: "carry-on" | "check-in" | "large";
  specialInstructions: string;
}

// Same seven classes and photography as the Fleet section on the home page.
export const FLEET2: Vehicle2[] = [
  {
    id: "business",
    name: "Business Class",
    modelExample: "Mercedes-Benz E-Class or similar",
    passengers: 3,
    luggage: 2,
    image: "/fleet/business-class-mercedes-e-class.webp",
    description:
      "Refined executive travel for every journey. Business Class provides a composed, private environment with a professional chauffeur and full luggage assistance.",
    features: [
      "Complimentary Wi-Fi & chilled mineral water",
      "Rear climate control and device charging ports",
      "Immaculately maintained executive saloon",
      "Discreet and courteous professional chauffeur",
    ],
    airportRateKm: 2.28,
    dayRateHour: 40,
    hourlyRateHour: 60,
  },
  {
    id: "first",
    name: "First Class",
    modelExample: "Mercedes-Benz S-Class or similar",
    passengers: 3,
    luggage: 3,
    image: "/fleet/first-class-mercedes-s-class.webp",
    description:
      "The pinnacle of automotive luxury and prestige. An extraordinarily quiet cabin, acoustic glazing, and sublime ride comfort for discerning travellers.",
    features: [
      "Reclining Nappa leather executive rear seats",
      "Active noise isolation and acoustic glazing",
      "Chauffeur protocol with umbrella service",
      "Premium refreshments and hot towel service",
    ],
    airportRateKm: 2.77,
    dayRateHour: 60,
    hourlyRateHour: 60,
  },
  {
    id: "economy",
    name: "Economy Saloon",
    modelExample: "Volkswagen Passat / Kia Niro or similar",
    passengers: 3,
    luggage: 2,
    image: "/fleet/economy-saloon-vw-passat.webp",
    description:
      "Dependable, understated executive transportation offering clean comfort, punctuality, and professional chauffeur standards across London.",
    features: [
      "Comfortable modern saloon seating",
      "Air conditioning and USB charging",
      "Punctual professional driver",
      "Direct routing with luggage assistance",
    ],
    airportRateKm: 1.48,
    dayRateHour: 30,
    hourlyRateHour: 60,
  },
  {
    id: "mpv",
    name: "MPV",
    modelExample: "Volkswagen Sharan / Ford Galaxy or similar",
    passengers: 7,
    luggage: 5,
    image: "/fleet/mpv-vw-sharan.webp",
    description:
      "Versatile multi-passenger vehicle offering flexible seating configurations, ideal for small groups with extra luggage.",
    features: [
      "Elevated seating position with enhanced visibility",
      "Flexible modular luggage storage space",
      "Sliding passenger side doors for easy access",
      "Professional chauffeur and route coordination",
    ],
    airportRateKm: 1.97,
    dayRateHour: 40,
    hourlyRateHour: 80,
  },
  {
    id: "first-class-van",
    name: "First Class Van",
    modelExample: "Mercedes-Benz V-Class or similar",
    passengers: 6,
    luggage: 6,
    image: "/fleet/first-class-van-mercedes-v-class.webp",
    description:
      "Unmatched spacious luxury for groups, executive delegations, and families requiring extensive luggage capacity without compromising sophistication.",
    features: [
      "Conference-style luxury leather seating",
      "Ambient cabin lighting",
      "Generous luggage compartment",
      "Privacy glass and dedicated rear passenger climate",
    ],
    airportRateKm: null,
    dayRateHour: null,
    hourlyRateHour: null,
  },
  {
    id: "van",
    name: "Van (8-9 Seater)",
    modelExample: "8/9 - Seater Van",
    passengers: 8,
    luggage: 8,
    image: "/fleet/van-8-9-seater.webp",
    description:
      "High-capacity passenger vehicle suited for corporate shuttles, production crews, and extended family transfers.",
    features: [
      "Accommodates up to 8 passengers comfortably",
      "Deep rear luggage bay for oversized bags",
      "Dual-zone rear heating and cooling",
      "Professional certified commercial chauffeur",
    ],
    airportRateKm: null,
    dayRateHour: null,
    hourlyRateHour: null,
  },
  {
    id: "standard-van",
    name: "Standard Van",
    modelExample: "Hyundai i800 / VW Transporter or similar",
    passengers: 6,
    luggage: 6,
    image: "/fleet/standard-van-hyundai-i800.webp",
    description:
      "Practical, spacious group transfer vehicle delivering reliable group transportation with generous boot volume.",
    features: [
      "Versatile seating for up to 6 passengers",
      "Large boot capacity for standard suitcases",
      "Clean, comfortable passenger cabin",
      "Experienced London chauffeur",
    ],
    airportRateKm: null,
    dayRateHour: null,
    hourlyRateHour: null,
  },
];

export interface PriceCalculation2 {
  baseFare: number | null;
  rateLabel: string;
  unitCount: number;
  unitLabel: string;
  total: number | null;
}

export function calculatePrice2(
  service: ServiceType2,
  vehicle: Vehicle2,
  options: { distanceKm?: number; durationHours?: number },
): PriceCalculation2 {
  if (service === "airport-transfer") {
    const distance = options.distanceKm ?? 28;
    if (vehicle.airportRateKm === null) {
      return { baseFare: null, rateLabel: "Rate subject to confirmation", unitCount: distance, unitLabel: "km", total: null };
    }
    const baseFare = Number((distance * vehicle.airportRateKm).toFixed(2));
    return { baseFare, rateLabel: `£${vehicle.airportRateKm.toFixed(2)} per km`, unitCount: distance, unitLabel: "km", total: baseFare };
  }

  const hours = Math.max(4, options.durationHours ?? 4);
  const rate = service === "day-booking" ? vehicle.dayRateHour : vehicle.hourlyRateHour;
  if (rate === null) {
    return { baseFare: null, rateLabel: "Rate subject to confirmation", unitCount: hours, unitLabel: "hours", total: null };
  }
  const baseFare = hours * rate;
  return { baseFare, rateLabel: `£${rate.toFixed(2)} per hour`, unitCount: hours, unitLabel: "hours", total: baseFare };
}

export const SERVICE_LABELS2: Record<ServiceType2, string> = {
  "airport-transfer": "AIRPORT TRANSFER",
  "day-booking": "DAY BOOKING",
  "hourly-chauffeur": "HOURLY CHAUFFEUR",
};

export function defaultBookingState2(): BookingState2 {
  return {
    serviceType: "airport-transfer",
    selectedVehicleId: "business",
    transferDirection: "departure",
    sampleDistanceKm: 28,
    flightNumber: "",
    pickupAddress: "The Langham, 1c Portland Place, London W1B 1JA",
    destinationAddress: "Heathrow Airport · Terminal 5 (LHR)",
    pickupDate: "18 November 2026",
    pickupTime: "06:00",
    durationHours: 6,
    stops: [
      { id: "stop-1", address: "1 Canada Square, Canary Wharf, London" },
      { id: "stop-2", address: "The Ned, 27 Poultry, London EC2R 8AJ" },
    ],
    passengers: 2,
    luggageCount: 2,
    luggageType: "carry-on",
    specialInstructions: "",
  };
}
