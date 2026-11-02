export const EASE_CSS = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  text: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;
export const EASE_GSAP = { out: "expo.out", text: "power4.out" } as const; // equivalentes sem CustomEase

export const DUR = { fast: 0.2, label: 0.4, base: 0.6, long: 0.7 } as const; // s
export const STAGGER = { lines: 0.12, list: 0.08, notes: 0.06 } as const; // s
export const SCROLL = { start: "top 80%", end: "bottom 20%" } as const;

/** y inicial (px) por variante de [data-reveal]. O CSS inicial do A usa os mesmos valores. */
export const REVEAL_Y = { default: 24, line: 12, label: 8, blur: 12 } as const;
export type RevealVariant = keyof typeof REVEAL_Y;
