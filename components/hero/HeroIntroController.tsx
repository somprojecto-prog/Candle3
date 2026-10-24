"use client";

import { useEffect } from "react";
import { HERO_TIMING } from "@/lib/constants";
import { finishHero, heroElapsed, isHeroPlaying } from "@/lib/heroIntro";

const INTERRUPTS = [
  "wheel",
  "touchstart",
  "touchmove",
  "keydown",
  "pointerdown",
] as const;

export default function HeroIntroController() {
  useEffect(() => {
    if (!isHeroPlaying()) return;

    const h = window.location.hash;
    if (window.scrollY > 4 || (h !== "" && h !== "#top")) {
      finishHero();
      return;
    }

    const onInterrupt = () => finishHero();
    const onScroll = () => {
      if (window.scrollY > 4) finishHero();
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      if (mq.matches) finishHero();
    };

    for (const type of INTERRUPTS) {
      window.addEventListener(type, onInterrupt, {
        capture: true,
        passive: true,
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onMotion);

    const timer = window.setTimeout(
      finishHero,
      Math.max(0, (HERO_TIMING.done - heroElapsed()) * 1000),
    );

    return () => {
      for (const type of INTERRUPTS) {
        window.removeEventListener(type, onInterrupt, { capture: true });
      }
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMotion);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
