"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MODEL_PATH, type ProductView } from "@/lib/constants";
import { staticBoxPose } from "@/components/story-canvas/revealChoreo";
import { GLB_DRACO } from "./config";
import { createProductMaterials, type ProductMaterials } from "./materials";
import { buildProductFromGltf } from "./productParts";
import { VIEWS } from "./views";

/** Forma mínima usada de buildProductFromGltf (a mesma que este ficheiro já consumia). */
export interface PartLike {
  geometry: THREE.BufferGeometry; // COMPARTILHADA: nunca dar dispose
  position: THREE.Vector3;
}
export interface PartsLike {
  jar: PartLike;
  tray: PartLike;
  lid: PartLike;
  boxMeshes: readonly PartLike[];
  boxPosition: THREE.Vector3;
}

export interface GlbRig {
  root: THREE.Group;
  box: THREE.Group; // pivô no centro da bbox
  lid: THREE.Group; // pivô no centro da bbox
  boxRest: THREE.Vector3;
  lidRest: THREE.Vector3;
}

/** Meshes novos por instância (geometrias partilhadas, materiais próprios). Jarro e bandeja estáticos. */
export function buildGlbRig(parts: PartsLike, mats: ProductMaterials): GlbRig {
  const root = new THREE.Group();

  const jar = new THREE.Mesh(parts.jar.geometry, mats.jar);
  jar.position.copy(parts.jar.position);
  const tray = new THREE.Mesh(parts.tray.geometry, mats.tray);
  tray.position.copy(parts.tray.position);

  const lid = new THREE.Group();
  lid.position.copy(parts.lid.position);
  lid.add(new THREE.Mesh(parts.lid.geometry, mats.lid));

  const box = new THREE.Group();
  box.position.copy(parts.boxPosition);
  parts.boxMeshes.forEach((p) => {
    const m = new THREE.Mesh(p.geometry, mats.box);
    m.position.copy(p.position);
    box.add(m);
  });

  root.add(jar, tray, lid, box);
  return { root, box, lid, boxRest: box.position.clone(), lidRest: lid.position.clone() };
}

export default function ProductModel({ view }: { view: ProductView }) {
  const { scene } = useGLTF(MODEL_PATH, GLB_DRACO);
  const invalidate = useThree((s) => s.invalidate);
  const cfg = VIEWS[view];

  const built = useMemo(() => {
    const parts: PartsLike | null = buildProductFromGltf(scene as THREE.Group);
    if (!parts) throw new Error(`[ProductModel] Não foi possível dividir ${MODEL_PATH}; usando o placeholder.`);
    const mats = createProductMaterials(true);
    return { rig: buildGlbRig(parts, mats), mats };
  }, [scene]);

  useEffect(() => () => built.mats.dispose(), [built]);

  useEffect(() => {
    const { rig } = built;
    const pose = staticBoxPose(cfg.reveal);
    rig.box.visible = cfg.box;
    rig.box.position.set(rig.boxRest.x, rig.boxRest.y + pose.y, rig.boxRest.z);
    rig.box.rotation.set(pose.tilt, pose.yaw, 0);
    rig.lid.visible = cfg.lid === "seated";
    invalidate();
  }, [built, cfg.box, cfg.lid, cfg.reveal, invalidate]);

  return <primitive object={built.rig.root} />;
}