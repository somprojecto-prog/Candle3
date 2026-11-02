import { MathUtils } from "three";

export interface Track {
  values: readonly number[]; // um valor por passo (0..5)
  /** windows[k]: sub-janela (0..1) da transição (k−1 → k) em que o canal muda; default [0,1]. */
  windows?: readonly (readonly [number, number] | undefined)[];
}

// hero, reveal, statement, intention, notes, specs
export const TRACKS = {
  // 0..1 = opacity do <canvas>. Regra de ouro: tudo o que muda fora da narrativa visível muda com visible = 0.
  visible: {
    values: [1, 1, 0, 1, 0, 1],
    windows: [undefined, undefined, [0, 0.6], [0.4, 1], [0, 0.6], [0.4, 1]],
  },
  // 0 fechada · 1 capa pairando · 2 fora. No passo reveal (phase < 2) manda `reveal` (revealChoreo).
  boxLift: {
    values: [0, 2, 2, 2, 2, 0],
    windows: [undefined, undefined, undefined, undefined, undefined, [0, 0.4]], // 2→0 com visible = 0
  },
  // 0 assente · 1 flutua (acima-esquerda, inclinada)
  lidStage: {
    values: [0, 0, 0, 1, 1, 0],
    windows: [undefined, undefined, undefined, [0, 0.4], undefined, [0, 0.4]], // muda com visible = 0
  },
} as const satisfies Record<string, Track>;

export function sampleTrack(t: Track, phase: number): number {
  const n = t.values.length;
  const p = MathUtils.clamp(phase, 0, n - 1);
  const i = Math.min(Math.floor(p), n - 2);
  let f = p - i;
  const w = t.windows?.[i + 1];
  if (w) f = MathUtils.clamp((f - w[0]) / Math.max(w[1] - w[0], 1e-6), 0, 1);
  return MathUtils.lerp(t.values[i], t.values[i + 1], f);
}