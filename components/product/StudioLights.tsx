"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { perfConfig } from "@/components/story-canvas/perfTier";
import LightRig from "./LightRig";
import { ENV_FORMERS } from "./lookConfig";

/** Rig relativo à câmera + ambiente 100% procedural (números em lookConfig; resolução por tier). */
export default function StudioLights() {
  return (
    <>
      <LightRig />
      <Environment resolution={perfConfig().envRes}>
        {ENV_FORMERS.map((f, i) => (
          <Lightformer
            key={i}
            form="rect"
            intensity={f.intensity}
            color={f.color}
            position={[f.pos[0], f.pos[1], f.pos[2]]}
            rotation={f.rot ? [f.rot[0], f.rot[1], f.rot[2]] : [0, 0, 0]}
            scale={[f.scale[0], f.scale[1], f.scale[2]]}
          />
        ))}
      </Environment>
    </>
  );
}