export const USE_GLB = true;
export const GLB_DRACO = false;
export const MOBILE_MAX_WIDTH = 768;

export const NAMED_NODES = {
  lid: /^lid$/i,
  boxBody: /^box[_ ]?body$/i,
  tray: /^tray$/i,
  candle: /^candle$/i,
} as const;

/** ÚNICO sítio das proporções (Box_Body + Tray, tratamento igual no Hero, Specs e viewers estáticos). */
export const FIT = {
  jar: { height: 1.4, centerY: 0 },
  lid: { diameter: 1.38, bottomY: 0.705 },
  tray: { size: [2.2, 0.55, 2.3] as const, bottomY: -1.0 },
  box: { size: [2.26, 1.5, 2.36] as const, bottomY: -0.47 },
} as const;

/**
 * Proporções da caixa real: POR CONFIRMAR. A única fotografia disponível mostra a capa quase de topo
 * (≈ 1.46 : 1 entre largura e profundidade aparentes) com perspectiva; não chega para fixar razões fiáveis.
 * Mantêm-se os valores de FIT. Quando houver frente reta + medidas, preencha e aplique a FIT.
 */
export const BOX_PROPORTIONS = {
  confirmed: false,
  widthToDepth: 2.26 / 2.36, // atual (FIT); a foto sugere ≈ 1.46 de topo, por validar
  trayHeightToCoverHeight: 0.55 / 1.5, // atual (FIT)
} as const;

/** Faixa bege com as notas na frente da caixa: só depois de as fotografias a confirmarem. */
export const BOX_DECALS = { band: false };

/** Levitação da tampa (story, entre os estágios 1 e 2): amplitude de milímetros. */
export const FLOAT = { amp: 0.01, tilt: 0.004, period: 12 } as const; // antes 0.014 / 0.006 / 10
/** Invalidação durante a levitação: ≤ 20 fps. */
export const FLOAT_INTERVAL_MS = 50;

/** Encolhimento da caixa durante o fade de saída (mesma smoothstep da opacidade). */
export const BOX_FADE_SCALE = 0.03;

/** Legado (sem uso; sem listeners). */
export const PARALLAX: { enabled: boolean; maxPx: number } = { enabled: false, maxPx: 4 };

export const probeEnabled = (): boolean =>
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("probe") === "1";

export const tuneEnabled = (): boolean =>
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("tune") === "1";