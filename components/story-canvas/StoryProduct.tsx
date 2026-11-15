"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_PATH } from "@/lib/constants";
import { FIT, GLB_DRACO, USE_GLB } from "@/components/product/config";
import { createBoxDecals, createLidLogo } from "@/components/product/decals";
import { createProductMaterials } from "@/components/product/materials";
import { cloneForViewer, getProductParts, type ProductParts } from "@/components/product/productParts";
import { addLidFloat } from "./lidFloat";
import { boxPose, collectMaterials, lidDelta, makeDelta, updateBoxPose, useStepLight } from "./storyMotion";
import { smooth } from "./storySmooth";
import { sampleTrack, TRACKS } from "./storyTable";

// O GLB tem de estar pronto quando o hero se revela
if (USE_GLB) useGLTF.preload(MODEL_PATH, GLB_DRACO);

interface Assets {
  root: THREE.Group;
  box: THREE.Group; // pivô = centro da bbox
  lid: THREE.Group; // pivô = centro da bbox da tampa
  boxRestY: number;
  lidRest: THREE.Vector3;
  boxMat: THREE.MeshPhysicalMaterial;
  decalMats: THREE.Material[];
  dispose: () => void;
}

const delta = makeDelta();

function buildAssets(parts: ProductParts, invalidate: () => void): Assets {
  const mats = createProductMaterials(true); // GLB: sem garantia de winding
  mats.box.transparent = true; // fade da capa
  const v = cloneForViewer(parts, mats);

  const decals = createBoxDecals(FIT.box.size, invalidate);
  v.box.add(decals.group);
  const logo = createLidLogo(v.lidRadius, v.lidHeight / 2, invalidate);
  v.lid.add(logo.mesh);

  return {
    root: v.root,
    box: v.box,
    lid: v.lid,
    boxRestY: v.box.position.y,
    lidRest: v.lid.position.clone(),
    boxMat: mats.box,
    decalMats: collectMaterials(decals.group),
    // Só materiais/texturas desta instância. Geometrias partilhadas: NUNCA dispose.
    dispose: () => {
      mats.dispose();
      decals.dispose();
      logo.dispose();
    },
  };
}

export default function StoryProduct() {
  const { scene } = useGLTF(MODEL_PATH, GLB_DRACO);
  const invalidate = useThree((s) => s.invalidate);
  useStepLight();

  const assets = useMemo(() => {
    const parts = getProductParts(scene);
    if (!parts) {
      throw new Error(`[StoryProduct] Não foi possível dividir ${MODEL_PATH}; usando o placeholder.`);
    }
    return buildAssets(parts, invalidate);
  }, [scene, invalidate]);

  useEffect(() => () => assets.dispose(), [assets]);
  useLayoutEffect(() => {
    invalidate();
  }, [assets, invalidate]);

  useFrame((state) => {
    // Caixa: sai (fade + −3% de escala) e volta a descer e assentar (easeOutCubic). Jarro e bandeja ficam sempre.
    updateBoxPose(smooth.phase);
    assets.box.position.y = assets.boxRestY + boxPose.y;
    assets.box.scale.setScalar(boxPose.scale);
    assets.boxMat.opacity = boxPose.opacity;
    assets.boxMat.depthWrite = boxPose.opacity >= 1;
    for (let i = 0; i < assets.decalMats.length; i++) assets.decalMats[i].opacity = boxPose.opacity;
    assets.box.visible = boxPose.opacity >= 0.01;

    // Tampa (+ levitação de milímetros entre os estágios 1 e 2)
    const stage = sampleTrack(TRACKS.lidStage, smooth.phase);
    lidDelta(stage, delta);
    addLidFloat(delta, stage, state.clock.elapsedTime);
    assets.lid.position.set(
      assets.lidRest.x + delta.x,
      assets.lidRest.y + delta.y,
      assets.lidRest.z + delta.z,
    );
    assets.lid.rotation.set(delta.rx, delta.ry, delta.rz);
  });

  return <primitive object={assets.root} />;
}