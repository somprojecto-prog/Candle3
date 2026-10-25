"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import BackdropGlow, { StageShadow } from "@/components/product/BackdropGlow";
import StudioLights from "@/components/product/StudioLights";
import Invalidator from "./Invalidator";
import StoryCameraRig from "./StoryCameraRig";
import StoryPlaceholder from "./StoryPlaceholder";
import { currentTarget } from "./storyCamera";

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

export default function StoryScene({ onReady }: { onReady: () => void }) {
  return (
    <>
      <StudioLights />
      <StoryCameraRig />
      <Invalidator />
      <BackdropGlow size={7} center={[0, 0, 0]} follow={currentTarget} />
      <StoryPlaceholder />
      <FirstFrame onReady={onReady} />
      <StageShadow />
    </>
  );
}
