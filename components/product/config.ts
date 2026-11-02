export const USE_GLB = true;
export const GLB_DRACO = false;

export const NAMED_NODES = {
  lid: /^lid$/i,
  boxBody: /^box[_ ]?body$/i,
  tray: /^tray$/i,
  candle: /^candle$/i,
} as const;

export const FIT = {
  jar: { height: 1.4, centerY: 0 },
  lid: { diameter: 1.38, bottomY: 0.705 },
  tray: { size: [2.2, 0.55, 2.3] as const, bottomY: -1.0 },
  box: { size: [2.26, 1.5, 2.36] as const, bottomY: -0.47 },
} as const;

/** Levitação da tampa (story, estágio 1): quase estática. */
export const FLOAT = { amp: 0.014, tilt: 0.006, period: 10 } as const;
/** Invalidação durante a levitação: ≤ 20 fps. */
export const FLOAT_INTERVAL_MS = 50;

/** Encolhimento da caixa durante o fade (mesma smoothstep da opacidade). */
export const BOX_FADE_SCALE = 0.03;

/** Abaixo desta largura (px) valem as tabelas mobile (câmera, yaw 4°, lift ×1.25, dolly 6%). */
export const MOBILE_MAX_WIDTH = 768;

/** Legado (sem uso nesta fase; sem listeners). */
export const PARALLAX: { enabled: boolean; maxPx: number } = { enabled: false, maxPx: 4 };

export const probeEnabled = (): boolean =>
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("probe") === "1";

export const tuneEnabled = (): boolean =>
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("tune") === "1";