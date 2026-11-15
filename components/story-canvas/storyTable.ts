import { MathUtils } from "three";
import { lightMod } from "@/components/product/lookConfig";
import { STORY_STEPS } from "@/lib/story";

export const easeOutCubic = (x: number): number => 1 - (1 - x) * (1 - x) * (1 - x);

export interface Track {
  values: readonly number[];
  windows?: readonly (readonly [number, number] | undefined)[];
  eases?: readonly (((x: number) => number) | undefined)[];
}

export const BOX_RETURN = { start: 0.4, end: 1.0, fadeEnd: 0.5, scaleFrom: 0.97 } as const;

// hero, reveal, intention, notes, offer
export const TRACKS = {
  boxLift: {
    values: [0, 2, 2, 2, 0],
    windows: [undefined, [0, 0.7], undefined, undefined, [BOX_RETURN.start, BOX_RETURN.end]],
    eases: [undefined, undefined, undefined, undefined, easeOutCubic],
  },
  lidStage: {
    values: [0, 0, 1, 2, 3],
    windows: [undefined, undefined, [0.2, 1], [0, 1], [0, 0.5]],
  },
  visible: { values: [1, 1, 1, 1, 1] },
} as const satisfies Record<string, Track>;

export function sampleTrack(t: Track, phase: number): number {
  const n = t.values.length;
  const p = MathUtils.clamp(phase, 0, n - 1);
  const i = Math.min(Math.floor(p), n - 2);
  let f = p - i;
  const w = t.windows?.[i + 1];
  if (w) f = MathUtils.clamp((f - w[0]) / Math.max(w[1] - w[0], 1e-6), 0, 1);
  const e = t.eases?.[i + 1];
  if (e) f = e(f);
  return MathUtils.lerp(t.values[i], t.values[i + 1], f);
}

interface StepLight {
  key: number;
  fill: number;
  top: number;
  rim: number;
}

export const STEP_LIGHT: readonly StepLight[] = [
  { key: 1.0, fill: 1.0, top: 1.0, rim: 1.0 },
  { key: 1.0, fill: 1.0, top: 1.0, rim: 1.05 },
  { key: 0.92, fill: 0.9, top: 1.0, rim: 1.1 },
  { key: 0.96, fill: 0.95, top: 1.05, rim: 1.1 },
  { key: 1.0, fill: 1.0, top: 1.0, rim: 1.0 },
];

const BREATH = 0.1;
const LIGHT_MIN = 0.8;
const LIGHT_MAX = 1.1;

export function applyStepLight(phase: number): void {
  const n = STEP_LIGHT.length;
  const p = MathUtils.clamp(phase, 0, n - 1);
  const i = Math.min(Math.floor(p), n - 2);
  const t = p - i;
  const a = STEP_LIGHT[i];
  const b = STEP_LIGHT[i + 1];
  const f = p - Math.floor(p);
  const breath = 1 - BREATH * Math.sin(Math.PI * f);
  lightMod.key = MathUtils.clamp(MathUtils.lerp(a.key, b.key, t) * breath, LIGHT_MIN, LIGHT_MAX);
  lightMod.rim = MathUtils.clamp(MathUtils.lerp(a.rim, b.rim, t) * breath, LIGHT_MIN, LIGHT_MAX);
  lightMod.fill = MathUtils.lerp(a.fill, b.fill, t);
  lightMod.top = MathUtils.lerp(a.top, b.top, t);
}

if (process.env.NODE_ENV !== "production") {
  const n = STORY_STEPS.length;
  for (const [name, track] of Object.entries(TRACKS) as [string, Track][]) {
    if (track.values.length !== n) {
      console.error(
        `[story] canal "${name}" tem ${track.values.length} valores; o story tem ${n} passos`,
      );
    }
  }
  if (STEP_LIGHT.length !== n) {
    console.error(
      `[story] STEP_LIGHT tem ${STEP_LIGHT.length} entradas; o story tem ${n} passos`,
    );
  }
}