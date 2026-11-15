import { HERO_TIMING } from "@/lib/constants";
import { heroElapsed, isHeroPlaying } from "@/lib/heroIntro";

export interface Look {
  exposure: number;
  hemi: number;
  key: number;
  fill: number;
  top: number;
  rimL: number;
  rimR: number;
  albedo: { box: number; tray: number; lid: number; jar: number };
  jarEnv: number;
  matEnv: number;
  halo: number; // NUNCA > 0.12
  shadow: number;
}

export const LOOK_DEFAULTS: Readonly<Look> = Object.freeze({
  exposure: 1.15,
  hemi: 0.9,
  key: 3.4, // key:fill ≈ 4.25:1
  fill: 0.8,
  top: 0.5,
  rimL: 100,
  rimR: 80,
  albedo: { box: 0x44, tray: 0x3c, lid: 0x40, jar: 0x15 }, // box 0x3C → 0x44 · tray 0x34 → 0x3C (carvão quente)
  jarEnv: 2.4,
  matEnv: 1.0,
  halo: 0.1,
  shadow: 0.65,
});

export const LOOK: Look & { rev: number } = {
  ...LOOK_DEFAULTS,
  albedo: { ...LOOK_DEFAULTS.albedo },
  rev: 0,
};

/**
 * Números do cartão e do foil. Fica fora de `LOOK` de propósito: o LookTuner itera as chaves
 * numéricas de LOOK_DEFAULTS e um sub-objeto novo quebraria o seu tipo (não se altera o tuner).
 */
export const BOX_LOOK = { grain: 0.6, clearcoat: 0.14, sheen: 0.7, foilEnv: 1.4, foilEmissive: 0.05 };
/** Multiplicador RGB do albedo da caixa/bandeja: ≈ #44423F com albedo 0x44. */
export const BOX_TINT = [1.0, 0.97, 0.93] as const;

/** Multiplicadores por passo e por transição (escritos pelo story; nos viewers estáticos ficam em 1). */
export const lightMod = { key: 1, fill: 1, top: 1, rim: 1 };

export const LOOK_INFO = { tone: -1, exposure: 0 };

const listeners = new Set<() => void>();

export function subscribeLook(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function bumpLook(): void {
  LOOK.rev++;
  listeners.forEach((l) => l());
}

export function resetLook(): void {
  Object.assign(LOOK, { ...LOOK_DEFAULTS, albedo: { ...LOOK_DEFAULTS.albedo } });
  bumpLook();
}

export interface Former {
  pos: readonly [number, number, number];
  rot?: readonly [number, number, number];
  scale: readonly [number, number, number];
  intensity: number;
  color: string;
}

export const ENV_FORMERS: readonly Former[] = [
  { pos: [-6, 1, 4], rot: [0, 2.159, 0], scale: [2.6, 7, 1], intensity: 4.2, color: "#FFFFFF" },
  { pos: [-5, 1, -5], scale: [1, 9, 1], intensity: 5, color: "#FFFFFF" },
  { pos: [5, 1, -5], scale: [0.6, 9, 1], intensity: 6, color: "#FFFFFF" },
  { pos: [0, 7, 0], rot: [Math.PI / 2, 0, 0], scale: [10, 6, 1], intensity: 1.0, color: "#FFF4E6" },
  { pos: [6, 0.5, 3], scale: [2, 5, 1], intensity: 0.8, color: "#FFFFFF" },
];

// ---------- Revelação de luz do hero (constante, fora do tuner) ----------
export interface RevealFactor {
  key: number;
  fill: number;
  top: number;
  rim: number;
}

export const REVEAL_LIGHT = {
  startMs: HERO_TIMING.product * 1000, // 1300 ms
  durMs: 600, // antes 700
  from: { key: 0.65, fill: 0.75, top: 0.75, rim: 0.85 } as RevealFactor, // antes 0.45/0.6/0.6/0.75: lê-se desde o 1.º frame
};

const _rev: RevealFactor = { key: 1, fill: 1, top: 1, rim: 1 };

/** Objeto de módulo reutilizado. Sem intro (reduced-motion, hash, interrompida) → tudo 1. */
export function revealFactor(): RevealFactor {
  const s = isHeroPlaying() ? heroElapsed() : Infinity;
  if (!Number.isFinite(s)) {
    _rev.key = _rev.fill = _rev.top = _rev.rim = 1;
    return _rev;
  }
  const p = Math.min(Math.max((s * 1000 - REVEAL_LIGHT.startMs) / REVEAL_LIGHT.durMs, 0), 1);
  const e = 1 - (1 - p) * (1 - p) * (1 - p); // easeOutCubic
  const f = REVEAL_LIGHT.from;
  _rev.key = f.key + (1 - f.key) * e;
  _rev.fill = f.fill + (1 - f.fill) * e;
  _rev.top = f.top + (1 - f.top) * e;
  _rev.rim = f.rim + (1 - f.rim) * e;
  return _rev;
}

export function revealActive(): boolean {
  if (!isHeroPlaying()) return false;
  const s = heroElapsed();
  return Number.isFinite(s) && s * 1000 < REVEAL_LIGHT.startMs + REVEAL_LIGHT.durMs + 100;
}