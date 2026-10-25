"use client";

import { Environment, Lightformer } from "@react-three/drei";
import LightRig from "./LightRig";

export default function StudioLights() {
  return (
    <>
      <LightRig />
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3.5}
          color="#FFFFFF"
          position={[-6, 1, 4]}
          rotation-y={2.159}
          scale={[4, 6, 1]}
        />
        <Lightformer form="rect" intensity={5} color="#FFFFFF" position={[-5, 1, -5]} scale={[1, 9, 1]} />
        <Lightformer form="rect" intensity={5} color="#FFFFFF" position={[5, 1, -5]} scale={[1, 9, 1]} />
        <Lightformer
          form="rect"
          intensity={1.0}
          color="#FFF4E6"
          position={[0, 7, 0]}
          rotation-x={Math.PI / 2}
          scale={[10, 6, 1]}
        />
        <Lightformer form="rect" intensity={0.8} color="#FFFFFF" position={[6, 0.5, 3]} scale={[2, 5, 1]} />
      </Environment>
    </>
  );
}
