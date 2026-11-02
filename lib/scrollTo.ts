import type Lenis from "lenis";
import { HEADER_H } from "@/lib/constants";

let instance: Lenis | null = null;
let fallbackLocked = false;

export function registerLenis(l: Lenis | null): void {
  instance = l;
}

/** Bloqueia o scroll (overlay mobile). Sem Lenis (reduced-motion), usa overflow no <html>. */
export function stopScroll(): void {
  if (typeof document === "undefined") return;
  if (instance) {
    instance.stop();
  } else {
    document.documentElement.style.overflow = "hidden";
    fallbackLocked = true;
  }
}

export function startScroll(): void {
  if (typeof document === "undefined") return;
  instance?.start();
  if (fallbackLocked) {
    document.documentElement.style.overflow = "";
    fallbackLocked = false;
  }
}

export function scrollToHash(hash: string, offset: number = -HEADER_H): void {
  if (typeof window === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hash === "#top") {
    if (instance) instance.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    return;
  }

  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = id ? document.getElementById(id) : null;
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
}
