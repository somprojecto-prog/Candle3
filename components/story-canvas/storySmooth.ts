import { useEffect } from "react";
import { MathUtils } from "three";
import { MOBILE_MAX_WIDTH } from "@/components/product/config";
import { storyState } from "@/lib/story";
import { updateChoreo } from "./revealChoreo";

/** Cópias amortecidas de storyState.phase / .reveal (mesmo λ). Todo o resto da cena lê isto + `choreo`. */
export const smooth = { phase: storyState.phase, reveal: storyState.reveal };

/** Mantido por useReducedMotionSync. Reduced-motion só suaviza (λ 14): o story não é desligado. */
export const motion = { reduced: false, mobile: false };

const LAMBDA = 5;
const LAMBDA_REDUCED = 14;
const SNAP = 2e-4;

export function useReducedMotionSync(): void {
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mb = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH - 1}px)`);
    const update = () => {
      motion.reduced = rm.matches;
      motion.mobile = mb.matches;
    };
    update();
    rm.addEventListener("change", update);
    mb.addEventListener("change", update);
    return () => {
      rm.removeEventListener("change", update);
      mb.removeEventListener("change", update);
    };
  }, []);
}

function approach(cur: number, target: number, lambda: number, dt: number): number {
  if (Math.abs(target - cur) < SNAP) return target; // assenta exatamente: o Invalidator pode parar
  return MathUtils.damp(cur, target, lambda, dt);
}

export function stepSmooth(dt: number): void {
  const lambda = motion.reduced ? LAMBDA_REDUCED : LAMBDA;
  smooth.phase = approach(smooth.phase, storyState.phase, lambda, dt);
  smooth.reveal = approach(smooth.reveal, storyState.reveal, lambda, dt);
  updateChoreo(smooth.phase, smooth.reveal, motion.mobile);
}