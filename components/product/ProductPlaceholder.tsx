"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import type { ProductView } from "@/lib/constants";
import { createProjectedBox } from "./boxUV";
import { FIT } from "./config";
import { createBoxDecals, createLidLogo } from "./decals";
import { createProductMaterials } from "./materials";
import { VIEWS } from "./views";

const [TW, TH, TD] = FIT.tray.size;
const [BW, BH, BD] = FIT.box.size;
const JAR_R = 0.64;
const LID_R = FIT.lid.diameter / 2;
const LID_H = 0.18;

/** Fallback estático: mesmas medidas (FIT), mesmos materiais e decals que o GLB. */
export default function ProductPlaceholder({ view }: { view: ProductView }) {
  const invalidate = useThree((s) => s.invalidate);
  const cfg = VIEWS[view];

  const mats = useMemo(() => createProductMaterials(false), []);
  const trayGeo = useMemo(() => createProjectedBox(TW, TH, TD), []);
  const boxGeo = useMemo(() => createProjectedBox(BW, BH, BD), []);
  const decals = useMemo(() => createBoxDecals(FIT.box.size, invalidate), [invalidate]);
  const logo = useMemo(() => createLidLogo(LID_R, LID_H / 2, invalidate), [invalidate]);

  useEffect(() => () => mats.dispose(), [mats]);
  useEffect(() => () => trayGeo.dispose(), [trayGeo]);
  useEffect(() => () => boxGeo.dispose(), [boxGeo]);
  useEffect(() => () => decals.dispose(), [decals]);
  useEffect(() => () => logo.dispose(), [logo]);

  return (
    <group>
      <mesh geometry={trayGeo} material={mats.tray} position={[0, FIT.tray.bottomY + TH / 2, 0]} />

      <mesh position={[0, FIT.jar.centerY, 0]} material={mats.jar}>
        <cylinderGeometry args={[JAR_R, JAR_R, FIT.jar.height, 64]} />
      </mesh>

      <group position={[0, FIT.lid.bottomY + LID_H / 2, 0]} visible={cfg.lid === "seated"}>
        <mesh material={mats.lid}>
          <cylinderGeometry args={[LID_R, LID_R, LID_H, 64]} />
        </mesh>
        <primitive object={logo.mesh} />
      </group>

      <group position={[0, FIT.box.bottomY + BH / 2, 0]} visible={cfg.box}>
        <mesh geometry={boxGeo} material={mats.box} />
        <primitive object={decals.group} />
      </group>
    </group>
  );
}