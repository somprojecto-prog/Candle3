import * as THREE from "three";
import { camState } from "@/components/product/camState";
import { STORY_FOCUS, STORY_FOCUS_MOBILE } from "@/lib/story";
import { choreo } from "./revealChoreo";
import { motion } from "./storySmooth";

export interface StoryCamKey {
  target: readonly [number, number, number];
  height: number; // altura (unid. da cena) da silhueta projetada
  width: number; // largura projetada
  fillH: number; // fração máx. da altura do viewport
  maxW: number; // fração máx. da largura do viewport
  elev: number; // graus
  azim: number; // graus
  fov: number; // graus
}

// ÚNICAS tabelas de câmera (hero, reveal, statement, intention, notes, specs). Afine em /dev/story.
export const STORY_CAMERA: readonly StoryCamKey[] = [
  { target: [0, 0.0, 0], height: 2.6, width: 3.15, fillH: 0.62, maxW: 0.34, elev: 13, azim: 30, fov: 28 }, // 0 hero: caixa fechada ¾ → ≈34% da largura (80–92% da coluna direita)
  { target: [0, 0.85, 0], height: 4.6, width: 3.2, fillH: 0.72, maxW: 0.42, elev: 16, azim: 14, fov: 28 }, // 1 reveal: altura total com a capa a 2.1 u acima
  { target: [0, 0.85, 0], height: 4.6, width: 3.2, fillH: 0.72, maxW: 0.42, elev: 16, azim: 14, fov: 28 }, // 2 statement: cópia do 1 (oculto, câmera parada)
  { target: [0, 0.2, 0], height: 2.4, width: 2.2, fillH: 0.8, maxW: 0.52, elev: 22, azim: -24, fov: 28 }, // 3 intention: close-up jarro+bandeja, tampa a flutuar, à esquerda
  { target: [0, 0.2, 0], height: 2.4, width: 2.2, fillH: 0.8, maxW: 0.52, elev: 22, azim: -24, fov: 28 }, // 4 notes: cópia do 3 (oculto)
  { target: [0, 0.0, 0], height: 2.6, width: 3.25, fillH: 0.66, maxW: 0.36, elev: 10, azim: 38, fov: 28 }, // 5 specs: caixa fechada ¾, à esquerda (≤ 38%)
];

export const STORY_CAMERA_MOBILE: readonly StoryCamKey[] = [
  { target: [0, 0.0, 0], height: 2.6, width: 3.15, fillH: 0.5, maxW: 0.8, elev: 13, azim: 30, fov: 28 }, // 0 hero: metade de baixo
  { target: [0, 0.85, 0], height: 4.6, width: 3.2, fillH: 0.62, maxW: 0.8, elev: 16, azim: 14, fov: 28 }, // 1 reveal
  { target: [0, 0.85, 0], height: 4.6, width: 3.2, fillH: 0.62, maxW: 0.8, elev: 16, azim: 14, fov: 28 }, // 2 statement (cópia)
  { target: [0, 0.2, 0], height: 2.4, width: 2.2, fillH: 0.5, maxW: 0.8, elev: 22, azim: -24, fov: 28 }, // 3 intention
  { target: [0, 0.2, 0], height: 2.4, width: 2.2, fillH: 0.5, maxW: 0.8, elev: 22, azim: -24, fov: 28 }, // 4 notes (cópia)
  { target: [0, 0.0, 0], height: 2.6, width: 3.25, fillH: 0.5, maxW: 0.8, elev: 10, azim: 38, fov: 28 }, // 5 specs
];

/** Alvo atual (atualizado por frame): o BackdropGlow segue-o. */
export const currentTarget = new THREE.Vector3();

const N = STORY_CAMERA.length;
const D2R = Math.PI / 180;
const MAX_ELEV = 85;

const _off = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _sph = new THREE.Spherical();
const { lerp, clamp } = THREE.MathUtils;

function distanceFor(k: StoryCamKey, aspect: number): number {
  const th = Math.tan((k.fov * D2R) / 2);
  const distH = k.height / k.fillH / (2 * th);
  const distW = k.width / k.maxW / (2 * th * Math.max(aspect, 0.01));
  return Math.max(distH, distW);
}

export function sampleStoryCamera(phase: number, camera: THREE.PerspectiveCamera, aspect: number): void {
  const keys = motion.mobile ? STORY_CAMERA_MOBILE : STORY_CAMERA;
  const focus = motion.mobile ? STORY_FOCUS_MOBILE : STORY_FOCUS;
  const p = clamp(phase, 0, N - 1);
  const i = Math.min(Math.floor(p), N - 2);
  const t = p - i; // linear: o A já suavizou a fração
  const a = keys[i];
  const b = keys[i + 1];

  currentTarget.set(
    lerp(a.target[0], b.target[0], t),
    lerp(a.target[1], b.target[1], t),
    lerp(a.target[2], b.target[2], t),
  );

  const dist = lerp(distanceFor(a, aspect), distanceFor(b, aspect), t) * choreo.dolly; // dolly-in da abertura
  const elev = clamp(lerp(a.elev, b.elev, t), -MAX_ELEV, MAX_ELEV) * D2R;
  let dAz = b.azim - a.azim;
  dAz -= 360 * Math.round(dAz / 360);
  const azim = (a.azim + dAz * t) * D2R;
  const fov = lerp(a.fov, b.fov, t);

  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }

  _sph.set(dist, Math.PI / 2 - elev, azim);
  _off.setFromSpherical(_sph);
  // Azimute ANTES do deslocamento de enquadramento: luzes e ambiente rodam com ele
  camState.azim = Math.atan2(_off.x, _off.z);

  camera.position.copy(currentTarget).add(_off);
  camera.lookAt(currentTarget);
  camera.updateMatrix();
  _right.setFromMatrixColumn(camera.matrix, 0);
  _up.setFromMatrixColumn(camera.matrix, 1);

  // Enquadramento por projeção: o alvo cai em STORY_FOCUS interpolado
  const fa = focus[i];
  const fb = focus[i + 1];
  let fx = lerp(fa[0], fb[0], t);
  const fy = lerp(fa[1], fb[1], t);
  if (!motion.mobile && aspect < 1.5) fx = lerp(0.5, fx, clamp((aspect - 1) / 0.5, 0, 1));

  const ndcX = 2 * fx - 1;
  const ndcY = 1 - 2 * fy;
  const halfH = dist * Math.tan((camera.fov * D2R) / 2);
  const halfW = halfH * aspect;
  camera.position.addScaledVector(_right, -ndcX * halfW).addScaledVector(_up, -ndcY * halfH);
}