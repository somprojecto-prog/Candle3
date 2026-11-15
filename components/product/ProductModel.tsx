"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import { MODEL_PATH, type ProductView } from "@/lib/constants";
import { FIT, GLB_DRACO } from "./config";
import { createBoxDecals, createLidLogo } from "./decals";
import { createProductMaterials } from "./materials";
import { cloneForViewer, getProductParts, type ProductParts } from "./productParts";
import { VIEWS } from "./views";

interface Assets {
  root: THREE.Group;
  box: THREE.Group;
  lid: THREE.Group;
  dispose: () => void;
}

function buildAssets(parts: ProductParts, invalidate: () => void): Assets {
  const mats = createProductMaterials(true); // GLB: sem garantia de winding
  const v = cloneForViewer(parts, mats);
  const decals = createBoxDecals(FIT.box.size, invalidate);
  v.box.add(decals.group);
  const logo = createLidLogo(v.lidRadius, v.lidHeight / 2, invalidate);
  v.lid.add(logo.mesh);
  return {
    root: v.root,
    box: v.box,
    lid: v.lid,
    // Só materiais/texturas desta instância. Geometrias partilhadas: NUNCA dispose.
    dispose: () => {
      mats.dispose();
      decals.dispose();
      logo.dispose();
    },
  };
}

export default function ProductModel({ view }: { view: ProductView }) {
  const { scene } = useGLTF(MODEL_PATH, GLB_DRACO);
  const invalidate = useThree((s) => s.invalidate);
  const cfg = VIEWS[view];

  const assets = useMemo(() => {
    const parts = getProductParts(scene);
    if (!parts) {
      throw new Error(`[ProductModel] Não foi possível dividir ${MODEL_PATH}; usando o placeholder.`);
    }
    return buildAssets(parts, invalidate);
  }, [scene, invalidate]);

  useEffect(() => () => assets.dispose(), [assets]);

  useLayoutEffect(() => {
    assets.box.visible = cfg.box;
    assets.lid.visible = cfg.lid === "seated";
    invalidate();
  }, [assets, cfg.box, cfg.lid, invalidate]);

  return <primitive object={assets.root} />;
}