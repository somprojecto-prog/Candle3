export const SUPPORTING_COPY = {
  statementPositioning:
    "Curated to create the ideal atmosphere for concentration, creativity, and flow.",
  statementSupport: "Light it. Lock in. Get to work.",
  notesSupport: "A focused, grounding blend engineered for long sessions.",
  closingSupport: "More than a candle — a signal to shift into deep work.",
} as const;

export const HERO = {
  title: "Deep Work.",
  subtitle: "A focused candle for concentration, creativity, and flow.",
  cta: "Shop Deep Work",
} as const;

export const STATEMENT = {
  title: "Designed for Deep Focus",
  positioning: SUPPORTING_COPY.statementPositioning,
  support: SUPPORTING_COPY.statementSupport,
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
  items: ["Bergamot", "Cedarwood", "Sandalwood", "Amber", "Black Pepper"],
  support: SUPPORTING_COPY.notesSupport,
} as const;

export const OFFER = {
  title: "Deep Work Candle",
  price: "$49.99",
  info: ["16 oz", "Soy wax blend", "Wood wick", "80+ hours burn time"],
  cta: "Shop Deep Work",
} as const;

export const CLOSING = {
  title: "Built for Focus. Made for More.",
  support: SUPPORTING_COPY.closingSupport,
  cta: "Shop Deep Work",
} as const;
