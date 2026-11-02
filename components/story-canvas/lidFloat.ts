import { MathUtils } from "three";
import { FLOAT } from "@/components/product/config";
import { choreo } from "./revealChoreo";
import type { Delta } from "./storyMotion";
import { motion } from "./storySmooth";

/** 1 com a tampa a flutuar (estágio 1); 0 assente e com reduced-motion. */
export function floatWeight(stage: number): number {
  if (motion.reduced) return 0;
  return MathUtils.smoothstep(stage, 0.85, 1.0) * (1 - MathUtils.smoothstep(stage, 2.0, 2.15));
}

/** O Invalidator só renderiza em contínuo (≤ 20 fps) com o produto visível. */
export function floatActive(): boolean {
  return choreo.visible > 0.01 && floatWeight(choreo.stage) > 0;
}

export function addLidFloat(out: Delta, stage: number, time: number): void {
  const w = floatWeight(stage);
  if (w <= 0) return;
  const ph = (2 * Math.PI * time) / FLOAT.period;
  out.y += FLOAT.amp * Math.sin(ph) * w;
  out.rx += FLOAT.tilt * Math.sin(ph + 1.1) * w;
}