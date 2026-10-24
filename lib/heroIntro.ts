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

export function titleStateAt(
  e: number,
  len: number,
): { chars: number; cursor: boolean } {
  const L = T.charMs.length;
  let t: number = T.typeStart as number;
  let chars = 0;
  let lastAt: number = T.typeStart as number;
  for (let i = 0; i < len; i++) {
    if (i > 0) t += T.charMs[(i - 1) % L] / 1000;
    lastAt = t;
    if (e >= t) chars = i + 1;
  }

  if (e < T.cursor || e >= T.cursorOff) return { chars, cursor: false };
  if (len === 0 || e < lastAt) return { chars, cursor: true };

  const phase = Math.floor(((e - lastAt) * 1000) / T.blinkMs);
  return { chars, cursor: phase % 2 === 0 };
}
