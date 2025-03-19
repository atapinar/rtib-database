import { Building2, ShoppingBag, HardHat, Cpu, Landmark, Pill, Droplet, Zap, Plane, Ship, Beer } from "lucide-react"

// Industry icons mapping
export const industryIcons = {
  Banking: Landmark,
  Manufacturing: Building2,
  Retail: ShoppingBag,
  Construction: HardHat,
  "Food & Beverage": Beer,
  Technology: Cpu,
  Healthcare: Pill,
  Energy: Zap,
  "Oil & Gas": Droplet,
  Aviation: Plane,
  Shipping: Ship,
}

// Industry color mapping for badges
export const industryColors = {
  "Banking": { bg: "bg-blue-100", text: "text-blue-700" },
  "Manufacturing": { bg: "bg-gray-100", text: "text-gray-700" },
  "Retail": { bg: "bg-green-100", text: "text-green-700" },
  "Construction": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Food & Beverage": { bg: "bg-red-100", text: "text-red-700" },
  "Energy": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "Aviation": { bg: "bg-purple-100", text: "text-purple-700" },
  "Technology": { bg: "bg-teal-100", text: "text-teal-700" },
  "Agriculture": { bg: "bg-lime-100", text: "text-lime-700" },
  "Logistics": { bg: "bg-amber-100", text: "text-amber-700" },
  "Shipping": { bg: "bg-cyan-100", text: "text-cyan-700" },
} as const;

