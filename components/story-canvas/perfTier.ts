export type PerfTier = "high" | "low";

export interface PerfConfig {
  dpr: [number, number];
  antialias: boolean;
  shadowRes: number;
  shadowBlur: number;
  envRes: number;
  minGapMs: number; // intervalo mínimo entre invalidações durante transições
}

export const PERF: Record<PerfTier, PerfConfig> = {
  high: { dpr: [1, 1.75], antialias: true, shadowRes: 512, shadowBlur: 2.0, envRes: 256, minGapMs: 0 },
  low: { dpr: [1, 1.25], antialias: false, shadowRes: 256, shadowBlur: 1.6, envRes: 128, minGapMs: 33 },
};

let cached: PerfTier | undefined;

export function getPerfTier(): PerfTier {
  if (cached) return cached;
  if (typeof window === "undefined") return "high";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const low =
    window.innerWidth < 768 ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4);
  cached = low ? "low" : "high";
  return cached;
}

export const perfConfig = (): PerfConfig => PERF[getPerfTier()];