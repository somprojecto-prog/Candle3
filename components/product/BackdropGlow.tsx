"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { choreo } from "@/components/story-canvas/revealChoreo";
import { perfConfig } from "@/components/story-canvas/perfTier";
import { LOOK } from "./lookConfig";

interface BackdropGlowProps {
  size: number;
  center: [number, number, number];
  follow?: THREE.Vector3; // story: o centro segue o alvo da câmera
}

const MAX_PEAK = 0.12;
const BEHIND = 2;
const FLOOR_Y = -1.0 + 0.002;
const POOL_K = 0.2;
const GLOW_LAYER = 1; // fora da layer 0: o ContactShadows não os trata como oclusores

const _c = new THREE.Vector3();
const _dir = new THREE.Vector3();

/** Radial 256²: alpha 1→0 (smoothstep), alpha 0 na borda (sem aresta dura). */
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
  const haloMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }),
    [tex],
  );
  const poolMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }),
    [tex],
  );

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

/**
 * Sombra de contacto curta (far ≤ 1.2, blur ≤ 2.0). A opacidade segue LOOK.shadow × choreo.shadow
 * por frame (0.45× → 1.0× durante a abertura); fora do story choreo.shadow = 1.
 */
export function StageShadow() {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const perf = perfConfig();

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    if (!matRef.current) {
      g.traverse((o) => {
        if (!matRef.current && o instanceof THREE.Mesh && o.material instanceof THREE.MeshBasicMaterial) {
          matRef.current = o.material;
        }
      });
    }
    if (matRef.current) matRef.current.opacity = LOOK.shadow * choreo.shadow;
  });

  return (
    <ContactShadows
      ref={ref}
      position={[0, -1.0, 0]}
      opacity={LOOK.shadow}
      scale={7}
      blur={perf.shadowBlur}
      far={1.2}
      resolution={perf.shadowRes}
      color="#000000"
    />
  );
}