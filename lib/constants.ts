export const BRAND = "CTRL + SHIFT + CANDLE";
export const TAGLINE = "Focus. Reset. Elevate.";
export const COLORS = {
  ink: "#0A0A0A",
  ink2: "#121212",
  fg: "#EDEDED",
  muted: "#8A8A8A",
  code: "#5C5C5C",
  gold: "#C9A84C",
  goldHi: "#D4B45E",
  line: "#2A2A2A",
} as const;

export const CODE = {
  focus: "// focus mode engaged",
  statement: "// statement",
  intention: "// intention",
  notes: "// notes",
  closing: "// closing",
  status: "status: ready",
} as const;

export const HERO_TIMING = {
  comment: 0.2,
  cursor: 0.4,
  typeStart: 0.6,
  cursorOff: 1.7,
  subtitle: 1.7,
  product: 2.0,
  cta: 2.3,
  scroll: 2.6,
  done: 2.6,
  failsafe: 3.4,
  charMs: [40, 38, 42, 39, 41, 40, 38, 42, 40, 39],
  blinkMs: 530,
} as const;

export const HERO_DUR = {
  comment: 160,
  subtitle: 400,
  product: 500,
  cta: 300,
  scroll: 300,
} as const;

export const HEADER_H = 72;
export const SMOOTH_SCROLL = true;

/** 0 = no width gate (everyone sees story). Raise to 768 if mobile text overlaps product. */
export const STORY_MIN_WIDTH: number = 0;

export const SECTION_IDS = {
  top: "top",
  product: "product",
  about: "about",
  notes: "notes",
  offer: "offer",
  closing: "closing",
} as const;

export const NAV = [
  { label: "Product", href: "#product" },
  { label: "Notes", href: "#notes" },
  { label: "About", href: "#about" },
] as const;

export const SHOP_URL = "#offer";
export const CHECKOUT_URL = "#checkout";

export const MODEL_PATH = "/models/candle.glb";
export const EMBLEM_PATH = "/brand/emblem.png";
export const MARK_PATH = "/brand/mark.svg";

export type ProductView = "hero" | "statement" | "intention" | "offer";
