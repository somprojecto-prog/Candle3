import { MathUtils } from "three";
import { sampleTrack, TRACKS } from "./storyTable";

/** Coreografia da abertura (ProductReveal): scrub linear de `reveal` (0..1). Única fonte destes números. */
export const CHOREO = {
  hop: 0.12, // unidades: a caixa sobe um pouco nos primeiros 30%
  hover: 2.1, // unidades acima da posição fechada (≥ 2.0), equivale a boxLift = 1
  exitSpan: 4.0, // unidades extra de boxLift 1→2 (a capa sai de cena)
  hopEnd: 0.3,
  riseEnd: 0.48, // fim da subida vertical (a inclinação só começa aqui)
  tiltEnd: 0.6,
  exitEnd: 0.85, // a capa sai de cena e faz fade enquanto a vela se revela
  lightDipEnd: 0.3,
  lightRiseStart: 0.6,
  lightRiseEnd: 1.0,
  yawDeg: 8,
  yawDegMobile: 4,
  tilt: -0.2, // rad em X (tomba para longe da câmera)
  lightMin: 0.7, // ×key/fill durante a abertura
  shadowMin: 0.45, // ×LOOK.shadow durante a abertura
  dolly: 0.08,
  dollyMobile: 0.06,
  liftMobile: 1.25,
} as const;

const D2R = Math.PI / 180;
const ss = MathUtils.smoothstep;

/** boxLift 0..1: sobe até `hover` unidades; 1..2: sobe mais e sai de cena. */
export const boxLiftY = (l: number): number =>
  l <= 1 ? l * CHOREO.hover : CHOREO.hover + (l - 1) * CHOREO.exitSpan;

export function liftFromReveal(r: number): number {
  const a = CHOREO.hop / CHOREO.hover;
  if (r <= CHOREO.hopEnd) return a * ss(r, 0, CHOREO.hopEnd);
  if (r <= CHOREO.riseEnd) return a + (1 - a) * ss(r, CHOREO.hopEnd, CHOREO.riseEnd);
  if (r <= CHOREO.tiltEnd) return 1;
  return 1 + ss(r, CHOREO.tiltEnd, CHOREO.exitEnd);
}
export const tiltFromReveal = (r: number): number => CHOREO.tilt * ss(r, CHOREO.riseEnd, CHOREO.tiltEnd);
export const tiltFromLift = (l: number): number => CHOREO.tilt * ss(l, 0.5, 1.0);
export function yawFromReveal(r: number, mobile: boolean): number {
  const deg = mobile ? CHOREO.yawDegMobile : CHOREO.yawDeg;
  return deg * D2R * ss(r, 0, CHOREO.hopEnd) * (1 - ss(r, CHOREO.hopEnd, CHOREO.tiltEnd));
}
/** Dip 1→min nos primeiros 30% (o hero mantém o look afinado), depois sobe min→1 em 0.60–1.00. */
function dipRise(r: number, min: number): number {
  if (r < CHOREO.lightRiseStart) return 1 - (1 - min) * ss(r, 0, CHOREO.lightDipEnd);
  return min + (1 - min) * ss(r, CHOREO.lightRiseStart, CHOREO.lightRiseEnd);
}

/** Estado derivado por frame (objeto de módulo, sem alocação). Escrito por stepSmooth; lido por câmera/luz/peças. */
export const choreo = {
  lift: 0,
  liftK: 1,
  tilt: 0,
  yaw: 0,
  light: 1,
  shadow: 1,
  dolly: 1,
  stage: 0,
  visible: 1,
};

/** phase < 2: caixa, yaw e luz são funções puras de `reveal`. phase ≥ 2: mandam as tabelas. */
export function updateChoreo(phase: number, reveal: number, mobile: boolean): void {
  const c = choreo;
  const d = mobile ? CHOREO.dollyMobile : CHOREO.dolly;
  c.liftK = mobile ? CHOREO.liftMobile : 1;
  if (phase < 2) {
    c.lift = liftFromReveal(reveal);
    c.tilt = tiltFromReveal(reveal);
    c.yaw = yawFromReveal(reveal, mobile);
    c.light = dipRise(reveal, CHOREO.lightMin);
    c.shadow = dipRise(reveal, CHOREO.shadowMin);
    c.dolly = 1 - d * ss(reveal, CHOREO.lightRiseStart, CHOREO.lightRiseEnd);
  } else {
    c.lift = sampleTrack(TRACKS.boxLift, phase);
    c.tilt = tiltFromLift(c.lift);
    c.yaw = 0;
    c.light = 1;
    c.shadow = 1;
    c.dolly = 1 - d * (1 - MathUtils.clamp(phase - 2, 0, 1)); // a câmera volta ao enquadramento normal sem o produto visível
  }
  c.stage = sampleTrack(TRACKS.lidStage, phase);
  c.visible = sampleTrack(TRACKS.visible, phase);
}

/** Pose estática da caixa para os viewers (reveal = 0 fechada, ≈0.55 pairando). */
export function staticBoxPose(reveal: number): { y: number; tilt: number; yaw: number } {
  return {
    y: boxLiftY(liftFromReveal(reveal)),
    tilt: tiltFromReveal(reveal),
    yaw: yawFromReveal(reveal, false),
  };
}