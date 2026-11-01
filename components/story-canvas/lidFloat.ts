import { FLOAT } from "@/components/product/config";

interface Delta {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
}

/** Nearly-static lid float between lid stages 1 and 2. Reduced-motion handled by caller (w=0). */
export function addLidFloat(delta: Delta, stage: number, time: number): void {
  // window only between stages ~1 and ~2
  const w = stage > 0.85 && stage < 2.15 ? Math.min(1, Math.min(stage - 0.85, 2.15 - stage) * 4) : 0;
  if (w <= 0) return;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;
  const ang = (time / FLOAT.period) * Math.PI * 2;
  delta.y += Math.sin(ang) * FLOAT.amp * w;
  delta.rx += Math.sin(ang * 0.7) * FLOAT.tilt * w;
  delta.rz += Math.cos(ang * 0.9) * FLOAT.tilt * 0.6 * w;
}
