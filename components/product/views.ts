import type { ProductView } from "@/lib/constants";

export interface ViewConfig {
  box: boolean; // caixa visível
  /** Progresso da abertura aplicado à caixa: 0 fechada, ≈0.55 pairando e inclinada. */
  reveal: number;
  lid: "seated" | "off";
  camera: {
    target: [number, number, number];
    dist: number; // legado: a distância real vem de `fit` via viewDist()
    elev: number;
    azim: number;
    fov: number;
  };
  /** Silhueta projetada (azim/elev incluídos) e quanto do wrapper deve ocupar. */
  fit: { height: number; width: number; fillH: number; maxW: number };
  dragRange: number; // legado (sem drag)
}

// ÚNICA tabela de vistas estáticas. Afine com /dev/product?probe=1&tune=1&az=&el=&d=&ty=
export const VIEWS: Record<ProductView, ViewConfig> = {
  // caixa fechada ¾: 80–92% da largura do wrapper
  hero: {
    box: true,
    reveal: 0,
    lid: "seated",
    camera: { target: [0, 0, 0], dist: 7.8, elev: 13, azim: 30, fov: 28 },
    fit: { height: 2.6, width: 3.15, fillH: 0.88, maxW: 0.9 },
    dragRange: 50,
  },
  // vela aberta com a capa pairando (reveal ≈ 0.55): limitada pela altura
  reveal: {
    box: true,
    reveal: 0.55,
    lid: "seated",
    camera: { target: [0, 0.85, 0], dist: 12, elev: 16, azim: 14, fov: 28 },
    fit: { height: 4.5, width: 3.2, fillH: 0.9, maxW: 0.9 },
    dragRange: 30,
  },
  // close-up da vela aberta, tampa assente
  intention: {
    box: false,
    reveal: 1,
    lid: "seated",
    camera: { target: [0, -0.2, 0], dist: 6, elev: 20, azim: -25, fov: 28 },
    fit: { height: 2.3, width: 3.0, fillH: 0.8, maxW: 0.88 },
    dragRange: 25,
  },
  offer: {
    box: true,
    reveal: 0,
    lid: "seated",
    camera: { target: [0, 0, 0], dist: 7.8, elev: 14, azim: 32, fov: 28 },
    fit: { height: 2.75, width: 3.2, fillH: 0.8, maxW: 0.88 },
    dragRange: 35,
  },
};

const D2R = Math.PI / 180;

export function viewDist(cfg: ViewConfig, aspect: number, fov: number = cfg.camera.fov): number {
  const th = Math.tan((fov * D2R) / 2);
  const distH = cfg.fit.height / cfg.fit.fillH / (2 * th);
  const distW = cfg.fit.width / cfg.fit.maxW / (2 * th * Math.max(aspect, 0.01));
  return Math.max(distH, distW);
}