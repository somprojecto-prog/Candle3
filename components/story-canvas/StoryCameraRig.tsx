"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleStoryCamera } from "./storyCamera";
import { smooth } from "./storySmooth";

export default function StoryCameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.height > 0 ? size.width / size.height : 1;
    sampleStoryCamera(smooth.phase, cam, aspect);
  });

  return null;
}