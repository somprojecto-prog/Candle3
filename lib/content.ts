export const PRICE = "$49.99";
export const CTA_LABEL = "Shop Deep Work";

export const HERO = {
  title: "Deep Work.",
  subtitle: "A focused candle for concentration, creativity, and flow.",
  cta: CTA_LABEL,
  price: PRICE,
} as const;

export const STATEMENT = {
  title: "Designed for Deep Focus",
  positioning:
    "Curated to create the ideal atmosphere for concentration, creativity, and flow.",
  support: "Light it. Lock in. Get to work.",
} as const;

export const INTENTION = {
  title: "Created with Intention",
  items: [
    "Hand-poured soy wax blend",
    "Crackling wood wick",
    "Clean-burning",
    "Non-toxic",
  ],
} as const;

export const NOTES = {
  title: "Deep Work Notes",
  support: "A focused, grounding blend engineered for long sessions.",
  items: [
    { name: "Bergamot", description: "Bright opening" },
    { name: "Cedarwood", description: "Grounding structure" },
    { name: "Sandalwood", description: "Warm depth" },
    { name: "Amber", description: "Soft resonance" },
    { name: "Black Pepper", description: "Sharp focus" },
  ],
} as const;

export const SPECS = {
  title: "Deep Work Candle",
  price: PRICE,
  summary: "16 oz · Soy wax blend · Wood wick · 80+ hours",
  items: ["16 oz", "Soy wax blend", "Wood wick", "80+ hours burn time"],
  cta: CTA_LABEL,
  support: [
    "Hand poured in small batches",
    "Clean-burning · Non-toxic ingredients",
  ],
} as const;

export const CLOSING = {
  title: "Built for Focus. Made for More.",
  support: "More than a candle — a signal to shift into deep work.",
  cta: CTA_LABEL,
  price: PRICE,
} as const;