import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BOX_FADE_SCALE } from "@/components/product/config";
import { lightMod } from "@/components/product/lookConfig";
import { smooth } from "./storySmooth";
import { applyStepLight, BOX_RETURN, easeOutCubic, sampleTrack, TRACKS } from "./storyTable";

export interface Delta {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
}
export const makeDelta = (): Delta => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });

interface LidKey {
  p: readonly [number, number, number];
  r: readonly [number, number, number];
}

export const LID_KEYS: readonly LidKey[] = [
  { p: [0, 0, 0], r: [0, 0, 0] }, // 0 assente
  { p: [-0.3, 0.6, 0.2], r: [0.45, 0, 0.32] }, // 1 intention: acima-esquerda, inclinada
  { p: [0, 0.9, 0], r: [0.6, 0, -0.1] }, // 2 notes: acima, centrada
  { p: [0, 0, 0], r: [0, 0, 0] }, // 3 assente
];

export function lidDelta(stage: number, out: Delta): Delta {
  const s = THREE.MathUtils.clamp(stage, 0, 3);
  const i = Math.min(Math.floor(s), 2);
  const t = s - i;
  const a = LID_KEYS[i];
  const b = LID_KEYS[i + 1];
  const { lerp } = THREE.MathUtils;
  out.x = lerp(a.p[0], b.p[0], t);
  out.y = lerp(a.p[1], b.p[1], t);
  out.z = lerp(a.p[2], b.p[2], t);
  out.rx = lerp(a.r[0], b.r[0], t);
  out.ry = lerp(a.r[1], b.r[1], t);
  out.rz = lerp(a.r[2], b.r[2], t);
  return out;
}

export const boxLiftY = (l: number): number => (l <= 1 ? l * 1.6 : 1.6 + (l - 1) * 4.0); // 0..1 pairando; 1..2 sobe e some
export const boxOpacity = (l: number): number => 1 - THREE.MathUtils.smoothstep(l, 1.35, 1.9);
export const boxScale = (l: number): number => 1 - BOX_FADE_SCALE * THREE.MathUtils.smoothstep(l, 1.35, 1.9);

/** Pose derivada da caixa (objeto de módulo, sem alocação): y acima do repouso, opacidade e escala. */
export const boxPose = { y: 0, opacity: 1, scale: 1 };

/**
 * Saída (0→2): sobe, fade e −3% de escala. Regresso (último passo, 2→0): janela [0.40, 1.0] com easeOutCubic
 * (via TRACKS.boxLift), opacidade 0→1 nos primeiros 50% da janela, escala 0.97→1.
 * O jarro e a bandeja nunca esmaecem: só a caixa.
 */
export function updateBoxPose(phase: number): void {
  const lift = sampleTrack(TRACKS.boxLift, phase);
  boxPose.y = boxLiftY(lift);
  if (phase > 3) {
    const w = THREE.MathUtils.clamp((phase - 3 - BOX_RETURN.start) / (BOX_RETURN.end - BOX_RETURN.start), 0, 1);
    boxPose.opacity = THREE.MathUtils.smoothstep(w, 0, BOX_RETURN.fadeEnd);
    boxPose.scale = BOX_RETURN.scaleFrom + (1 - BOX_RETURN.scaleFrom) * easeOutCubic(w);
  } else {
    boxPose.opacity = boxOpacity(lift);
    boxPose.scale = boxScale(lift);
  }
}

/** Escreve `lightMod` por frame (prioridade −0.5: antes do LightRig, depois do rig da câmera). Repõe 1 ao sair. */
export function useStepLight(): void {
  useFrame(() => applyStepLight(smooth.phase), -0.5);
  useEffect(
    () => () => {
      lightMod.key = lightMod.fill = lightMod.top = lightMod.rim = 1;
    },
    [],
  );
}

/** Materiais de todos os meshes sob `root`. */
export function collectMaterials(root: THREE.Object3D): THREE.Material[] {
  const out: THREE.Material[] = [];
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const m = o.material as THREE.Material | THREE.Material[];
    if (Array.isArray(m)) out.push(...m);
    else out.push(m);
  });
  return out;
}