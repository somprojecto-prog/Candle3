"use client";

import { Suspense, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import BackdropGlow, { StageShadow } from "@/components/product/BackdropGlow";
import { USE_GLB } from "@/components/product/config";
import GlbBoundary from "@/components/product/GlbBoundary";
import StudioLights from "@/components/product/StudioLights";
import Invalidator from "./Invalidator";
import { choreo } from "./revealChoreo";
import { currentTarget } from "./storyCamera";
import StoryCameraRig from "./StoryCameraRig";
import StoryPlaceholder from "./StoryPlaceholder";
import StoryProduct from "./StoryProduct";

function FirstFrame({ onReady }: { onReady: () => void }): null {
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

/** `visible` → opacity do <canvas> (só compositor), escrita apenas quando muda > 0.002. Nunca em materiais. */
function CanvasVisibility(): null {
  const last = useRef(-1);
  useFrame(({ gl }) => {
    const v = choreo.visible;
    const t = v < 0.002 ? 0 : v > 0.998 ? 1 : v;
    if (Math.abs(t - last.current) > 0.002 || (t !== last.current && (t === 0 || t === 1))) {
      last.current = t;
      gl.domElement.style.opacity = String(t);
    }
  });
  return null;
}

export default function StoryScene({ onReady }: { onReady: () => void }) {
  const placeholder = (
    <>
      <StoryPlaceholder />
      <FirstFrame onReady={onReady} />
    </>
  );

  return (
    <>
      <StudioLights />
      <StoryCameraRig />
      <Invalidator />
      <CanvasVisibility />
      <BackdropGlow size={7} center={[0, 0, 0]} follow={currentTarget} />

      {USE_GLB ? (
        <GlbBoundary fallback={placeholder}>
          <Suspense fallback={null}>
            <StoryProduct />
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