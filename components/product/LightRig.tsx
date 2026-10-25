"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { lookAzim } from "./camState";
import { LOOK, LOOK_INFO, subscribeLook } from "./lookConfig";

export default function LightRig() {
  const invalidate = useThree((s) => s.invalidate);
  const rig = useRef<THREE.Group>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const top = useRef<THREE.DirectionalLight>(null);
  const rimL = useRef<THREE.SpotLight>(null);
  const rimR = useRef<THREE.SpotLight>(null);

  useEffect(() => subscribeLook(invalidate), [invalidate]);

  useFrame(({ gl, scene }) => {
    if (gl.toneMapping !== THREE.NeutralToneMapping) gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = LOOK.exposure;
    LOOK_INFO.tone = gl.toneMapping;
    LOOK_INFO.exposure = gl.toneMappingExposure;

    if (rig.current) rig.current.rotation.y = lookAzim(scene);
    if (hemi.current) hemi.current.intensity = LOOK.hemi;
    if (key.current) key.current.intensity = LOOK.key;
    if (fill.current) fill.current.intensity = LOOK.fill;
    if (top.current) top.current.intensity = LOOK.top;
    if (rimL.current) rimL.current.intensity = LOOK.rimL;
    if (rimR.current) rimR.current.intensity = LOOK.rimR;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#FFFFFF", "#1A1A1A"]} intensity={LOOK.hemi} />
      <group ref={rig}>
        <directionalLight ref={key} color="#FFF4E6" intensity={LOOK.key} position={[-4, 5, 4.5]} />
        <directionalLight ref={fill} color="#FFFFFF" intensity={LOOK.fill} position={[4.5, 1.5, 3.5]} />
        <directionalLight ref={top} color="#FFFFFF" intensity={LOOK.top} position={[0, 6, 1]} />
        <spotLight
          ref={rimL}
          color="#FFFFFF"
          intensity={LOOK.rimL}
          position={[-3.8, 3, -4.8]}
          angle={0.55}
          penumbra={1}
          decay={2}
        />
        <spotLight
          ref={rimR}
          color="#FFF1DC"
          intensity={LOOK.rimR}
          position={[3.8, 2.6, -4.8]}
          angle={0.55}
          penumbra={1}
          decay={2}
        />
      </group>
    </>
  );
}
