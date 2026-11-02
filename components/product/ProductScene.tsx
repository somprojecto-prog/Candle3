"use client";

import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_PATH, type ProductView } from "@/lib/constants";
import BackdropGlow, { StageShadow } from "./BackdropGlow";
import { camState } from "./camState";
import { GLB_DRACO, USE_GLB } from "./config";
import GlbBoundary from "./GlbBoundary";
import ProductModel from "./ProductModel";
import ProductPlaceholder from "./ProductPlaceholder";
import StudioLights from "./StudioLights";
import { VIEWS, viewDist } from "./views";

if (USE_GLB) useGLTF.preload(MODEL_PATH, GLB_DRACO);

export interface DebugCamera {
  azim?: number;
  elev?: number;
  dist?: number;
  fov?: number;
  targetY?: number;
}

interface ProductSceneProps {
  view: ProductView;
  onReady: () => void;
  debugCamera?: DebugCamera;
}

const D2R = Math.PI / 180;
const _sph = new THREE.Spherical();
const _off = new THREE.Vector3();

/** Câmera esférica; distância derivada de `fit`. Escreve o azimute para luzes/ambiente (por-canvas em scene.userData). */
function CameraSetup({ view, debug }: { view: ProductView; debug?: DebugCamera }) {
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  const cfg = VIEWS[view];
  const dbg = process.env.NODE_ENV !== "production" ? debug : undefined;
  const azim = dbg?.azim ?? cfg.camera.azim;
  const elev = dbg?.elev ?? cfg.camera.elev;
  const fov = dbg?.fov ?? cfg.camera.fov;
  const fixedDist = dbg?.dist;
  const [tx, , tz] = cfg.camera.target;
  const ty = dbg?.targetY ?? cfg.camera.target[1];

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = height > 0 ? width / height : 1;
    const dist = fixedDist ?? viewDist(cfg, aspect, fov);

    _sph.set(dist, Math.PI / 2 - THREE.MathUtils.clamp(elev, -89, 89) * D2R, azim * D2R);
    _off.setFromSpherical(_sph);
    cam.position.set(tx + _off.x, ty + _off.y, tz + _off.z);
    cam.fov = fov;
    cam.near = 0.1;
    cam.far = 60;
    cam.updateProjectionMatrix();
    cam.lookAt(tx, ty, tz);
    cam.updateMatrixWorld();

    const az = Math.atan2(_off.x, _off.z);
    scene.userData.lookAzim = az;
    camState.azim = az;
    invalidate();
  }, [camera, scene, invalidate, width, height, cfg, azim, elev, fov, fixedDist, tx, ty, tz]);

  return null;
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });

  return null;
}

/** Vista estática: sem drag, sem rotação, sem flutuação. */
export default function ProductScene({ view, onReady, debugCamera }: ProductSceneProps) {
  const cfg = VIEWS[view];

  const placeholder = (
    <>
      <ProductPlaceholder view={view} />
      <FirstFrame onReady={onReady} />
    </>
  );

  return (
    <>
      <StudioLights />
      <CameraSetup view={view} debug={debugCamera} />
      <BackdropGlow size={6.5} center={cfg.camera.target} />

      {USE_GLB ? (
        <GlbBoundary fallback={placeholder}>
          <Suspense fallback={null}>
            <ProductModel view={view} />
            <FirstFrame onReady={onReady} />
          </Suspense>
        </GlbBoundary>
      ) : (
        placeholder
      )}

      <StageShadow />
    </>
  );
}