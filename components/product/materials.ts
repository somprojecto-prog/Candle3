import * as THREE from "three";
import { COLORS } from "@/lib/constants";

export interface ProductMaterials {
  box: THREE.MeshPhysicalMaterial;
  tray: THREE.MeshPhysicalMaterial;
  jar: THREE.MeshPhysicalMaterial;
  lid: THREE.MeshPhysicalMaterial;
  gold: THREE.MeshStandardMaterial;
  dispose: () => void;
}

const SHEEN = new THREE.Color("#5A5A5A");

function trackEnv(mat: THREE.MeshPhysicalMaterial, intensity: number): void {
  mat.envMapIntensity = intensity;
  mat.onBeforeRender = (_renderer, scene) => {
    const env = scene.environment;
    if (mat.envMap !== env) {
      mat.envMap = env;
      mat.needsUpdate = true;
    }
  };
}

export function createProductMaterials(doubleSide: boolean): ProductMaterials {
  const side = doubleSide ? THREE.DoubleSide : THREE.FrontSide;

  const box = new THREE.MeshPhysicalMaterial({
    color: "#262626",
    roughness: 0.72,
    metalness: 0,
    sheen: 0.6,
    sheenColor: SHEEN,
    sheenRoughness: 0.55,
    side,
  });
  const tray = new THREE.MeshPhysicalMaterial({
    color: "#1E1E1E",
    roughness: 0.85,
    metalness: 0,
    sheen: 0.5,
    sheenColor: SHEEN,
    sheenRoughness: 0.55,
    side,
  });
  const jar = new THREE.MeshPhysicalMaterial({
    color: "#0E0E0E",
    roughness: 0.12,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    specularIntensity: 1,
    ior: 1.5,
    side,
  });
  trackEnv(jar, 2);
  const lid = new THREE.MeshPhysicalMaterial({
    color: "#222222",
    roughness: 0.36,
    metalness: 0.3,
    clearcoat: 0.4,
    side,
  });
  trackEnv(lid, 1.2);
  const gold = new THREE.MeshStandardMaterial({
    color: COLORS.gold,
    roughness: 0.3,
    metalness: 0.85,
    emissive: new THREE.Color(COLORS.gold),
    emissiveIntensity: 0.08,
  });

  return {
    box,
    tray,
    jar,
    lid,
    gold,
    dispose: () => {
      box.dispose();
      tray.dispose();
      jar.dispose();
      lid.dispose();
      gold.dispose();
    },
  };
}
