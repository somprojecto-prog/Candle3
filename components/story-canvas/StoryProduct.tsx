"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_PATH } from "@/lib/constants";
import { GLB_DRACO, USE_GLB } from "@/components/product/config";
import { createProductMaterials } from "@/components/product/materials";
import { buildGlbRig, type PartsLike } from "@/components/product/ProductModel";
import { buildProductFromGltf } from "@/components/product/productParts";
import { addLidFloat } from "./lidFloat";
import { choreo } from "./revealChoreo";
import { boxLiftY, boxOpacity, boxScale, lidDelta, makeDelta } from "./storyMotion";

// O GLB tem de estar pronto quando o hero se revela
if (USE_GLB) useGLTF.preload(MODEL_PATH, GLB_DRACO);

const delta = makeDelta();

export default function StoryProduct() {
  const { scene } = useGLTF(MODEL_PATH, GLB_DRACO);
  const invalidate = useThree((s) => s.invalidate);

  const rig = useMemo(() => {
    const parts: PartsLike | null = buildProductFromGltf(scene as THREE.Group);
    if (!parts) throw new Error(`[StoryProduct] Não foi possível dividir ${MODEL_PATH}; usando o placeholder.`);
    const mats = createProductMaterials(true); // GLB: sem garantia de winding
    mats.box.transparent = true; // fade da capa
    return { ...buildGlbRig(parts, mats), mats };
  }, [scene]);

  // Só materiais desta instância. Geometrias partilhadas: NUNCA dispose.
  useEffect(() => () => rig.mats.dispose(), [rig]);
  useLayoutEffect(() => {
    invalidate();
  }, [rig, invalidate]);

  useFrame((state) => {
    const c = choreo;

    // Capa: sobe, inclina, roda e faz fade. Jarro e bandeja ficam sempre parados.
    const o = boxOpacity(c.lift);
    rig.box.position.set(rig.boxRest.x, rig.boxRest.y + boxLiftY(c.lift) * c.liftK, rig.boxRest.z);
    rig.box.rotation.set(c.tilt, c.yaw, 0);
    rig.box.scale.setScalar(boxScale(c.lift));
    rig.mats.box.opacity = o;
    rig.mats.box.depthWrite = o >= 1;
    rig.box.visible = o >= 0.01;

    // Tampa
    lidDelta(c.stage, delta);
    addLidFloat(delta, c.stage, state.clock.elapsedTime);
    rig.lid.position.set(rig.lidRest.x + delta.x, rig.lidRest.y + delta.y, rig.lidRest.z + delta.z);
    rig.lid.rotation.set(delta.rx, delta.ry, delta.rz);
  });

  return <primitive object={rig.root} />;
}