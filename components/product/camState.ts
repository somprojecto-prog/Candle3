import type { Scene } from "three";

export const camState = { azim: 0 };

export function lookAzim(scene: Scene): number {
  const v = scene.userData.lookAzim;
  return typeof v === "number" ? v : camState.azim;
}
