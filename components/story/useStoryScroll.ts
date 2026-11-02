"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HEADER_H } from "@/lib/constants";
import { resetStoryState, STORY_SECTION_IDS, storyState } from "@/lib/story";
import { useStoryMode } from "@/components/story/useStoryMode";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_STEP = 1;
const REVEAL_OPEN_AT = 0.96;

const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));
const smoothstep = (t: number): number => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
const jump = (t: number): number => (t < 0.5 ? 0 : 1);

const headerHeight = (): number => {
  const v = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
  );
  return Number.isFinite(v) && v > 0 ? v : HEADER_H;
};

/**
 * start[i] = início do pin da secção i; end[i] = fim do pin.
 * Entre end[i] e start[i+1] a câmera transita; fora disso, phase é o inteiro do passo.
 * Reduced-motion: a transição é um salto seco no ponto médio.
 */
function computePhase(y: number, start: number[], end: number[], reduced: boolean): number {
  const last = start.length - 1;
  if (y <= end[0]) return 0;
  for (let i = 0; i < last; i++) {
    if (y < start[i + 1]) {
      const span = start[i + 1] - end[i];
      if (span <= 0) return i;
      const t = clamp01((y - end[i]) / span);
      return i + (reduced ? jump(t) : smoothstep(t));
    }
    // Pin da secção i + 1 (ou intervalo degenerado: salto seco).
    if (i + 1 < last && y <= end[i + 1]) return i + 1;
  }
  return last;
}

function computeReveal(y: number, start: number[], end: number[], reduced: boolean): number {
  const s = start[REVEAL_STEP];
  const e = end[REVEAL_STEP];
  const t = e > s ? clamp01((y - s) / (e - s)) : y >= s ? 1 : 0;
  return reduced ? jump(t) : t;
}

export function useStoryScroll(rootRef: RefObject<HTMLElement | null>): void {
  const mode = useStoryMode();

  useEffect(() => {
    const html = document.documentElement;

    if (mode !== "on") {
      resetStoryState();
      delete html.dataset.revealOpen;
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    let start: number[] = [];
    let end: number[] = [];
    let lastY = -1;
    let lastOpen = "";
    let cancelled = false;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;
    const onMotion = () => {
      reduced = mq.matches;
      lastY = -1;
    };
    mq.addEventListener("change", onMotion);

    const measure = () => {
      const scrollY = window.scrollY;
      const h = headerHeight();
      const s: number[] = [];
      const e: number[] = [];
      for (const id of STORY_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + scrollY;
        const bottom = top + el.offsetHeight;
        const st = Math.max(0, top - h);
        s.push(st);
        e.push(Math.max(st, bottom - window.innerHeight));
      }
      start = s;
      end = e;
      lastY = -1;
    };

    const tick = () => {
      if (start.length !== STORY_SECTION_IDS.length) return;
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;

      const phase = computePhase(y, start, end, reduced);
      const reveal = computeReveal(y, start, end, reduced);
      storyState.phase = phase;
      storyState.reveal = reveal;

      const margin = window.innerHeight * 1.2;
      storyState.active = y > start[0] - margin && y < end[end.length - 1] + margin;

      const open = phase === REVEAL_STEP && reveal >= REVEAL_OPEN_AT ? "1" : "0";
      if (open !== lastOpen) {
        lastOpen = open;
        html.dataset.revealOpen = open;
      }
    };

    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    gsap.ticker.add(tick);

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      observer.disconnect();
      mq.removeEventListener("change", onMotion);
      ScrollTrigger.removeEventListener("refresh", measure);
      resetStoryState();
      delete html.dataset.revealOpen;
    };
  }, [mode, rootRef]);
}
