/** Single source for light/material/exposure numbers. In production LOOK = defaults (no tuner). */
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
  halo: number;
  shadow: number;
}

export const LOOK_DEFAULTS: Readonly<Look> = Object.freeze({
  exposure: 1.15,
  hemi: 1.2,
  key: 3.4,
  fill: 0.8,
  top: 0.5,
  rimL: 90,
  rimR: 70,
  albedo: { box: 0x3c, tray: 0x34, lid: 0x40, jar: 0x15 },
  jarEnv: 2.0,
  matEnv: 1.0,
  halo: 0.1,
  shadow: 0.65,
});

export const LOOK: Look & { rev: number } = {
  ...LOOK_DEFAULTS,
  albedo: { ...LOOK_DEFAULTS.albedo },
  rev: 0,
};

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
