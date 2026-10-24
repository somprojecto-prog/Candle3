import { HERO_TIMING as T } from "@/lib/constants";

declare global {
  interface Window {
    __heroT0?: number;
  }
}

export const HERO_DONE_EVENT = "hero:done";

export const isHeroPlaying = (): boolean =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.hero === "playing";

export const heroElapsed = (): number =>
  typeof window === "undefined" || window.__heroT0 === undefined
    ? Infinity
    : (performance.now() - window.__heroT0) / 1000;

export function finishHero(): void {
  if (!isHeroPlaying()) return;
  document.documentElement.dataset.hero = "done";
  window.dispatchEvent(new Event(HERO_DONE_EVENT));
}

export function charAt(i: number): number {
  const L = T.charMs.length;
  let t: number = T.typeStart as number;
  for (let j = 0; j < i; j++) t += T.charMs[j % L] / 1000;
  return t;
}

/** Instante (s) em que o caractere i aparece. */
export function charAt(i: number): number {
  const L = T.charMs.length;
  let t = Number(T.typeStart);
  for (let j = 0; j < i; j++) t += Number(T.charMs[j % L]) / 1000;
  return t;
}

/** Estado do título no instante e (s). */
export function titleStateAt(
  e: number,
  len: number,
): { chars: number; cursor: boolean } {
  const L = T.charMs.length;
  let t = Number(T.typeStart);
  let chars = 0;
  let lastAt = Number(T.typeStart);

  for (let i = 0; i < len; i++) {
    if (i > 0) t += Number(T.charMs[(i - 1) % L]) / 1000;
    lastAt = t;
    if (e >= t) chars = i + 1;
  }

  if (e < Number(T.cursor) || e >= Number(T.cursorOff)) {
    return { chars, cursor: false };
  }
  if (len === 0 || e < lastAt) {
    return { chars, cursor: true };
  }

  const phase = Math.floor(((e - lastAt) * 1000) / Number(T.blinkMs));
  return { chars, cursor: phase % 2 === 0 };
}
