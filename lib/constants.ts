export const BRAND = "CTRL + SHIFT + CANDLE";
export const TAGLINE = "Focus. Reset. Elevate.";
export const COLORS = {
  ink: "#050505",
  ink2: "#0C0C0C",
  fg: "#F5F5F5",
  muted: "#A3A3A3",
  code: "#6B6B6B",
  gold: "#C9A227",
  goldHi: "#E0B82E",
  goldActive: "#A88B1F",
  line: "#1F1F1F",
  status: "#4ADE80",
} as const;

export const CODE = {
  init: "// system initializing",
  focus: "// focus mode engaged",
  statement: "// statement",
  intention: "// intention",
  notes: "// notes",
  closing: "// closing",
  status: "status: ready",
} as const;

/** Sequência do Hero (s desde t0 = script inline). */
export const HERO_TIMING = {
  labelInit: 0.3,
  labelFocus: 0.8,
  headline: 1.0,
  sub: 1.4,
  cta: 1.4,
  product: 1.6,
  done: 2.2,
  failsafe: 3.0,
} as const;

/** Durações (ms). O CSS do A usa estes números. */
export const HERO_DUR = {
  label: 400,
  headline: 600,
  sub: 500,
  cta: 500,
  product: 600,
} as const;

export const HEADER_H = 72; // px (layout); o header encolhe só visualmente
export const SMOOTH_SCROLL = true;

/** 0 = sem gate de largura. Fallback se o mobile pesar: 768. */
export const STORY_MIN_WIDTH: number = 0;

export const SECTION_IDS = {
  top: "top",
  product: "product",
  statement: "statement",
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

export const SHOP_URL = "#offer"; // Header "Shop" e CTA do Hero rolam até ao ProductSpecs
export const CHECKOUT_URL = "#checkout"; // TODO: URL real (CTAs do ProductSpecs e do Closing)

export const MODEL_PATH = "/models/candle.glb";
export const EMBLEM_PATH = "/brand/emblem.png";
export const MARK_PATH = "/brand/mark.svg";

export type ProductView = "hero" | "reveal" | "intention" | "offer";

export interface PhotoAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Fotografias reais (null = desativado; tudo o que as usa é opcional). */
export const PHOTOS: {
  revealOpen: PhotoAsset | null;
  intention: PhotoAsset | null;
  specs: PhotoAsset | null;
} = { revealOpen: null, intention: null, specs: null };
