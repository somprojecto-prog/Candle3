"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { FLOAT_INTERVAL_MS } from "@/components/product/config";
import { revealActive } from "@/components/product/lookConfig";
import { storyState } from "@/lib/story";
import { floatActive } from "./lidFloat";
import { perfConfig } from "./perfTier";
import { smooth, useReducedMotionSync } from "./storySmooth";

const EPS = 0.0005;
const WARMUP_FRAMES = 30;
const TAIL_FRAMES = 24;

/**
 * frameloop="demand": renderiza enquanto (a) a revelação de luz do hero corre, (b) phase ou reveal
 * suavizados não alcançaram storyState (a visibilidade deriva de phase), (c) a tampa flutua (≤ 20 fps).
 * Em tier "low", as transições ficam a ≤ 30 fps. Caso contrário, demand puro.
 */
export default function Invalidator(): null {
  const invalidate = useThree((s) => s.invalidate);
  useReducedMotionSync();

  useEffect(() => {
    const minGap = perfConfig().minGapMs;
    let raf = 0;
    let warm = 0;
    let tail = 0;
    let last = 0;

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);

      if (warm < WARMUP_FRAMES) {
        warm++;
        invalidate();
        return;
      }
      if (revealActive()) {
        invalidate();
        return;
      }
      if (!storyState.active) {
        tail = 0;
        return;
      }
      const moving =
        Math.abs(smooth.phase - storyState.phase) > EPS || Math.abs(smooth.reveal - storyState.reveal) > EPS;
      if (moving) {
        tail = TAIL_FRAMES;
        if (ts - last >= minGap) {
          last = ts;
          invalidate();
        }
        return;
      }
      if (floatActive()) {
        tail = TAIL_FRAMES;
        if (ts - last >= FLOAT_INTERVAL_MS) {
          last = ts;
          invalidate();
        }
        return;
      }
      if (tail > 0) {
        tail--;
        invalidate();
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);

  return null;
}