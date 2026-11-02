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
