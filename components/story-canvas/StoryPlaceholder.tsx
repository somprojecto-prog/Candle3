"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createProjectedBox } from "@/components/product/boxUV";
import { FIT } from "@/components/product/config";
import { createBoxDecals, createLidLogo } from "@/components/product/decals";
import { createProductMaterials } from "@/components/product/materials";
import { addLidFloat } from "./lidFloat";
import { boxPose, collectMaterials, lidDelta, makeDelta, updateBoxPose, useStepLight } from "./storyMotion";
import { smooth } from "./storySmooth";
import { sampleTrack, TRACKS } from "./storyTable";

const [TW, TH, TD] = FIT.tray.size;
const [BW, BH, BD] = FIT.box.size;
const BOX_CY = FIT.box.bottomY + BH / 2;
const JAR_R = 0.64;
const LID_R = FIT.lid.diameter / 2;
const LID_H = 0.18;
const LID_CY = FIT.lid.bottomY + LID_H / 2;

const delta = makeDelta();

/** Fallback do story: mesmas medidas (FIT), materiais, decals e movimento que o GLB. */
export default function StoryPlaceholder() {
  const invalidate = useThree((s) => s.invalidate);
  const boxRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  useStepLight();

  const mats = useMemo(() => {
    const m = createProductMaterials(false);
    m.box.transparent = true;
    return m;
  }, []);
  const trayGeo = useMemo(() => createProjectedBox(TW, TH, TD), []);
  const boxGeo = useMemo(() => createProjectedBox(BW, BH, BD), []);
  const decals = useMemo(() => createBoxDecals(FIT.box.size, invalidate), [invalidate]);
  const decalMats = useMemo(() => collectMaterials(decals.group), [decals]);
  const logo = useMemo(() => createLidLogo(LID_R, LID_H / 2, invalidate), [invalidate]);

  useEffect(() => () => mats.dispose(), [mats]);
  useEffect(() => () => trayGeo.dispose(), [trayGeo]);
  useEffect(() => () => boxGeo.dispose(), [boxGeo]);
  useEffect(() => () => decals.dispose(), [decals]);
  useEffect(() => () => logo.dispose(), [logo]);

  useFrame((state) => {
    const box = boxRef.current;
    const lid = lidRef.current;

    if (box) {
      updateBoxPose(smooth.phase);
      box.position.y = BOX_CY + boxPose.y;
      box.scale.setScalar(boxPose.scale);
      mats.box.opacity = boxPose.opacity;
      mats.box.depthWrite = boxPose.opacity >= 1;
      for (let i = 0; i < decalMats.length; i++) decalMats[i].opacity = boxPose.opacity;
      box.visible = boxPose.opacity >= 0.01;
    }

    if (lid) {
      const stage = sampleTrack(TRACKS.lidStage, smooth.phase);
      lidDelta(stage, delta);
      addLidFloat(delta, stage, state.clock.elapsedTime);
      lid.position.set(delta.x, LID_CY + delta.y, delta.z);
      lid.rotation.set(delta.rx, delta.ry, delta.rz);
    }
  });

  return (
    <group>
      <mesh geometry={trayGeo} material={mats.tray} position={[0, FIT.tray.bottomY + TH / 2, 0]} />

      <mesh position={[0, FIT.jar.centerY, 0]} material={mats.jar}>
        <cylinderGeometry args={[JAR_R, JAR_R, FIT.jar.height, 64]} />
      </mesh>

      <group ref={lidRef} position={[0, LID_CY, 0]}>
        <mesh material={mats.lid}>
          <cylinderGeometry args={[LID_R, LID_R, LID_H, 64]} />
        </mesh>
        <primitive object={logo.mesh} />
      </group>

      <group ref={boxRef} position={[0, BOX_CY, 0]}>
        <mesh geometry={boxGeo} material={mats.box} />
        <primitive object={decals.group} />
      </group>
    </group>
  );
}