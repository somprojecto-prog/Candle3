"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { FIT } from "@/components/product/config";
import { createProductMaterials } from "@/components/product/materials";
import { addLidFloat } from "./lidFloat";
import { choreo } from "./revealChoreo";
import { boxLiftY, boxOpacity, boxScale, lidDelta, makeDelta } from "./storyMotion";

const [TW, TH, TD] = FIT.tray.size;
const TRAY_CY = FIT.tray.bottomY + TH / 2;
const [BW, BH, BD] = FIT.box.size;
const BOX_CY = FIT.box.bottomY + BH / 2;
const JAR_R = 0.64;
const LID_R = FIT.lid.diameter / 2;
const LID_H = 0.18;
const LID_CY = FIT.lid.bottomY + LID_H / 2;

const delta = makeDelta();

export default function StoryPlaceholder() {
  const boxRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  const mats = useMemo(() => {
    const m = createProductMaterials(false);
    m.box.transparent = true;
    return m;
  }, []);
  useEffect(() => () => mats.dispose(), [mats]);

  useFrame((state) => {
    const c = choreo;
    const box = boxRef.current;
    const lid = lidRef.current;

    if (box) {
      const o = boxOpacity(c.lift);
      box.position.y = BOX_CY + boxLiftY(c.lift) * c.liftK;
      box.rotation.set(c.tilt, c.yaw, 0);
      box.scale.setScalar(boxScale(c.lift));
      mats.box.opacity = o;
      mats.box.depthWrite = o >= 1;
      box.visible = o >= 0.01;
    }
    if (lid) {
      lidDelta(c.stage, delta);
      addLidFloat(delta, c.stage, state.clock.elapsedTime);
      lid.position.set(delta.x, LID_CY + delta.y, delta.z);
      lid.rotation.set(delta.rx, delta.ry, delta.rz);
    }
  });

  return (
    <group>
      <mesh position={[0, FIT.jar.centerY, 0]} material={mats.jar}>
        <cylinderGeometry args={[JAR_R, JAR_R, FIT.jar.height, 64]} />
      </mesh>

      <group ref={lidRef} position={[0, LID_CY, 0]}>
        <mesh material={mats.lid}>
          <cylinderGeometry args={[LID_R, LID_R, LID_H, 64]} />
        </mesh>
      </group>

      <RoundedBox args={[TW, TH, TD]} radius={0.04} smoothness={4} position={[0, TRAY_CY, 0]} material={mats.tray} />

      <group ref={boxRef} position={[0, BOX_CY, 0]}>
        <mesh material={mats.box}>
          <boxGeometry args={[BW, BH, BD]} />
        </mesh>
      </group>
    </group>
  );
}