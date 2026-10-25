import * as THREE from "three";
import { COLORS } from "@/lib/constants";
import { lookAzim } from "./camState";
import { LOOK } from "./lookConfig";

export interface ProductMaterials {
  box: THREE.MeshPhysicalMaterial;
  tray: THREE.MeshPhysicalMaterial;
  jar: THREE.MeshPhysicalMaterial;
  lid: THREE.MeshPhysicalMaterial;
  gold: THREE.MeshStandardMaterial;
  dispose: () => void;
}

const SHEEN = "#6A6A6A";

function setGrey(mat: THREE.MeshPhysicalMaterial, v: number): void {
  const k = v / 255;
  mat.color.setRGB(k, k, k, THREE.SRGBColorSpace);
}

function live(mat: THREE.MeshPhysicalMaterial, albedo: () => number, env: () => number): void {
  setGrey(mat, albedo());
  let seen = LOOK.rev;
  mat.onBeforeRender = (_renderer, scene) => {
    if (seen !== LOOK.rev) {
      seen = LOOK.rev;
      setGrey(mat, albedo());
    }
    mat.envMapIntensity = env();
    const e = scene.environment;
    if (mat.envMap !== e) {
      mat.envMap = e;
      mat.needsUpdate = true;
    }
    mat.envMapRotation.y = lookAzim(scene);
  };
}

export function createProductMaterials(doubleSide: boolean): ProductMaterials {
  const side = doubleSide ? THREE.DoubleSide : THREE.FrontSide;

  const box = new THREE.MeshPhysicalMaterial({
    roughness: 0.72,
    metalness: 0,
    sheen: 0.6,
    sheenColor: new THREE.Color(SHEEN),
    sheenRoughness: 0.5,
    side,
  });
  live(box, () => LOOK.albedo.box, () => LOOK.matEnv);

  const tray = new THREE.MeshPhysicalMaterial({
    roughness: 0.85,
    metalness: 0,
    sheen: 0.5,
    sheenColor: new THREE.Color(SHEEN),
    sheenRoughness: 0.5,
    side,
  });
  live(tray, () => LOOK.albedo.tray, () => LOOK.matEnv);

  const lid = new THREE.MeshPhysicalMaterial({
    roughness: 0.36,
    metalness: 0.3,
    clearcoat: 0.4,
    clearcoatRoughness: 0.15,
    side,
  });
  live(lid, () => LOOK.albedo.lid, () => LOOK.matEnv);

  const jar = new THREE.MeshPhysicalMaterial({
    roughness: 0.12,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    ior: 1.5,
    specularIntensity: 1,
    side,
  });
  live(jar, () => LOOK.albedo.jar, () => LOOK.jarEnv);

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
