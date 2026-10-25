"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { LOOK, subscribeLook } from "./lookConfig";

interface BackdropGlowProps {
  size: number;
  center: [number, number, number];
  follow?: THREE.Vector3;
}

const MAX_PEAK = 0.12;
const BEHIND = 2;
const FLOOR_Y = -1.0 + 0.002;
const POOL_K = 0.2;
const GLOW_LAYER = 1;

const _c = new THREE.Vector3();
const _dir = new THREE.Vector3();

function createGlowTexture(): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const img = ctx.createImageData(S, S);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const r = Math.min(Math.hypot(x + 0.5 - S / 2, y + 0.5 - S / 2) / (S / 2), 1);
        const a = 1 - r * r * (3 - 2 * r);
        const i = (y * S + x) * 4;
        img.data[i] = 255;
        img.data[i + 1] = 241;
        img.data[i + 2] = 220;
        img.data[i + 3] = Math.round(a * 255);
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function BackdropGlow({ size, center, follow }: BackdropGlowProps) {
  const camera = useThree((s) => s.camera);
  const haloRef = useRef<THREE.Mesh>(null);
  const poolRef = useRef<THREE.Mesh>(null);

  const tex = useMemo(() => createGlowTexture(), []);
  const mk = () =>
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      opacity: 0,
    });
  const haloMat = useMemo(mk, [tex]);
  const poolMat = useMemo(mk, [tex]);

  useEffect(() => () => tex.dispose(), [tex]);
  useEffect(() => () => haloMat.dispose(), [haloMat]);
  useEffect(() => () => poolMat.dispose(), [poolMat]);

  useLayoutEffect(() => {
    haloRef.current?.layers.set(GLOW_LAYER);
    poolRef.current?.layers.set(GLOW_LAYER);
    camera.layers.enable(GLOW_LAYER);
    return () => {
      camera.layers.disable(GLOW_LAYER);
    };
  }, [camera]);

  useFrame(({ camera: cam }) => {
    const halo = haloRef.current;
    const pool = poolRef.current;
    if (!halo || !pool) return;

    const peak = Math.min(LOOK.halo, MAX_PEAK);
    haloMat.opacity = peak;
    poolMat.opacity = peak * POOL_K;

    const c = follow ?? _c.set(center[0], center[1], center[2]);
    _dir.copy(c).sub(cam.position).normalize();
    halo.position.copy(c).addScaledVector(_dir, BEHIND);
    halo.quaternion.copy(cam.quaternion);
    pool.position.set(c.x, FLOOR_Y, c.z);
  });

  return (
    <>
      <mesh ref={haloRef} material={haloMat} renderOrder={-2}>
        <planeGeometry args={[size, size]} />
      </mesh>
      <mesh ref={poolRef} material={poolMat} rotation-x={-Math.PI / 2} renderOrder={-1}>
        <planeGeometry args={[size * 1.8, size * 1.8]} />
      </mesh>
    </>
  );
}

export function StageShadow() {
  const [, setRev] = useState(0);
  useEffect(() => subscribeLook(() => setRev(LOOK.rev)), []);

  return (
    <ContactShadows
      position={[0, -1.0, 0]}
      opacity={LOOK.shadow}
      scale={7}
      blur={2.0}
      far={1.2}
      resolution={512}
      color="#000000"
    />
  );
}
