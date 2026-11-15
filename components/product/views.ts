import type { ProductView } from "@/lib/constants";

export interface ViewConfig {
  box: boolean; // caixa fechada sobre a bandeja
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
  // caixa fechada ¾ (mesmo asset e tratamento que o story): 88–96% da largura, ≤ 92% da altura
  hero: {
    box: true,
    lid: "seated",
    camera: { target: [0, 0, 0], dist: 7.8, elev: 12, azim: 24, fov: 28 },
    fit: { height: 2.65, width: 3.05, fillH: 0.88, maxW: 0.92 },
    dragRange: 50,
  },
  statement: {
    box: false,
    lid: "seated",
    camera: { target: [0, -0.05, 0], dist: 6.2, elev: 16, azim: 12, fov: 28 },
    fit: { height: 2.4, width: 2.7, fillH: 0.8, maxW: 0.88 },
    dragRange: 30,
  },
  intention: {
    box: false,
    lid: "off",
    camera: { target: [0, -0.35, 0], dist: 4.2, elev: 32, azim: -25, fov: 28 },
    fit: { height: 2.6, width: 3.0, fillH: 0.8, maxW: 0.88 },
    dragRange: 25,
  },
  // Specs: igual ao hero (mesmo tratamento), azimute 28°
  offer: {
    box: true,
    lid: "seated",
    camera: { target: [0, 0, 0], dist: 7.8, elev: 12, azim: 28, fov: 28 },
    fit: { height: 2.65, width: 3.1, fillH: 0.88, maxW: 0.92 },
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