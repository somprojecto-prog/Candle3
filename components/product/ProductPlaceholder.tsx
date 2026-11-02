"use client";

import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import type { ProductView } from "@/lib/constants";
import { staticBoxPose } from "@/components/story-canvas/revealChoreo";
import { FIT } from "./config";
import { createProductMaterials } from "./materials";
import { VIEWS } from "./views";

export default function ProductPlaceholder({ view }: { view: ProductView }) {
  const mats = useMemo(() => createProductMaterials(false), []);
  useEffect(() => () => mats.dispose(), [mats]);

  const cfg = VIEWS[view];
  const pose = useMemo(() => staticBoxPose(cfg.reveal), [cfg.reveal]);
  const [tw, th, td] = FIT.tray.size;
  const [bw, bh, bd] = FIT.box.size;
  const jarR = 0.64;
  const lidR = FIT.lid.diameter / 2;
  const lidH = 0.18;

  return (
    <group>
      <RoundedBox
        args={[tw, th, td]}
        radius={0.04}
        smoothness={4}
        position={[0, FIT.tray.bottomY + th / 2, 0]}
        material={mats.tray}
      />
      <mesh position={[0, FIT.jar.centerY, 0]} material={mats.jar}>
        <cylinderGeometry args={[jarR, jarR, FIT.jar.height, 64]} />
      </mesh>
      {cfg.lid === "seated" && (
        <mesh position={[0, FIT.lid.bottomY + lidH / 2, 0]} material={mats.lid}>
          <cylinderGeometry args={[lidR, lidR, lidH, 64]} />
        </mesh>
      )}
      {cfg.box && (
        <mesh
          position={[0, FIT.box.bottomY + bh / 2 + pose.y, 0]}
          rotation={[pose.tilt, pose.yaw, 0]}
          material={mats.box}
        >
          <boxGeometry args={[bw, bh, bd]} />
        </mesh>
      )}
    </group>
  );
}